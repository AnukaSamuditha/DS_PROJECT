export default function Order({ order, status }) {
  return (
    <div className="w-full rounded-[12px] p-4 flex flex-col gap-3 bg-[#F7F7F7]">
      <div className="w-full flex justify-between items-center">
        <h4 className="text-sm font-semibold text-black tracking-tight">
          Order #{order && order._id}
        </h4>
        <div
          className={`w-auto h-[24px] rounded-full px-3 py-3 flex justify-center items-center gap-1
           ${status === "pending" && "bg-blue-500"} 
           ${status === "order_accepted" && "bg-orange-400"}
           ${status === "reached" && "bg-orange-400"}
           ${status === "picked" && "bg-orange-400"}
          ${status === "onTheWay" && "bg-yellow-400"}
          ${status === "delivered" && "bg-green-400"}`}
        >
          <div
            className={`rounded-full ${status === "pending" && "bg-blue-300"}
            ${status === "order_accepted" && "bg-orange-200"}
           ${status === "reached" && "bg-orange-200"}
           ${status === "picked" && "bg-orange-200"}
            ${status === "onTheWay" && "bg-yellow-200"}
            ${status === "delivered" && "bg-green-200"}
             w-2.5 h-2.5 flex justify-center items-center animate-pulse`}
          ></div>
          <h5 className="text-xs font-medium text-white tracking-tight">
            {status && status === "pending" && "Pending"}
            {status && status === "order_accepted" && "Accepted"}
            {status && status === "reached" && "Reached"}
            {status && status === "picked" && "Picked"}
            {status && status === "onTheWay" && "On the way"}
            {status && status === "delivered" && "Delivered"}
          </h5>
        </div>
      </div>
      <div>
        <h3 className="text-sm text-gray-400 tracking-tight font-medium">
          Amount : Rs.{order && order.totalAmount}
        </h3>
        <div className="w-full h-[4rem] flex justify-start items-center mt-4 gap-3">
          <div className="w-auto h-full flex flex-col justify-between items-center">
            {/* <h6 className="text-xs font-normal text-gray-400">2.2km</h6> */}
            <h6 className="text-xs font-normal text-gray-400">
              {order && order.distanceFromShopToUser}
            </h6>
          </div>

          <div className="w-2 h-14 flex flex-col justify-start items-center gap-1">
            <div className="w-2.5 h-2.5 border-2 border-black rounded-full " />
            <div className="w-[2px] h-8 bg-black flex justify-center items-center rounded-full" />
            <div className="w-2.5 h-2.5 bg-black rounded-full" />
          </div>

          <div className="w-auto h-full flex flex-col justify-between items-center">
            <h5 className="text-xs font-medium tracking-tight text-black">
              {order && order.shop.location.address}
            </h5>
            <h5 className="text-xs font-medium tracking-tight text-black">
              {order && order.user.location.address}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
