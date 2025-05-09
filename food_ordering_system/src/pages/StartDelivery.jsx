import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/Providers/AuthProvider";
import { socket } from "../Socket/socket";
import GoogleMapContainer from "../components/GoogleMapContainer";
import {
  CircleArrowLeft,
  Clock,
  Handshake,
  Navigation,
  Package,
  LandPlot,
  MapPin,
  Truck,
} from "lucide-react";
import ProfilePicture from "../assets/profile_dummy.jpg";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "../components/ui/skeleton";
import EmptyBox from "@/assets/empty-box.png";
import AlertDialogPopup from "../components/ui/AlertDialog";
import Order from "../components/ui/Order";
import OrderTab from "../components/ui/OrderTab";

export default function StartDelivery({ isLoaded }) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useState({ lng: null, lat: null });
  const [updatedLocation, setUpdatedLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(user.user.isDelivering);
  const [riders, setRiders] = useState([]);
  const [showDeliveryPopup, setShowDelivery] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isPicked, setIsPicked] = useState(false);

  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const locationRef = useRef(location);
  const riderId = useMemo(() => user?.user?._id, [user]);

  useEffect(() => {
    console.log("AuthProvider - isLoading updated:", isLoading);
    console.log("User is updated ", user.user);
  }, [isLoading]);

  useEffect(() => {
    if (
      location &&
      location.lat &&
      location.lng
      // locationRef.current.lat !== location.lat ||
      // locationRef.current.lng !== location.lng
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
  useEffect(() => {
    if (!isTracking || !socket) return;

    const handleGettingOrder = (data) => {
      console.log("delivery request received from a regular user");
      setShowDelivery(true);
      setOrder(data.order);
    };

    socket.on("delivery_request", handleGettingOrder);

    return () => {
      socket.off("delivery_request", handleGettingOrder);
    };
  }, [isTracking]);

  useEffect(() => {
    if (isTracking && riderId) {
      socket.emit("rider_location_request", {
        riderId,
      });

      socket.on("rider_location_updated", (data) => {
        if (data.riderId === riderId) {
          console.log("updated rider id ", data.riderLocation);
          setUpdatedLocation(data.riderLocation[0]);
        }
      });
    }

    return () => {
      socket.emit("tracking_rider_stop");
      socket.off("rider_location_updated");
    };
  }, [isTracking]);

  const handleAcceptOrder = () => {
    socket.emit(
      "rider_response",
      {
        orderId: order._id,
        riderId: riderId,
        response: "accepted",
      },
      (res) => {
        if (res.success) {
          console.log("Order accepted successfully.");
          setOrderStatus("accepted");
        } else {
          console.log("Failed to accept the order!");
        }
      }
    );
  };

  const handleRejectOrder = () => {
    console.log("reject method is called");
    socket.emit(
      "rider_response",
      {
        orderId: order._id,
        riderId: riderId,
        response: "rejected",
      },
      (res) => {
        if (res.success) {
          console.log("Order rejected successfully.");
        } else {
          console.log("Failed to reject the order!", res);
        }
      }
    );
  };

  useEffect(() => {
    if (!isTracking || !riderId) {
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
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );

      intervalIdRef.current = setInterval(() => {
        console.log("location state ", location);
        if (
          locationRef.current &&
          locationRef.current.lat &&
          locationRef.current.lng
        ) {
          console.log("Sending rider location...");
          socket.emit("riderLocation", {
            location: locationRef.current,
            riderId: riderId,
            riderName: user.user.username,
          });
        }
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
  }, [isTracking, riderId]);

  const { data: deliveryStatus, refetch: fetchDeliveryStatus } = useQuery({
    queryKey: ["isDeliverying", riderId],
    queryFn: async ({ queryKey }) => {
      const [_key, driverId] = queryKey;

      if (!driverId) {
        throw new Error("Driver id cannot be undefined!");
      }
      const res = await axios.get(
        `${import.meta.env.VITE_DELIVERY_SERVICE_PREFIX}/delivers/${driverId}/status`,
        {
          withCredentials: true,
        }
      );
      setIsTracking(res.data.isDelivering);
      return res.data;
    },
    enabled: riderId ? true : false,
  });

  const { data: currentOrderStatus, isFetched } = useQuery({
    queryKey: ["order_status", order?._id],

    queryFn: async () => {
      if (!order._id) {
        console.log("Order id is undefined!");
        return;
      }
      const res = await axios.get(
        `${import.meta.env.VITE_DELIVERY_SERVICE_PREFIX}/orders/status/${order._id}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data) {
        console.log("order not found!");
        return;
      }

      return res.data.status.status;
    },
    refetchInterval: 4000,
    enabled: !!order?._id && isTracking,
    retryOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(()=>{
    if(currentOrderStatus === "completed"){
      setOrder(null);
    }
  },[currentOrderStatus]);

  const {
    data: currentLocationData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["convert_cords"],
    queryFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_DELIVERY_SERVICE_PREFIX}/delivers/coords`,
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
        `${import.meta.env.VITE_DELIVERY_SERVICE_PREFIX}/delivers/${userId}/deliver`,
        null,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setIsTracking((prev) => !prev);
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
  };

  const handleIsPickEnabling = (event) => {
    setIsPicked(event.target.checked);
  };

  const dayOrdersQuery = useQuery({
    queryKey: ["day_orders"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_DELIVERY_SERVICE_PREFIX}/orders/day/${user.user._id}`,
        {
          withCredentials: true,
        }
      );

      return res.data.orders;
    },
    retryOnMount: true,
  });

  return (
    <section className="w-full h-screen lg:flex justify-center items-center p-[16px] gap-5 bg-white overflow-y-scroll scrollbar-hide">
      {showDeliveryPopup && (
        <AlertDialogPopup
          title={"Delivery Request"}
          accept={"Accept"}
          deny={"Deny"}
          isOpen={showDeliveryPopup}
          handlePopupOpen={() => setShowDelivery((prev) => !prev)}
          order={order}
          onAccept={handleAcceptOrder}
          onReject={handleRejectOrder}
        >
          <div className="w-full px-5 py-3 flex flex-col gap-2 justify-center items-start ">
            <h4 className="w-full text-sm font-medium tracking-tight text-gray-400 flex gap-2">
              <MapPin color="black" size={17} /> Food delivery request to{" "}
              <span className="text-black">
                {order.user.location.address ? (
                  order.user.location.address.split(",")[1] +
                  ", " +
                  order.user.location.address.split(",")[2]
                ) : (
                  <Skeleton className="w-[30%] h-5 rounded-full" />
                )}
              </span>
            </h4>
            <h4 className="text-sm font-medium tracking-tight text-gray-400 flex gap-2">
              <LandPlot color="black" size={17} /> Distance :{" "}
              {order ? (
                order.distanceFromShopToUser + "km"
              ) : (
                <Skeleton className="w-[30%] h-5 rounded-full" />
              )}
            </h4>
            <h4 className="text-sm font-medium tracking-tight text-gray-400 flex gap-2">
              <Truck color="black" size={17} />
              Amount :{" "}
              <span className="text-green-500">
                {order ? (
                  "Rs. " + order.deliveryFee
                ) : (
                  <Skeleton className="w-[30%] h-5 rounded-full" />
                )}
              </span>
            </h4>
          </div>
        </AlertDialogPopup>
      )}
      <div className="lg:w-1/2 w-full h-full justify-center items-center">
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
                <Package color="black" />
                Start Deliverying Today!
              </h5>
              <button
                disabled={isFetching || (order && order._id)}
                onClick={() => {
                  handleDeliveryEnabling(riderId);
                }}
                className={`w-[105px] h-[33px] rounded-full text-center flex justify-center items-center bg-black text-white text-sm font-medium tracking-tight ${
                  isFetching || (isTracking && "bg-gray-300")
                }`}
              >
                {isFetching ? "Starting..." : isTracking ? "Stop" : "Start"}
              </button>
            </div>
          </div>

          {order === null && (
            <div className="w-full h-auto flex flex-col justify-center items-center mt-[25%] ">
              <img
                src={EmptyBox}
                alt="no-orders-icon"
                className="w-[5rem] h-[5rem] z-50"
              />
              <h3 className="text-md font-regular text-[#a09f9f]">
                No orders yet!
              </h3>
            </div>
          )}

          <div className="mt-16 w-full h-auto">
            {(orderStatus == "accepted" && order) && (
              <Order status={currentOrderStatus} order={order} />
            )}
          </div>

          {isFetched &&
            currentOrderStatus &&
            currentOrderStatus === "reached" && (
              <div className="w-full h-auto flex justify-start items-center">
                <div className="w-full h-[3rem] bg-yellow-50 border border-yellow-200 mt-5 rounded-xl flex justify-start items-center gap-3 px-4 py-3 ">
                  <input
                    type="checkbox"
                    name="isPicked"
                    onChange={handleIsPickEnabling}
                    className="w-4 h-4 border-2 border-blue-400  rounded-xl"
                  />
                  <span className="text-sm font-medium tracking-tight text-black">
                    Confirm order pickup
                  </span>
                </div>
              </div>
            )}
          {dayOrdersQuery &&
            dayOrdersQuery.data &&
            dayOrdersQuery.data.length > 0 && (
              <div className="w-full mt-5">
                <div className="w-full h-[3rem] flex justify-start items-center border-b border-b-[#E5E5E5]">
                  <h4 className="text-sm tracking-tight text-black font-semibold">
                    Completed Orders
                  </h4>
                </div>
                <div className="w-full h-[8rem] max-h-[8rem] overflow-y-scroll mt-2 flex flex-col justify-start items-start scrollbar-hide">
                  {dayOrdersQuery.data.length > 0 &&
                    dayOrdersQuery.data.map((order,index) => {
                      return <OrderTab key={index} order={order} />;
                    })}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="lg:w-1/2 w-full h-full flex justify-center items-center relative z-20">
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
                  {dayOrdersQuery.data ? dayOrdersQuery.data.length : 0}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <GoogleMapContainer
          isLoaded={isLoaded}
          isRiderMap={user.user.role === "driver" ? true : false}
          isTracking={isTracking}
          isPicked={isPicked}
          singleRider={
            locationRef.current && updatedLocation
              ? {
                  location: locationRef.current,
                  updatedLocation,
                  riderId: riderId,
                  username: user.user.username,
                }
              : null
          }
          order={orderStatus === "accepted" && order ? order : null}
          userLocation={order && order.user}
        />
      </div>
    </section>
  );
}
