import React from 'react'
import {OrderItem} from "@/components/orders/OrderItem.jsx";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
export const PlaceOrder = () => {

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`, {
        withCredentials: true,
      });
      return res.data;
    },
  });
  console.log(userData?.user?._id)



  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/cart`, {
        withCredentials: true,
      });
      return res.data;
    },
  });
  console.log(cartData)

  const { data: proData, error: proError, isLoading: proLoading } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/cart/product`, {
        withCredentials: true,
      });
      return res.data;
    },
  });
  console.log(proData,"dsv")

  const totalPrice = proData?.data?.cartItems?.reduce((acc, item) => {
    return acc + item.productId.price * item.quantity;
  }, 0);
  console.log(totalPrice)



  return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="h-screen w-full bg-gray-50 flex flex-col justify-center items-center">
          <div className="w-[60%] h-[500px] bg-white  rounded-md shadow-sm shadow-gray-300 flex flex-col items-center m-5 p-2">
            <div className="h-[5%] text-xl font-semibold w-full text-center">Order Details - KFC</div>
            <div className="h-[95%] w-full flex flex-col justify-between items-center">
              <div className="w-full flex justify-start items-center font-semibold text-left h-[8%] p-5">Items (4)</div>
              <div className=" w-full h-[92%] p-2 ">
                <div className=".scrollbar-hide w-full h-full overflow-y-scroll ">
                  {cartData?.data?.cartItems?.map((item, index) => (
                      <OrderItem key={index} item={item} />
                  ))}

                </div>

              </div>
            </div>
          </div>
          <div
              className="w-[60%] h-[80px] bg-white rounded-md shadow-sd shadow flex flex-row justify-around items-center m-5">
            <div className="w-[30%]  h-full flex justify-center items-center">
              <div className="text-[20px] font-bold">Total</div>
            </div>
            <div className="w-[30%]  h-full flex justify-start items-center">
              <div className="text-[18px]">${totalPrice}</div>
            </div>
            <div className="w-[35%]  h-full flex flex-row justify-around items-center">
              <div
                  className="font-bold bg-black w-[45%] h-[50px] text-white flex justify-center items-center rounded-md cursor-pointer">Refund
              </div>
              <div
                  className="font-bold bg-black w-[45%] h-[50px] text-white flex justify-center items-center rounded-md cursor-pointer">Continue
              </div>
            </div>

          </div>

        </div>

      </div>
  )
}











