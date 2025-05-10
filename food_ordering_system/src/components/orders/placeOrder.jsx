import React from 'react'
import {OrderItem} from "@/components/orders/OrderItem.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import * as res from "react-router";
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

  const cartId = cartData?.data?._id;
  const resId = cartData?.data?.resId || "680c05ed3270917984573828";
  const userId = userData?.user?._id;
  const total = totalPrice;
  console.log(cartId,resId,userId,total)

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: async ({ cartId, resId, total, status }) => {
      const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_PREFIX}/orders/${cartId}/${resId}`,
          { total, status },
          { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Order created:", data);
    },
    onError: (error) => {
      console.error("Order creation failed:", error?.response?.data?.error || error.message);
    },
  });

  const {mutate:refund,isPending:isRefunding} = useMutation({
    mutationFn:async ({paymentIntentId,totalPrice}) =>{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_PREFIX}/orders/refund`,{
        paymentIntentId,
        totalPrice
      },{
        withCredentials: true
      })
      return response.data;
    },onSuccess: (data) => {
      console.log("Order refunded:", data);
    },
    onError: (error) => {
      console.error("Order redunding failed:", error?.response?.data?.error || error.message);

    }
  })





  return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="h-screen w-full bg-gray-50 flex flex-col justify-center items-center">
          <div className="w-[60%] h-[500px] bg-white  rounded-md shadow-sm shadow-gray-300 flex flex-col items-center m-5 p-2">
            <div className="h-[5%] text-xl font-semibold w-full text-center">Order Details - KFC</div>
            <div className="h-[95%] w-full flex flex-col justify-between items-center">
              <div className="w-full flex justify-start items-center font-semibold text-left h-[8%] p-5">Items ({cartData?.data?.cartItems?.length})</div>
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
                  className="font-bold bg-black w-[45%] h-[50px] text-white flex justify-center items-center rounded-md cursor-pointer" onClick={() => {
                const paymentIntentId = "pi_3RJJjRRvL565VgPE0hysdVaP";
                if (!paymentIntentId || !totalPrice) {
                  console.error("Missing refund details");
                  return;
                }
                refund({
                  paymentIntentId,
                  totalPrice: Math.round(totalPrice * 100),
                });
              }}
              >
                {isRefunding ? "Refunding..." : "Refund"}
              </div>
              <div
                  className="font-bold bg-black w-[45%] h-[50px] text-white flex justify-center items-center rounded-md cursor-pointer"onClick={()=>{
                if (!cartId || !resId || !total) {
                  console.error("Missing order details");
                  return;
                }
                createOrder({ cartId, resId, total, status: "accepted" });

              }}>Continue
              </div>
            </div>

          </div>

        </div>

      </div>
  )
}











