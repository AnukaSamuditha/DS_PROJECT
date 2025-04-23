import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/Providers/AuthProvider";
import { useLocation } from "react-router";
import { socket } from "../Socket/socket";
import GoogleMapContainer from "./GoogleMapContainer";
import { CircleArrowLeft, ArrowRightCircle } from "lucide-react";
import ProfilePicture from "../assets/profile_dummy.jpg";
import { Skeleton } from "./ui/skeleton";
import OrderTimeline from "./OrderTimeline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import OrderProcess, { RiderTab } from "./ui/OrderProcess";

export default function OrderStatus({ isLoaded }) {
  const { user } = useAuth();
  const location = useLocation();
  const order = location.state || {};
  const [isOrderlive, setOrderLive] = useState(false);
  const [distanceInKm, setDistanceInKm] = useState(null);
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [acceptedRiderId, setAcceptedRiderId] = useState(null);
  const [acceptedRiderLocation, setRiderLocation] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const isLoadedAcceptedRider = useRef(false);
  const accRiderIdRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOrderlive) {
      return;
    }

    // const updatedOrder = {
    //   ...order,
    //   deliveryFee: deliveryCost,
    //   distanceFromShopToUser:distanceInKm
    // };

    // socket.emit("order_delivery_request", {
    //   orderId: order._id,
    //   order: updatedOrder,
    //   user: order.user,
    // });

    orderUpdateMutation.mutate();
  }, [isOrderlive]);

  useEffect(() => {
    if (!isOrderlive) {
      return;
    }

    const handleDeliveryRequestAccept = (data) => {
      //console.log("accepted rider id ", data.riderId);
      // orderRiderMutation.mutate();
      if (!isLoadedAcceptedRider.current) {
        if (data.riderId) {
          accRiderIdRef.current = data.riderId
          setAcceptedRiderId(data.riderId);
          orderStatusMutation.mutate();
          isLoadedAcceptedRider.current = true;
        }
      }
    };

    const handleRiderArrival = (data)=>{

    }
    socket.on("order_accepted", handleDeliveryRequestAccept);

    socket.on("rider_arrived",handleRiderArrival);

    return () => {
      socket.off("order_accepted", handleDeliveryRequestAccept);
    };
  }, [isOrderlive]);


  useEffect(()=>{
    if(acceptedRiderId){
      orderRiderMutation.mutate()
    }
  },[acceptedRiderId])

  const {
    data: acceptedRiderInfo,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["accepted_rider", acceptedRiderId],
    queryFn: async () => {
      console.log("accepted rider query runs..");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PREFIX}/users/${acceptedRiderId}`,
        {
          withCredentials: true,
        }
      );
      console.log("fetch acc user data ", res.data);
      return res.data.user;
    },
    keepPreviousData: true,
    enabled: !!acceptedRiderId,
  });

  const orderUpdateMutation = useMutation({
    mutationFn: async () => {
      if (!order) {
        console.log("Order is not available!");
        return;
      }
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_PREFIX}/orders/${order._id}`,
        {
          deliveryFee: deliveryCost,
          totalAmount: deliveryCost + order.amount,
          distanceFromShopToUser: distanceInKm,
        },
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      socket.emit("order_delivery_request", {
        orderId: order._id,
        order: data.order,
        user: order.user,
      });
    },
    onError: (error) => {
      console.log("Error updating the order! ", error.message);
    },
  });

  const orderRiderMutation = useMutation({
    mutationFn: async () => {
      if (!acceptedRiderId) {
        console.log("Accepted rider id is not available!");
        return;
      }
      console.log("order rider mutation called")
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_PREFIX}/orders/${order._id}`,
        {
          driverId: acceptedRiderId
        },
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      console.log("Order driver id updated successfully",data)
    },
    onError: (error) => {
      console.log("Error updating the order driver id! ", error.message);
    },
  });

  const orderStatusMutation = useMutation({
    mutationFn: async () => {
      if (!order) {
        console.log("Order is not available!");
        return;
      }
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_PREFIX}/orders/${order._id}`,
        {
          status: "order_accepted",
        },
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      //queryClient.invalidateQueries(["order_status", order._id]);
      setOrderStatus(data.order.status);
    },
    onError: (error) => {
      console.log(
        "Error occured while updating the order status! ",
        error.message
      );
    },
  });

  const calculateDistance = (order) => {
    return new Promise((resolve, reject) => {
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          { lat: order.shop.location.lat, lng: order.shop.location.lng },
          { lat: order.user.location.lat, lng: order.user.location.lng }
        );
      const convertedDistance = (distance / 1000).toFixed(2);

      if (convertedDistance > 0) {
        resolve(convertedDistance);
      } else if (convertedDistance <= 0 || distance == undefined) {
        reject("Error in calculating the distance!");
      }
    });
  };

  const calculateCharge = () => {
    if (distanceInKm <= 0) {
      return;
    }

    const today = new Date();
    const hour = today.getHours();
    let ratePerKm = 0;

    if (hour >= 5 && hour < 12) {
      ratePerKm = 40;
    } else if (hour >= 12 && hour < 17) {
      ratePerKm = 45;
    } else if (hour >= 17 && hour < 21) {
      ratePerKm = 54;
    } else {
      ratePerKm = 60;
    }

    const cost = ratePerKm * distanceInKm;
    setDeliveryCost(cost.toFixed(2));
  };

  useEffect(() => {
    if (
      order &&
      order.shop &&
      window.google !== undefined &&
      window.google.maps &&
      window.google.maps.geometry &&
      isLoaded
    ) {
      calculateDistance(order)
        .then((distance) => {
          setDistanceInKm(distance);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoaded, order]);

  useEffect(() => {
    if (distanceInKm > 0) {
      calculateCharge();
    }
  }, [distanceInKm]);

  const { data: currentOrderStatus, isFetched } = useQuery({
    queryKey: ["order_status", order?._id],

    queryFn: async () => {
      if (!order._id) {
        console.log("Order id is undefined!");
        return;
      }
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PREFIX}/orders/status/${order._id}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data) {
        console.log("order not found!");
        return;
      }
      console.log("status A - OS ", res.data.status.status);
      return res.data.status.status;
    },
    enabled: !!order?._id,
    retryOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (currentOrderStatus) {
    console.log("order status from order status main", currentOrderStatus);
  }

  if (acceptedRiderLocation) {
    console.log("accepted rider location....", acceptedRiderLocation);
  }

  console.log("Accepted Rider Infor. from order status ", accRiderIdRef.current);

  return (
    <section className="w-full h-auto flex flex-col lg:flex-row justify-center items-start p-[16px] gap-5 bg-white">
      <div className="w-full lg:w-1/2 h-full justify-center items-center">
        <div className="w-full h-[4rem] flex justify-between items-start">
          <CircleArrowLeft color="black" size={20} className="cursor-pointer" />
          <div className="w-auto h-auto flex justify-center items-center gap-3">
            <img
              src={ProfilePicture}
              alt="profile-picture"
              className="w-[30px] h-[30px] rounded-full"
            />
            <h4 className="text-black font-semibold text-sm tracking-tight">
              {user.user.username}
            </h4>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-center">
          <div className="w-full h-auto rounded-xl bg-[#F7F7F7] flex flex-col justify-start items-start p-[16px]">
            <div className="w-full h-auto flex justify-between items-center">
              <h5 className="text-md font-bold text-zinc-800 tracking-tight">
                Order :{" "}
                {order ? (
                  <span className="font-normal">#{order._id}</span>
                ) : (
                  <Skeleton className="w-[70px] h-[20px] rounded-full" />
                )}
              </h5>
              <div className="w-auto h-[33px] px-4 py-2 rounded-full text-center flex justify-center items-center bg-blue-500 text-white text-sm font-medium tracking-tight">
                {isFetched &&
                  currentOrderStatus === "order_accepted" &&
                  "Accepted"}
                {isFetched && currentOrderStatus === "pending" && "Pending"}
                {isFetched && currentOrderStatus === "picked" && "Picked"}
              </div>
            </div>
            <OrderProcess isOrderLive={isOrderlive} orderId={order ? order._id : null} />
            {currentOrderStatus &&
              currentOrderStatus === "order_accepted" &&
              acceptedRiderInfo && (
                <RiderTab riderName={acceptedRiderInfo.username} />
              )}
            <OrderTimeline
              deliveryCost={deliveryCost}
              distanceInKm={distanceInKm}
              isLoaded={isLoaded}
              order={order}
            />
            <div className="w-full h-[3rem] flex justify-start items-center pl-11">
              <button
                onClick={() => setOrderLive((prev) => !prev)}
                className="w-auto h-[30px] rounded-full bg-black flex justify-center items-center gap-3 px-3 py-4 text-white text-sm font-medium cursor-pointer"
              >
                Continue{" "}
                <ArrowRightCircle
                  className="slide-left-right"
                  color="white"
                  size={17}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-auto flex justify-start items-start ">
        <GoogleMapContainer
          isLoaded={isLoaded}
          isRiderMap={false}
          userLocation={order.user}
          order={order}
          acceptedRiderId={acceptedRiderId}
          isTracking={isOrderlive}
        />
      </div>
    </section>
  );
}
