import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/Providers/AuthProvider";
import { data, redirect } from "react-router";
import { socket } from "../Socket/socket";
import GoogleMapContainer from "./GoogleMapContainer";
import { CircleArrowLeft, Clock, Handshake, Map, Navigation, Package } from "lucide-react";
import ProfilePicture from "../assets/profile_dummy.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import EmptyBox from "@/assets/empty-box.png";
import AlertDialogPopup from "./ui/AlertDialog";


export default function StartDelivery({isLoaded}) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useState({ lng: null, lat: null });
  const [isTracking, setIsTracking] = useState(user.user.isDelivering);
  const [riders, setRiders] = useState([]);
  const [showDeliveryPopup,setShowDelivery] = useState(false);

  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const locationRef = useRef(location);
  const orderRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("AuthProvider - isLoading updated:", isLoading);
    console.log("User is updated ", user.user);
  }, [isLoading]);

  useEffect(() => {
    if (
      locationRef.current.lat !== location.lat ||
      locationRef.current.lng !== location.lng
    ) {
      locationRef.current = location;
    }
  }, [location, isLoading]);

  useEffect(() => {
    if (!isTracking) return;

    const handleUpdateRider = async (drivers) => {
      setRiders(drivers);
    };

    socket.on("updatedRider", handleUpdateRider);

    return () => {
      socket.off("updatedRider", handleUpdateRider);
    };
  }, [isTracking]);

  //This is for handling getting delivery requests
  useEffect(()=>{
    if(!isTracking) return;

    const handleGettingOrder = (data)=>{
      console.log("delivery request received from a regular user")
      console.log(data);
      setShowDelivery(true);
    }

    socket.on("delivery_request",handleGettingOrder);

    return ()=>{
      socket.off("delivery_request",handleGettingOrder);
    }

  },[isTracking]);

  useEffect(() => {
    if (!isTracking) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
        },
        (error) => {
          console.log("Error fetching location ", error.message);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      intervalIdRef.current = setInterval(() => {
        console.log("Sending rider location...");
        socket.emit("riderLocation", {
          location: locationRef.current,
          riderId: user.user._id,
          riderName: user.user.username,
        });
      }, 5000);
    } else {
      console.error("Geolocation is not supported by this browser");
    }

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      socket.off("riderLocation");
    };
  }, [isTracking, user.user._id]);

  const { data: deliveryStatus } = useQuery({
    queryKey: ["isDeliverying", user.user.id],
    queryFn: async ({ queryKey }) => {
      const [_key, driverId] = queryKey;

      if (!driverId) {
        throw new Error("Driver id cannot be undefined!");
      }
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PREFIX}/delivers/${driverId}/status`,
        {
          withCredentials: true,
        }
      );
      setIsTracking(res.data.isDelivering);
      return res.data;
    },
    enabled: user.user._id ? true : false,
  });

  const {
    data: currentLocationData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["convert_cords"],
    queryFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PREFIX}/delivers/coords`,
        locationRef.current,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    enabled:
      locationRef.current.lat !== location.lat ||
      locationRef.current.lng !== location.lng,
  });

  const { mutateAsync, error } = useMutation({
    mutationFn: async (userId) => {
      if (!userId) {
        throw new Error("User id is not defined");
      }
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_PREFIX}/delivers/${userId}/deliver`,
        null,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setIsTracking((prev) => !prev);
      //queryClient.invalidateQueries(["isDeliverying"]);
    },
    onError: (error) => {
      setIsTracking(false);
      console.log("Error in enabling tracking!", error.message);
    },
  });

  const handleDeliveryEnabling = async (userId) => {
    if (!userId) {
      throw new Error("Driver is required!");
    }
    await mutateAsync(userId);
    refetch();
  };


  return (
    <section className="w-full h-screen flex justify-center items-center p-[16px] gap-5 bg-white">
      {showDeliveryPopup && <AlertDialogPopup isOpen={showDeliveryPopup} handlePopupOpen={()=>setShowDelivery((prev)=>!prev)}/>}
      <div className="w-1/2 h-full justify-center items-center">
        <div className="w-full h-[4rem] flex justify-between items-start">
          <CircleArrowLeft color="black" size={20} className="cursor-pointer" />
          <div className="w-auto h-auto flex justify-center items-center gap-3">
            <img
              src={ProfilePicture}
              alt="profile-picture"
              className="w-[30px] h-[30px] rounded-full"
            />
            <h4 className="text-black font-semibold text-sm tracking-tight">
              {isLoading ? (
                <Skeleton className="w-[90%] h-5 rounded-full" />
              ) : (
                user.user.username
              )}
            </h4>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-center">
          <div className="w-full h-[30%] rounded-xl bg-[#F7F7F7] flex flex-col justify-start items-start p-[16px]">
            <div className="w-full h-auto flex justify-between items-center">
              <h5 className="text-lg font-medium text-zinc-900 flex gap-3 items-center justify-center">
                <Package color="black"/>Start Deliverying Today!
              </h5>
              <button
                disabled={isFetching}
                onClick={() => {
                  handleDeliveryEnabling(user.user._id);
                }}
                className={`w-[105px] h-[33px] rounded-full text-center flex justify-center items-center bg-black text-white text-sm font-medium tracking-tight ${
                  isFetching || (isTracking && "bg-gray-300")
                }`}
              >
                {isFetching ? "Starting..." : isTracking ? "Stop" : "Start"}
              </button>
            </div>
          </div>
          <div className="w-full h-[70%] flex flex-col justify-center items-center mt-[25%]">
            <img src={EmptyBox} alt="no-orders-icon" className="w-[5rem] h-[5rem] z-50"/>
            <h3 className="text-md font-regular text-[#a09f9f]">No orders yet!</h3>
         </div>
        </div>
        
      </div>
      <div className="w-1/2 h-full flex justify-center items-center relative z-20">
        <div className="absolute w-full top-2 h-[12%] flex justify-center items-center z-50">
          <div className="w-[90%] h-full bg-white rounded-xl p-[16px] flex justify-evenly items-center gap-5">
            <div className="w-auto h-auto flex justify-center items-center gap-2">
              <div className="w-auto h-[full] flex flex-col justify-start items-start mb-3">
                <Navigation size={19} className="text-green-400" />
              </div>
              <div>
                <h5 className="text-black font-semibold text-sm tracking-tight">
                  Current Location
                </h5>
                {currentLocationData ? (
                  <h5 className="text-zinc-400 font-normal text-xs tracking-tight">
                    {currentLocationData?.address?.split(" ")[1]}{" "}
                    {currentLocationData?.address?.split(" ")[2]}{" "}
                    {currentLocationData?.address?.split(",")[1]}
                  </h5>
                ) : (
                  <Skeleton className="w-[90%] h-5 rounded-full" />
                )}
              </div>
            </div>

            <div className="w-auto h-auto flex justify-center items-center gap-2">
              <div className="w-auto h-[full] flex flex-col justify-start items-start mb-3">
                <Clock size={19} className="text-green-400" />
              </div>
              <div>
                <h5 className="text-black font-semibold text-sm tracking-tight">
                  Duration
                </h5>
                <h5 className="text-zinc-400 font-normal text-xs tracking-tight">
                  3h
                </h5>
              </div>
            </div>

            <div className="w-auto h-auto flex justify-center items-center gap-2">
              <div className="w-auto h-[full] flex flex-col justify-start items-start mb-3">
                <Handshake size={19} className="text-green-400" />
              </div>
              <div>
                <h5 className="text-black font-semibold text-sm tracking-tight">
                  Orders done
                </h5>
                <h5 className="text-zinc-400 font-normal text-xs tracking-tight">
                  3
                </h5>
              </div>
            </div>
          </div>
        </div>
        <GoogleMapContainer
          isLoaded={isLoaded}
          isRiderMap={user.user.role==='driver' ? true : false}
          riders={isTracking ? riders : []}
        />
      </div>
    </section>
  );
}
