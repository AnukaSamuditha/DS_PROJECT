import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/Providers/AuthProvider";
import { redirect } from "react-router";
import { socket } from "../Socket/socket";
import GoogleMapContainer from "./GoogleMapContainer";
import { CircleArrowLeft, Clock, Handshake, Navigation } from "lucide-react";
import ProfilePicture from "../assets/profile_dummy.jpg";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

export function DeliveryLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/signup");
  }
}

export default function StartDelivery() {
  const { user } = useAuth();
  const [location, setLocation] = useState({ lng: null, lat: null });
  const [isTracking, setIsTracking] = useState(false);
  const [riders, setRiders] = useState([]);

  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const locationRef = useRef(location);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!isTracking) return;

    const handleUpdateRider = async (driver) => {
      setRiders((prevRiders) => {
        const isRiderExists = prevRiders.find(
          (rider) => rider.riderId === driver.riderId
        );
        if (isRiderExists) {
          return prevRiders.map((rider) => {
            return rider.riderId === driver.riderId
              ? { ...rider, lat: driver.lat, lng: driver.lng }
              : rider;
          });
        }

        return [...prevRiders, driver];
      });
    };

    socket.on("updatedRider", handleUpdateRider);

    return () => {
      socket.off("updatedRider", handleUpdateRider);
    };
  }, [isTracking]);

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
    refetch();
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
        { enableHighAccuracy: true }
      );

      intervalIdRef.current = setInterval(() => {
        console.log("Sending rider location...");
        socket.emit("riderLocation", {
          location: locationRef.current,
          riderId: user._id,
          riderName: user.username,
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
  }, [isTracking, user._id]);

  const {
    data: currentLocationData,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["convert_coords"],
    queryFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_PREFIX}/delivers/convert-coords`,
        location,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    enabled: !location,
  });

  return (
    <section className="w-full h-screen flex justify-center items-center p-[16px] gap-5 bg-white">
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
              {user && user.username}
            </h4>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-center">
          <div className="w-full h-[30%] rounded-xl bg-[#F7F7F7] flex flex-col justify-start items-start p-[16px]">
            <div className="w-full h-auto flex justify-between items-center">
              <h5 className="text-lg font-bold text-zinc-900 ">
                Start Deliverying Today!
              </h5>
              <button
                disabled={isPending}
                onClick={() => setIsTracking((prev) => !prev)}
                className="w-[105px] h-[33px] rounded-full text-center flex justify-center items-center bg-black text-white text-sm font-medium tracking-tight"
              >
                Start
              </button>
            </div>
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
                {isPending ? (
                  <h5 className="text-zinc-400 font-normal text-xs tracking-tight">
                    {currentLocationData}
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
        <GoogleMapContainer isRiderMap={true} riders={riders} />
      </div>
    </section>
  );
}
