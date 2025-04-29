import SuccessOrderImage from "@/assets/success_order.png";
import { ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function Success() {
    
  const navigate = useNavigate();

  return (
    <main className="w-full h-screen flex justify-center items-center bg-white">
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <div className="w-[10rem] h-[10rem] rounded-full bg-green-50 flex justify-center items-center">
          <div className="w-[7rem] h-[7rem] rounded-full bg-green-200 flex justify-center items-center">
            <img
              src={SuccessOrderImage}
              alt="success-image"
              className="w-[3rem] h-[3rem]"
            />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Order Completed!
        </h1>
        <p className="text-md font-medium tracking-tight text-gray-400 text-center w-1/3">
          Your order has been successfully delivered, Thank you for your
          purchace. Happy meal!
        </p>
        <button
          onClick={() =>
            navigate("/", {
              replace: true,
            })
          }
          className=" bg-black px-4 py-2.5 rounded-full text-white tracking-tight text-md font-medium flex justify-center items-center gap-2 cursor-pointer"
        >
          <ArrowLeftCircle size={18} />
          Back to Home
        </button>
      </div>
    </main>
  );
}
