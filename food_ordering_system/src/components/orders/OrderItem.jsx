import React from 'react'
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export const OrderItem = ({item}) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["product", item.productId],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/product/${item.productId}`);
            return res.data; // single product object expected in res.data.data
        },
    });
    console.log(item)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching product.</div>;


    return (
        <div className="w-full pb-2 pt-2">
            <div className="w-full bg-white-200 h-[80px] rounded-md shadow flex flex-row justify-around items-center">
                <div className="w-[8%] ">
                    <img className="object-center rounded-md"
                         src={data?.data?.image}
                         height="100%" width="50%"/>
                </div>
                <div className="w-[8%]">
                    {data?.data?.name}
                </div>
                <div className="w-[8%]">
                    {item.quantity}
                </div>
                <div className="w-[18%]">
                    {data?.data?.price * item.quantity}
                </div>
                <div className="w-[18%]">
                    {data?.data?.category}
                </div>
                <div className="w-[18%]">
                    KFC
                </div>
            </div>
        </div>
    )
}
