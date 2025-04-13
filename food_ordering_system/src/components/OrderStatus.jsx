import { useEffect, useState } from "react";
import { useAuth } from "@/Providers/AuthProvider";
import { redirect, useLocation } from "react-router";
import { socket } from "../Socket/socket";
import GoogleMapContainer from "./GoogleMapContainer";
import { CircleArrowLeft, ArrowRightCircle } from "lucide-react";
import ProfilePicture from "../assets/profile_dummy.jpg";
import Timeline from "./TimeLine";
import { Skeleton } from "./ui/skeleton";
import OrderTimeline from "./OrderTimeline";

export default function OrderStatus({ isLoaded }) {
  const { user } = useAuth();
  const location = useLocation();
  const order = location.state.order || {};
  const [isOrderlive, setOrderLive] = useState(false);
  const [distanceInKm, setDistanceInKm] = useState(null);
  const [deliveryCost, setDeliveryCost] = useState(null);

  useEffect(() => {
    if (!isOrderlive) {
      return;
    }

    const updatedOrder = {
      ...order,
      deliveryFee: deliveryCost,
    };

    socket.emit("order_delivery_request", {
      orderId: order._id,
      order: updatedOrder,
      user: order.user,
    });
  }, [isOrderlive]);

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

  return (
    <section className="w-full h-auto flex justify-center items-center p-[16px] gap-5 bg-white">
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
              {user.user.username}
            </h4>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-center">
          <div className="w-full h-[30%] rounded-xl bg-[#F7F7F7] flex flex-col justify-start items-start p-[16px]">
            <div className="w-full h-auto flex justify-between items-center">
              <h5 className="text-md font-bold text-zinc-800 tracking-tight">
                Order :{" "}
                {order ? (
                  <span className="font-normal">#{order._id}</span>
                ) : (
                  <Skeleton className="w-[70px] h-[20px] rounded-full border border-green-800" />
                )}
              </h5>
              <div className="w-[105px] h-[33px] rounded-full text-center flex justify-center items-center bg-blue-500 text-white text-sm font-medium tracking-tight">
                {order.status}
              </div>
            </div>
            {/* <Timeline/> */}
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
      <div className="w-1/2 h-full flex justify-center items-center">
        <GoogleMapContainer isLoaded={isLoaded} isRiderMap={false} />
      </div>
    </section>
  );
}
