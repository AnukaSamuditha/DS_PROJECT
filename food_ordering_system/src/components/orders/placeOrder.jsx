// src/components/orders/PlaceOrder.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import Label from "@/components/ui/label";
import { useAuth } from "@/Providers/AuthProvider";

// ✅ Zod schema for form validation
const schema = z.object({
  shopId: z.string().min(1, "Shop ID is required"),
  shopName: z.string().min(1, "Shop name is required"),
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, "Quantity must be at least 1")),
  price: z.preprocess((val) => Number(val), z.number().min(1, "Price must be at least 1")),
  amount: z.preprocess((val) => Number(val), z.number().min(1, "Amount must be at least 1")),
  deliveryFee: z.preprocess((val) => Number(val), z.number().min(0, "Delivery Fee cannot be negative")),
  paymentMethod: z.enum(["cash_on_delivery", "card", "online"]),
});

export default function PlaceOrderPage() {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const orderData = {
        shop: {
          id: formData.shopId,
          name: formData.shopName,
        },
        items: [
          {
            name: formData.itemName,
            quantity: formData.quantity,
            price: formData.price,
          },
        ],
        amount: formData.amount,
        deliveryFee: formData.deliveryFee,
        totalAmount: formData.amount + formData.deliveryFee,
        paymentMethod: formData.paymentMethod,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_PREFIX}/orders`,
        orderData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      alert("✅ Order placed successfully!");
      reset();
    },
    onError: (err) => {
      console.error("❌ Failed to place order:", err);
      alert("Failed to place order: " + (err.response?.data?.message || err.message));
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col gap-4 border border-gray-200 p-6 rounded-lg shadow bg-white"
      >
        <h2 className="text-xl font-bold text-center text-black">Place Order</h2>

        <Label title="Shop ID" name="shopId" />
        <InputField name="shopId" type="text" register={register} error={errors.shopId?.message} />

        <Label title="Shop Name" name="shopName" />
        <InputField name="shopName" type="text" register={register} error={errors.shopName?.message} />

        <Label title="Item Name" name="itemName" />
        <InputField name="itemName" type="text" register={register} error={errors.itemName?.message} />

        <Label title="Quantity" name="quantity" />
        <InputField name="quantity" type="number" register={register} error={errors.quantity?.message} />

        <Label title="Price" name="price" />
        <InputField name="price" type="number" register={register} error={errors.price?.message} />

        <Label title="Amount" name="amount" />
        <InputField name="amount" type="number" register={register} error={errors.amount?.message} />

        <Label title="Delivery Fee" name="deliveryFee" />
        <InputField name="deliveryFee" type="number" register={register} error={errors.deliveryFee?.message} />

        <Label title="Payment Method" name="paymentMethod" />
        <select {...register("paymentMethod")} className="border rounded px-2 py-1 bg-white text-black">
          <option value="cash_on_delivery">Cash on Delivery</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        <SubmitButton title="Place Order" isSubmitting={isSubmitting} isValid={isValid} />
      </form>
    </div>
  );
}








// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import axios from "axios";
// import { useMutation } from "@tanstack/react-query";
// import InputField from "@/components/ui/InputField";
// import SubmitButton from "@/components/ui/SubmitButton";
// import Label from "@/components/ui/label";
// import { useAuth } from "@/Providers/AuthProvider";

// // ✅ Zod Schema with preprocess for number fields
// const schema = z.object({
//   shopId: z.string().min(1, "Shop ID is required"),
//   shopName: z.string().min(1, "Shop name is required"),
//   itemName: z.string().min(1, "Item name is required"),
//   quantity: z.preprocess((val) => Number(val), z.number({ required_error: "Quantity is required" }).min(1, "Must be at least 1")),
//   price: z.preprocess((val) => Number(val), z.number({ required_error: "Price is required" }).min(1, "Must be at least 1")),
//   amount: z.preprocess((val) => Number(val), z.number({ required_error: "Amount is required" }).min(1, "Must be at least 1")),
//   deliveryFee: z.preprocess((val) => Number(val), z.number({ required_error: "Delivery fee is required" }).min(0, "Cannot be negative")),
//   paymentMethod: z.enum(["cash_on_delivery", "card", "online"]),
// });

// export default function PlaceOrderPage() {
//   const { user } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({
//     resolver: zodResolver(schema),
//     mode: "onChange",
//   });

//   const mutation = useMutation({
//     mutationFn: async (data) => {
//       const orderData = {
//         shop: {
//           id: data.shopId,
//           name: data.shopName,
//         },
//         items: [
//           {
//             name: data.itemName,
//             quantity: data.quantity,
//             price: data.price,
//           },
//         ],
//         amount: data.amount,
//         deliveryFee: data.deliveryFee,
//         paymentMethod: data.paymentMethod,
//       };

//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/orders`,
//         orderData,
//         { withCredentials: true } // ✅ include cookies
//       );

//       return response.data;
//     },
//     onSuccess: () => {
//       alert("✅ Order placed successfully!");
//       reset();
//     },
//     onError: (err) => {
//       console.error("❌ Failed to place order:", err);
//       alert("Failed to place order: " + err.response?.data?.message || err.message);
//     },
//   });

//   const onSubmit = (formData) => {
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="w-full h-screen flex justify-center items-center bg-white">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-w-md flex flex-col gap-4 border border-gray-200 p-6 rounded-lg shadow bg-white "
//       >
//         <h2 className="text-xl font-bold text-center text-white">Place Order</h2>

//         <Label title="Shop ID" name="shopId" />
//         <InputField name="shopId" type="text" register={register} error={errors.shopId?.message} />

//         <Label title="Shop Name" name="shopName" />
//         <InputField name="shopName" type="text" register={register} error={errors.shopName?.message} />

//         <Label title="Item Name" name="itemName" />
//         <InputField name="itemName" type="text" register={register} error={errors.itemName?.message} />

//         <Label title="Quantity" name="quantity" />
//         <InputField name="quantity" type="number" register={register} error={errors.quantity?.message} />

//         <Label title="Price" name="price" />
//         <InputField name="price" type="number" register={register} error={errors.price?.message} />

//         <Label title="Amount" name="amount" />
//         <InputField name="amount" type="number" register={register} error={errors.amount?.message} />

//         <Label title="Delivery Fee" name="deliveryFee" />
//         <InputField name="deliveryFee" type="number" register={register} error={errors.deliveryFee?.message} />

//         <Label title="Payment Method" name="paymentMethod" />
//         <select {...register("paymentMethod")} className="border rounded px-2 py-1 bg-white">
//           <option value="cash_on_delivery">Cash on Delivery</option>
//           <option value="card">Card</option>
//           <option value="online">Online</option>
//         </select>

//         <SubmitButton title="Place Order" isSubmitting={isSubmitting} isValid={isValid} />
//       </form>
//     </div>
//   );
// }








