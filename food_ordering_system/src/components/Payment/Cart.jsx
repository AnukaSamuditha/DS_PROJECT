import CartItem from "@/components/Payment/payment-blocks/CartItem.jsx";
import {ArrowLeft} from "lucide-react"
import {useQuery,useQueryClient,useMutation} from "@tanstack/react-query";
import axios from "axios";
import {StripeElement} from "@/components/Payment/payment-blocks/StripeElement.jsx";



export default function Cart(){



  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_PAYMENT_SERVICE_PREFIX}/cart`, {
        withCredentials: true,
      });
      return res.data;
    },

  });

  const cartId = cartData?.data._id;
  console.log(cartId)

  const queryClient = useQueryClient();

  const updateQuantity = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const res = await axios.patch(`${import.meta.env.VITE_PAYMENT_SERVICE_PREFIX}/cart/${cartId}`,
          { userId, productId, quantity },
          { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });


  const deleteItem = useMutation({
    mutationFn: async ({ cartId, productId }) => {
      const res = await axios.put(
          `${import.meta.env.VITE_PAYMENT_SERVICE_PREFIX}/cart/item`,
          { cartId, productId },
          { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  const userId = cartData?.data?.userId
  const productIds = cartData?.data.cartItems.map((item) => item.productId._id);


  const { data: userData, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_PAYMENT_SERVICE_PREFIX}/users/get-user`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  console.log(userData)

  const user = {
    name:userData?.user?.username,
    email:userData?.user?.email,
    customerId:userData?.user?.customerId,
  }


  const {data: productData, error: productError, isLoading: productLoading} = useQuery({
    queryKey: ["products", productIds],
    queryFn: async () => {
      const res = await Promise.all(
          productIds.map((id) =>
              axios.get(`${import.meta.env.VITE_PAYMENT_SERVICE_PREFIX}/product/${id}`, {
                withCredentials: true,
              }).then(res => res.data)
          )
      );
      return res;
    },
    enabled: !!productIds?.length,
  });

  if(cartLoading || productLoading){
    console.log("data are loading...")
  }


  if (cartError || productError) return (
      <p>An error has occurred: {cartError?.message || productError?.message}</p>
  );
  const totalPrice = cartData?.data?.cartItems?.reduce((acc, cartItem) => {
    if (!productData || productData.length === 0) {
      return acc;
    }
    const product = productData.find((p) => p.data._id === cartItem.productId._id);
    if (!product) {
      return acc;
    }

    const price = product?.data.price || 0;
    const quantity = cartItem.quantity || 1;
    return acc + price * quantity;
  }, 0);

  console.log("Total Price:", totalPrice);



    return (
      <div className="h-screen w-full bg-white flex justify-center items-center p-4">
        <div className="flex gap-2 w-full max-w-[90rem] h-[80%]">
          <div className="flex-1/2 flex-col justify-center items-center">
            <div className="h-[10%] w-full flex justify-s items-center p-2 ">
              <span className="text-4xl font-bold">Shopping Cart</span>
            </div>
            <div className="h-[80%] w-full flex-row bg-white flex-col overscroll-y-auto">
              <div className="w-[100%] h-[10%] flex">
                <div className="w-full h-[100%] flex justify-start items-center border-b border-gray-300">
                  <div className="w-[40%] h-fit  justify-start items-center pl-2">
                    <span className="text-[18px] font-light">Product</span>
                  </div>

                  <div className="w-[20%] h-fit  justify-start items-center pl-2">
                    <span className="text-[18px] font-light">Quantity</span>
                  </div>
                  <div className="w-[20%] h-fit justify-start items-center pl-2">
                    <span className="text-[18px] font-light">Total Price</span>
                  </div>
                  <div className="w-[20%] h-fit  justify-start items-center pl-2">
                    <span className="text-[18px] font-light">Delete</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[90%] flex flex-col overflow-y-auto scrollbar-hide">
                {cartData?.data?.cartItems?.map((item, index) => (
                    <CartItem key={index} item={item} userId={userId} onQuantityChange={updateQuantity.mutate} deleteItem={deleteItem} cartId={cartId}/>
                ))}
              </div>
            </div>
            <div className="w-full h-[10%] flex flex items-center justify-between border-t border-gray-300">
              <div className="text-xl font-bold h-[50px] rounded-md flex justify-start items-center pr-2 pl-2 cursor-pointer">
                <ArrowLeft className="font-bold mr-2"/> Continue Shopping
              </div>
              <div className="flex justify-center items-center">
                <span className=" font-bold text-xl">
                  Total: <span className="text-2xl font-light">${totalPrice}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="flex-col justify-center items-center bg-gray-200 w-full h-full rounded-md">
              <div className="h-[10%] w-full flex justify-start items-center p-4">
                <span className="text-4xl font-bold">Payment Info</span>
              </div>
              <div className="flex justify-center items-center w-full h-[90%]"><StripeElement cartId={cartId} totalPrice={totalPrice} userId={userId} user={user}/></div>
            </div>
          </div>
        </div>
      </div>
    );
}