import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

export const order = {
    _id: "order_987654321",
    user: {
      id: "user_123456",
      name: "John Doe",
      location: {
        lat: 6.935,
        lng: 79.8439,
        address: "123 Main St, Colombo, Sri Lanka"
      }
    },
    shop: {
      id: "shop_78910",
      name: "The Local Bites",
      location: {
        lat: 6.9352,
        lng: 79.8428,
        address: "456 Galle Rd, Colombo, Sri Lanka"
      }
    },
    items: [
      {
        name: "Chicken Kottu",
        quantity: 2,
        price: 550
      },
      {
        name: "Iced Milo",
        quantity: 1,
        price: 300
      }
    ],
    amount: 1400, // total amount
    deliveryFee: 200,
    distanceFromShopToUser:null,
    totalAmount: 1600, // amount + delivery fee
    status: "pending", // other options: 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'
    placedAt: "2025-04-10T14:30:00Z",
    estimatedDeliveryTime: "2025-04-10T15:15:00Z",
    paymentMethod: "cash_on_delivery", // or 'card', 'online'
    driver: null, // can later be filled with driver info once assigned
    notes: "No onions please"
  };
  
export default function PreOrder(){

    const {data,isFetched} = useQuery({
      queryKey:["order_data"],
      queryFn:async()=>{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/orders/order/6801230846101090818500c7`,{
          withCredentials:true
        })

        if(!res){
          console.log("order not found!")
          return;
        }

        return res.data
      },
      retryOnMount:true,
      refetchOnWindowFocus:true
    })

    if(data){
      console.log("order ",data.order)
    }
    const navigate = useNavigate();
    return(
        <div className="w-full h-screen justify-center items-center">
            <button disabled={!isFetched} onClick={()=>navigate("/find-rider",{state:data.order})} className="w-[130px] h-[40px] rounded-xl bg-black text-white text-sm tracking-tight font-semibold">Continue</button>
        </div>
    )
}