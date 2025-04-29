import { CircleCheck, MapPin } from "lucide-react";

export default function OrderTab({order}){
    console.log("order tab data ",order)
    return(
        <div className="w-full h-[3rem] bg-white flex justify-start items-center gap-4 border-b border-b-[#E5E5E5]">
            <h5 className="w-1/4 text-xs font-normal text-black tracking-tight overflow-ellipsis">#{order && order._id}</h5>
            <div className="w-1/4 h-[3rem] flex justify-center items-center gap-1">
                <CircleCheck size={15} className="text-green-400"/>
                <h5 className="text-xs tracking-tight font-medium text-black">{order && order.status === "completed" && "Completed"}</h5>
            </div>
            <h6 className="w-1/4 text-sm tracking-tight text-gray-400 flex justify-center items-center gap-1"><MapPin size={15} className="text-gray-400" />{order && order.shop.name}</h6>
            <h6 className="w-1/4 text-xs tracking-tight text-green-400 font-medium text-center">Rs.{order.deliveryFee}</h6>
        </div>
    )
}