import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/Providers/AuthProvider";
import { useState } from "react";

export default function MyOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingOrder, setEditingOrder] = useState(null);

  // 🔁 Fetch my orders
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/orders/my-orders`, {
        withCredentials: true,
      });
      return res.data.orders;
    },
    enabled: !!user,
  });

  // ❌ Delete order
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_BACKEND_PREFIX}/orders/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-orders"]);
      alert("Order deleted successfully.");
    },
    onError: (err) => {
      alert("Failed to delete order: " + (err.response?.data?.message || err.message));
    },
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      deleteMutation.mutate(id);
    }
  };

  // ✏️ Edit / Update order
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await axios.patch(`${import.meta.env.VITE_BACKEND_PREFIX}/orders/${id}`, data, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-orders"]);
      setEditingOrder(null);
      alert("Order updated successfully.");
    },
    onError: (err) => {
      alert("Failed to update order: " + (err.response?.data?.message || err.message));
    },
  });

  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  // 🖥️ Loading and error states
  if (isLoading) return <p className="text-white text-center mt-10">Loading your orders...</p>;
  if (isError) return <p className="text-red-500 text-center mt-10">Error: {error.message}</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {data.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((order) => (
            <li key={order._id} className="border border-zinc-700 p-4 rounded-md bg-zinc-900">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ${order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
              <p><strong>Items:</strong></p>
              <ul className="ml-4 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} × {item.quantity}</li>
                ))}
              </ul>

              {order.status === "pending" && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(order)}
                    className="px-4 py-1 text-sm text-black bg-yellow-300 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="px-4 py-1 text-sm text-white bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Edit Form Section */}
      {editingOrder && (
        <div className="mt-10 border p-4 rounded bg-zinc-800 text-white">
          <h3 className="text-lg font-bold mb-3">Edit Order</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;

              const updatedData = {
                shop: {
                  id: form.shopId.value,
                  name: form.shopName.value,
                },
                items: [
                  {
                    name: form.itemName.value,
                    quantity: Number(form.quantity.value),
                    price: Number(form.price.value),
                  },
                ],
                amount: Number(form.amount.value),
                deliveryFee: Number(form.deliveryFee.value),
                totalAmount: Number(form.amount.value) + Number(form.deliveryFee.value),
                paymentMethod: form.paymentMethod.value,
                notes: form.notes.value,
              };

              updateMutation.mutate({
                id: editingOrder._id,
                data: updatedData,
              });
            }}
            className="flex flex-col gap-3"
          >
            <label>
              Shop ID:
              <input
                name="shopId"
                defaultValue={editingOrder.shop.id}
                className="text-black px-2 py-1 rounded w-full"
                required
              />
            </label>

            <label>
              Shop Name:
              <input
                name="shopName"
                defaultValue={editingOrder.shop.name}
                className="text-black px-2 py-1 rounded w-full"
                required
              />
            </label>

            <label>
              Item Name:
              <input
                name="itemName"
                defaultValue={editingOrder.items[0]?.name}
                className="text-black px-2 py-1 rounded w-full"
                required
              />
            </label>

            <label>
              Quantity:
              <input
                name="quantity"
                type="number"
                defaultValue={editingOrder.items[0]?.quantity}
                className="text-black px-2 py-1 rounded w-full"
                min="1"
                required
              />
            </label>

            <label>
              Price:
              <input
                name="price"
                type="number"
                defaultValue={editingOrder.items[0]?.price}
                className="text-black px-2 py-1 rounded w-full"
                min="0"
                required
              />
            </label>

            <label>
              Amount:
              <input
                name="amount"
                type="number"
                defaultValue={editingOrder.amount}
                className="text-black px-2 py-1 rounded w-full"
                min="0"
                required
              />
            </label>

            <label>
              Delivery Fee:
              <input
                name="deliveryFee"
                type="number"
                defaultValue={editingOrder.deliveryFee}
                className="text-black px-2 py-1 rounded w-full"
                min="0"
                required
              />
            </label>

            <label>
              Payment Method:
              <select
                name="paymentMethod"
                defaultValue={editingOrder.paymentMethod}
                className="text-black px-2 py-1 rounded w-full"
                required
              >
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
              </select>
            </label>

            <label>
              Notes:
              <textarea
                name="notes"
                defaultValue={editingOrder.notes}
                className="text-black px-2 py-1 rounded w-full"
              />
            </label>

            <div className="flex gap-3 mt-2">
              <button type="submit" className="bg-green-500 px-3 py-1 rounded">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="bg-gray-500 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
















// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useState } from "react";

// export default function MyOrders() {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const [editingOrder, setEditingOrder] = useState(null);

//   // 🔁 Fetch orders
//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["my-orders"],
//     queryFn: async () => {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/orders/my-orders`,
//         { withCredentials: true }
//       );
//       return res.data.orders;
//     },
//     enabled: !!user,
//   });

