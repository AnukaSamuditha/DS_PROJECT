import { Check, PhoneCallIcon } from "lucide-react";
import ProfilePicture from "@/assets/profile_dummy.jpg";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Rating } from "react-simple-star-rating";
import { Skeleton } from "./skeleton";

export function RiderTab({ riderInfo }) {
  
  return (
    <div className="w-full h-[3rem] rounded-xl bg-white px-5 py-3 flex justify-between items-center">
      <div className="w-auto flex justify-start items-center gap-3">
        <img src={ProfilePicture} className="w-8 h-8 rounded-full " />
        <h6 className="text-black font-medium tracking-tight text-sm">
          {riderInfo && riderInfo.username.charAt(0).toUpperCase() + riderInfo.username.slice(1)}
        </h6>
        {riderInfo ? <Rating initialValue={Number(riderInfo.averageRating)} readonly={true} size={20}/> : <Skeleton className="w-8 h-3 rounded-xl"/>}
      </div>
      <div className="w-[2rem] h-[2rem] bg-black rounded-full flex justify-center items-center gap-2">
        <PhoneCallIcon size={15} color="white" />
      </div>
    </div>
  );
}

export default function OrderProcess({ orderId,isOrderLive }) {

  const { data : status, isFetched,isLoading } = useQuery({
    queryKey: ["order_data",orderId],
    queryFn: async () => {

      if(!orderId){
        console.log("Order id is not available");
        return;
      }

      const res = await axios.get(
        `${
          import.meta.env.VITE_DELIVERY_SERVICE_PREFIX
        }/orders/status/${orderId}`,
        {
          withCredentials: true,
        }
      );

      if (!res) {
        console.log("order not found!");
        return;
      }
      
      return res.data.status.status;
    },
    enabled: !!orderId && isOrderLive,  
    refetchOnMount:true,
    refetchOnWindowFocus:true,
    refetchInterval:1000
  });
  
  
  if(status && status === "pending" || orderId === null || isLoading || !isOrderLive){
    return;
  }

  if(status){
    console.log("Is order status updated",status)
  }
  return (
    <section className="w-full h-auto px-[16px] mt-10 mb-10">
      {/* Placed */}
      <div className="w-full h-[3rem] flex justify-start items-center gap-3 border-b border-b-[#E5E5E5] py-4">
        <div
          className={`w-4 h-4 rounded-full ${
            status && status === "order_accepted" ||
            status && status === "reached" ||
            status && status === "picked" ||
            status && status === "onTheWay" ||
            status && status === "delivered"
              ? "bg-green-400"
              : "border border-dashed border-green-400"
          } flex justify-center items-center`}
        >
          {(status && status === "order_accepted" ||
            status && status === "reached" ||
            status && status === "picked" ||
            status && status === "onTheWay" ||
            status && status === "delivered") && (
            <Check size={12} className="text-black border-green-400" />
          )}
        </div>
        <h5 className="text-sm font-medium tracking-tight text-black">
          Placed
        </h5>
      </div>

      {/* Picked */}
      <div className="w-full h-[3rem] flex justify-start items-center gap-3 border-b border-b-[#E5E5E5] py-4">
        <div
          className={`w-4 h-4 rounded-full ${
            status && status === "picked" ||
            status && status === "onTheWay" ||
            status && status === "delivered"
              ? "bg-green-400"
              : "border border-dashed border-green-400"
          } flex justify-center items-center`}
        >
          {(status && status === "picked" ||
            status && status === "onTheWay" ||
            status && status === "delivered") && (
            <Check size={12} className="text-black border-green-400" />
          )}
        </div>
        <h5 className="text-sm font-medium tracking-tight text-black">
          Picked by the rider
        </h5>
      </div>

      {/* On the way */}
      <div className="w-full h-[3rem] flex justify-start items-center gap-3 border-b border-b-[#E5E5E5] py-4">
        <div
          className={`w-4 h-4 rounded-full ${
            status && status === "onTheWay" || status && status === "delivered"
              ? "bg-green-400"
              : "border border-dashed border-green-400"
          } flex justify-center items-center`}
        >
          {(status && status === "onTheWay" || status && status === "delivered") && (
            <Check size={12} className="text-black border-green-400" />
          )}
        </div>
        <h5 className="text-sm font-medium tracking-tight text-black">
          On the way
        </h5>
      </div>

      {/* Delivered */}
      <div className="w-full h-[3rem] flex justify-start items-center gap-3 border-b border-b-[#E5E5E5] py-4">
        <div
          className={`w-4 h-4 rounded-full ${
            status && status === "delivered"
              ? "bg-green-400"
              : "border border-dashed border-green-400"
          } flex justify-center items-center`}
        >
          {status && status === "delivered" && (
            <Check size={12} className="text-black border-green-400" />
          )}
        </div>
        <h5 className="text-sm font-medium tracking-tight text-black">
          Delivered
        </h5>
      </div>
    </section>
  );
}
