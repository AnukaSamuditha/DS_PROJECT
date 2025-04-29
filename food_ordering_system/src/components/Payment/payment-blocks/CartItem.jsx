import { ArrowDown, PlusIcon, MinusIcon, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";


export default function CartItem({ item ,userId,onQuantityChange,deleteItem,cartId}) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["product", item.productId._id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/product/${item.productId._id}`);
            return res.data; // single product object expected in res.data.data
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching product.</div>;

    const productItem = data?.data;
    console.log(userId)

    const handleIncrease = () => {
        onQuantityChange({
            productId: item.productId._id,
            quantity: item.quantity + 1,
        });
    };
    const handleDelete = () => {
        deleteItem.mutate({ cartId, productId: item.productId._id });
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange({
                productId: item.productId._id,
                quantity: item.quantity - 1,
            });
        }
    };
    const clearItem = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This item will be deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000000",
            cancelButtonColor: "#ffffff",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            customClass: {
                cancelButton: 'swal-cancel-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your item has been deleted.",
                    icon: "success",
                    confirmButtonColor:"#000000"
                });
            }
        });
    };

    return (
        <div className="w-full min-h-[180px] flex justify-center items-center bg-white">
            <div className="h-full w-[40%] flex justify-start items-center p-2">
                <img
                    className="w-[500px] h-[100px] object-cover object-center rounded"
                    src={productItem.image || "fallback.jpg"}
                    alt={productItem.name}

                />
                <div className="h-[100px] w-full flex flex-col justify-center items-start p-5">
                    <span className="font-semibold text-[15px]">{productItem.name}</span>
                    <span className="font-light text-[12px]">{productItem.description}</span>
                </div>
            </div>
            <div className="h-full w-[20%] flex justify-center items-center">
                <div className="justify-center items-center gap-10 flex">
                    <div className="p-1 bg-gray-200 hover:bg-gray-100 rounded-md cursor-pointer"
                         onClick={handleDecrease}>
                        <MinusIcon/>
                    </div>
                    <span>{item.quantity}</span>
                    <div className="p-1 bg-gray-200 hover:bg-gray-100 rounded-md cursor-pointer"
                         onClick={handleIncrease}>
                        <PlusIcon/>
                    </div>
                </div>
            </div>

            <div className="h-full w-[20%] flex justify-center items-center gap-2">
                <span>${(productItem.price * item.quantity).toFixed(2)}</span>
            </div>
            <div className="h-full w-[20%] flex justify-center items-center">
                <div className="cursor-pointer flex flex-row justify-around items-center w-[50%] w-8 h-8 bg-gray-100 p-1 rounded-md hover:bg-gray-50 text-black " onClick={clearItem}>
                    <div>
                        Remove
                    </div>
                    <Trash
                        className="w-5 h-5 rounded-xl text-black hover:bg-gray-50 text-black "/>
                </div>
            </div>
        </div>
    );
}