//   // ❌ Delete order
//   const deleteMutation = useMutation({
//     mutationFn: async (id) => {
//       await axios.delete(`${import.meta.env.VITE_BACKEND_PREFIX}/orders/${id}`, {
//         withCredentials: true,
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["my-orders"]);
//       alert("Order deleted successfully.");
//     },
//     onError: (err) => {
//       alert("Failed to delete: " + err.response?.data?.message);
//     },
//   });

//   const handleDelete = (id) => {
//     if (confirm("Are you sure you want to delete this order?")) {
//       deleteMutation.mutate(id);
//     }
//   };

//   // ✏️ Update order
//   const updateMutation = useMutation({
//     mutationFn: async ({ id, data }) => {
//       await axios.patch(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/orders/${id}`,
//         data,
//         {
//           withCredentials: true,
//         }
//       );
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["my-orders"]);
//       setEditingOrder(null);
//       alert("Order updated successfully.");
//     },
//     onError: (err) => {
//       alert("Failed to update order: " + err.response?.data?.message);
//     },
//   });

//   const handleEdit = (order) => {
//     setEditingOrder(order);
//   };

//   // ✅ Render
//   if (isLoading) return <p className="text-white text-center mt-10">Loading your orders...</p>;
//   if (isError) return <p className="text-red-500 text-center mt-10">Error: {error.message}</p>;

//   return (
//     <div className="p-6 text-white">
//       <h2 className="text-2xl font-bold mb-4">My Orders</h2>

//       {data.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {data.map((order) => (
//             <li key={order._id} className="border border-zinc-700 p-4 rounded-md bg-zinc-900">
//               <p><strong>Status:</strong> {order.status}</p>
//               <p><strong>Total:</strong> ${order.totalAmount}</p>
//               <p><strong>Payment:</strong> {order.paymentMethod}</p>
//               <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
//               <p><strong>Items:</strong></p>
//               <ul className="ml-4 list-disc">
//                 {order.items.map((item, idx) => (
//                   <li key={idx}>{item.name} × {item.quantity}</li>
//                 ))}
//               </ul>

//               {order.status === "pending" && (
//                 <div className="flex gap-3 mt-3">
//                   <button
//                     onClick={() => handleEdit(order)}
//                     className="px-4 py-1 text-sm text-black bg-yellow-300 rounded"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(order._id)}
//                     className="px-4 py-1 text-sm text-white bg-red-600 rounded"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* ✅ Edit Form */}
//       {editingOrder && (
//   <div className="mt-10 border p-4 rounded bg-zinc-800 text-white">
//     <h3 className="text-lg font-bold mb-3">Edit Order</h3>
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         const form = e.target;

//         const updatedData = {
//           shop: {
//             id: form.shopId.value,
//             name: form.shopName.value,
//           },
//           items: [
//             {
//               name: form.itemName.value,
//               quantity: Number(form.quantity.value),
//               price: Number(form.price.value),
//             },
//           ],
//           amount: Number(form.amount.value),
//           deliveryFee: Number(form.deliveryFee.value),
//           totalAmount:
//             Number(form.amount.value) + Number(form.deliveryFee.value),
//           paymentMethod: form.paymentMethod.value,
//           notes: form.notes.value,
//         };

