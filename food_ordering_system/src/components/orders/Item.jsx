import React from 'react'
import {useQuery} from "@tanstack/react-query";
import axios from "axios";


const Item = ({item}) => {


    const { data, isLoading, error } = useQuery({
        queryKey: ["product", item.productId],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/product/${item.productId}`);
            return res.data; // single product object expected in res.data.data
        },
    });
    console.log(data)



    return (
        <li>{data?.data?.name} x {data?.data?.quantity}</li>
    )
}
export default Item
