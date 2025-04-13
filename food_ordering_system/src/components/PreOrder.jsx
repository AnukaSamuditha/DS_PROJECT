import { useNavigate } from "react-router";

const order = {
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
    totalAmount: 1600, // amount + delivery fee
    status: "pending", // other options: 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'
    placedAt: "2025-04-10T14:30:00Z",
    estimatedDeliveryTime: "2025-04-10T15:15:00Z",
    paymentMethod: "cash_on_delivery", // or 'card', 'online'
    driver: null, // can later be filled with driver info once assigned
    notes: "No onions please"
  };
  
export default function PreOrder(){
    const navigate = useNavigate();
    return(
        <div className="w-full h-screen justify-center items-center">
            <button onClick={()=>navigate("/find-rider",{state:{order}})} className="w-[130px] h-[40px] rounded-xl bg-black text-white text-sm tracking-tight font-semibold">Continue</button>
        </div>
    )
}