//         updateMutation.mutate({
//           id: editingOrder._id,
//           data: updatedData,
//         });
//       }}
//       className="flex flex-col gap-3"
//     >
//       <label>
//         Shop ID:
//         <input
//           name="shopId"
//           defaultValue={editingOrder.shop.id}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>
//       <label>
//         Shop Name:
//         <input
//           name="shopName"
//           defaultValue={editingOrder.shop.name}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>
//       <label>
//         Item Name:
//         <input
//           name="itemName"
//           defaultValue={editingOrder.items[0].name}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>
//       <label>
//         Quantity:
//         <input
//           name="quantity"
//           type="number"
//           defaultValue={editingOrder.items[0].quantity}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>
//       <label>
//         Price:
//         <input
//           name="price"
//           type="number"
//           defaultValue={editingOrder.items[0].price}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>
//       <label>
//         Amount:
//         <input
//           name="amount"
//           type="number"
//           defaultValue={editingOrder.amount}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>
//       <label>
//         Delivery Fee:
//         <input
//           name="deliveryFee"
//           type="number"
//           defaultValue={editingOrder.deliveryFee}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>
//       <label>
//         Payment Method:
//         <select
//           name="paymentMethod"
//           defaultValue={editingOrder.paymentMethod}
//           className="text-black px-2 py-1 rounded w-full"
//         >
//           <option value="cash_on_delivery">Cash on Delivery</option>
//           <option value="card">Card</option>
//           <option value="online">Online</option>
//         </select>
//       </label>
//       <label>
//         Notes:
//         <textarea
//           name="notes"
//           defaultValue={editingOrder.notes}
//           className="text-black px-2 py-1 rounded w-full"
//         />
//       </label>

//       <div className="flex gap-3 mt-2">
//         <button type="submit" className="bg-green-500 px-3 py-1 rounded">
//           Save Changes
//         </button>
//         <button
//           type="button"
//           onClick={() => setEditingOrder(null)}
//           className="bg-gray-500 px-3 py-1 rounded"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   </div>
// )}

//     </div>
//   );
// }








// // import { useQuery } from "@tanstack/react-query";
// // import axios from "axios";
// // import { useAuth } from "@/Providers/AuthProvider";

// // export default function MyOrders() {
// //   const { user } = useAuth();

// //   const { data, isLoading, isError, error } = useQuery({
// //     queryKey: ["my-orders"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/orders/my-orders`, {
// //         withCredentials: true,
// //       });
// //       return res.data.orders;
// //     },
// //     enabled: !!user, // only run if user exists
// //   });

// //   if (isLoading) return <p className="text-white text-center mt-10">Loading your orders...</p>;
// //   if (isError) return <p className="text-red-500 text-center mt-10">Error: {error.message}</p>;

// //   return (
// //     <div className="p-6 text-white">
// //       <h2 className="text-2xl font-bold mb-4">My Orders</h2>
// //       {data.length === 0 ? (
// //         <p>No orders found.</p>
// //       ) : (
// //         <ul className="space-y-4">
// //           {data.map((order) => (
// //             <li key={order._id} className="border border-zinc-700 p-4 rounded-md bg-zinc-900">
// //               <p><strong>Status:</strong> {order.status}</p>
// //               <p><strong>Total:</strong> ${order.totalAmount}</p>
// //               <p><strong>Payment:</strong> {order.paymentMethod}</p>
// //               <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
// //               <p><strong>Items:</strong></p>
// //               <ul className="ml-4 list-disc">
// //                 {order.items.map((item, idx) => (
// //                   <li key={idx}>{item.name} × {item.quantity}</li>
// //                 ))}
// //               </ul>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // }
