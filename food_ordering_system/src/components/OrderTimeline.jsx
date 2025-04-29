import {
  BadgeDollarSign,
  ClipboardList,
  LandPlot,
  MapPinPlus,
  Soup,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function OrderTimeline({ order, isLoaded,distanceInKm, deliveryCost }) {
  //const distanceInKm = useRef(null);
  
  return (
    <div className="flex flex-col items-start  p-4">
      <div className="flex items-start space-x-4">
        <div className="w-4 h-4 border-2 border-black bg-transparent rounded-full relative">
          <div className="ml-1 border-l-2 border-gray-300 h-[4rem] mb-10 absolute top-8"></div>
        </div>
        <div className="flex flex-col gap-2 h-auto">
          <p className="text-gray-800 text-sm font-semibold">Order Placed</p>
          <div className="font-normal text-[#787676] text-xs flex gap-2 justify-start items-center">
            <Store size={17} /> {order && order.shop.name}
          </div>
          <div className="font-normal text-[#787676] text-xs flex gap-2 justify-start items-center">
            <Soup size={17} />
            Items :{" "}
            {order &&
              order.items.map((item, index) => (
                <span key={index}>{item.name}</span>
              ))}
          </div>
          <div className="font-normal text-[#787676] text-xs flex gap-2 justify-start items-center">
            <BadgeDollarSign size={17} />
            Subtotal : Rs. {order && order.amount}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 ">
        <div className="w-4 h-4 bg-black rounded-full mb-6 relative">
          <div className="ml-1.5 border-l-2 border-gray-300 h-[3.5rem] mb-10 absolute top-8"></div>
        </div>
        <div className="flex flex-col gap-2 h-auto pt-7">
          <p className="text-gray-800 text-sm font-semibold">Delivery Fee</p>
          <div className="font-normal text-[#787676] text-xs flex gap-2 justify-start items-center">
            <LandPlot size={17} />
            Distance :{" "}
            {distanceInKm ? (
              distanceInKm + " km"
            ) : (
              <Skeleton className="w-[120px] h-[25px] rounded-full" />
            )}
          </div>
          <div className="font-normal text-[#787676] text-xs flex gap-2 justify-start items-center">
            <Truck size={17} />
            Fee :{" "}
            {deliveryCost ? (
              "Rs. " + deliveryCost
            ) : (
              <Skeleton className="w-[120px] h-[25px] rounded-full" />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 ">
        <div className="w-4 h-4 bg-blue-500 rounded-full mb-9"></div>
        <div className="flex flex-col gap-2 h-auto pt-10">
          <p className="text-gray-800 text-sm font-semibold">Total</p>
          <div className="font-normal text-[#787676] text-xs flex gap-2 justify-start items-center">
            <ClipboardList size={17} />
            Subtotal :{" "}
            {order.amount ? (
              "Rs. " + order.amount
            ) : (
              <Skeleton className="w-[120px] h-[25px] rounded-full" />
            )}
          </div>
          <div className="font-normal text-[#787676] text-xs flex gap-2 justify-start items-center">
            <MapPinPlus size={17} />
            Delivery :{" "}
            {deliveryCost ? (
              "Rs. " + deliveryCost
            ) : (
              <Skeleton className="w-[120px] h-[25px] rounded-full" />
            )}
          </div>
          <div className="font-semibold text-black text-xs flex gap-2 justify-start items-center">
            <Wallet size={17} />
            Total :{" Rs. "}
            {order && deliveryCost ? (
              Number(order.amount) + Number(deliveryCost)
            ) : (
              <Skeleton className="w-[120px] h-[25px] rounded-full" />
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
