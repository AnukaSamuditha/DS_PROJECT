import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig"; // ✅ cookie-based axios
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../Providers/AuthProvider";
import MenuSection from "../components/MenuSection";

export default function RestaurantMenuItems() {
  const { id } = useParams(); // Restaurant ID
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

  const fetchMenuItems = async () => {
    try {
      const res = await axiosInstance.get(`/MenuItems/restaurant-menuItems/${id}`);
      setItems(res.data.menuItems || []);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      await axiosInstance.patch(`/MenuItems/availability-menuItem/${itemId}`);
      fetchMenuItems(); // Refresh list
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const deleteItem = async (itemId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/MenuItems/delete-menuItem/${itemId}`);
      fetchMenuItems(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (itemId) => {
    navigate(`/restaurant/${id}/menu-items/edit/${itemId}`);
  };

  const handleAdd = () => {
    navigate(`/restaurant/${id}/menu-items/add`);
  };

  useEffect(() => {
    fetchMenuItems();
  }, [id]);

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Menu Items</h2>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        + Add Menu Item
      </button>

      <MenuSection
        menuItems={items}
        backendURL={backendURL}
        role="restaurantOwner"
        onEdit={handleEdit}
        onDelete={deleteItem}
        onToggleAvailability={toggleAvailability}
      />
    </div>
  );
}






// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router";
// import { useAuth } from "../Providers/AuthProvider";
// import MenuSection from "../components/MenuSection";

// export default function RestaurantMenuItems() {
//   const { id } = useParams(); // Restaurant ID
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const token = localStorage.getItem("token");

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   const fetchMenuItems = async () => {
//     try {
//       const res = await axios.get(
//         `${backendURL}/MenuItems/restaurant-menuItems/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setItems(res.data.menuItems || []);
//     } catch (err) {
//       console.error("Error fetching menu items:", err);
//     }
//   };

//   const toggleAvailability = async (itemId) => {
//     try {
//       await axios.patch(
//         `${backendURL}/MenuItems/availability-menuItem/${itemId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchMenuItems(); // Refresh list
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   };

//   const deleteItem = async (itemId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(
//         `${backendURL}/MenuItems/delete-menuItem/${itemId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchMenuItems(); // Refresh list
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   const handleEdit = (itemId) => {
//     //navigate(`/restaurant/${id}/menu-items/edit/${itemId}`);
//     navigate(`/restaurant/${id}/menu-items/edit/${itemId}`);
//   };

//   const handleAdd = () => {
//     navigate(`/restaurant/${id}/menu-items/add`);
//   };

//   useEffect(() => {
//     fetchMenuItems();
//   }, [id]);

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Manage Menu Items</h2>

//       <button
//         onClick={handleAdd}
//         className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
//       >
//         + Add Menu Item
//       </button>

//       <MenuSection
//         menuItems={items}
//         backendURL={backendURL}
//         role="restaurantOwner"
//         onEdit={handleEdit}
//         onDelete={deleteItem}
//         onToggleAvailability={toggleAvailability}
//       />
//     </div>
//   );
// }












// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router";
// import { useAuth } from "../Providers/AuthProvider";


// //menuitems management for resOwners
// export default function RestaurantMenuItems() {
//   const { id } = useParams(); // restaurant ID
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const token = localStorage.getItem("token");

//   const fetchMenuItems = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/MenuItems/restaurant-menuItems/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setItems(res.data.menuItems);
//     } catch (err) {
//       console.error("Error fetching menu items:", err);
//     }
//   };

//   const toggleAvailability = async (itemId) => {
//     try {
//       await axios.patch(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/MenuItems/availability-menuItem/${itemId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchMenuItems(); // reload
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   };

//   const deleteItem = async (itemId) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/MenuItems/delete-menuItem/${itemId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchMenuItems();
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchMenuItems();
//   }, [id]);

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Menu Items</h2>

//       <button
//         onClick={() => navigate(`/restaurant/${id}/menu-items/add`)}
//         className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
//       >
//         + Add Menu Item
//       </button>

//       {items.length === 0 ? (
//         <p>No menu items yet.</p>
//       ) : (
//         items.map((item) => (
//           <div key={item._id} className="border p-4 mb-4 rounded">
//             <h3 className="text-xl font-semibold">{item.name}</h3>
//             <p>{item.description}</p>
//             <p>Price: Rs. {item.price}</p>
//             <p>Category: {item.category}</p>
//             <p>Status: {item.isAvailable ? "Available" : "Unavailable"}</p>

//             <div className="flex gap-3 mt-2">
//               <button
//                 onClick={() => toggleAvailability(item._id)}
//                 className="bg-yellow-500 px-3 py-1 rounded"
//               >
//                 Toggle Availability
//               </button>
//               <button
//                 onClick={() => deleteItem(item._id)}
//                 className="bg-red-600 px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
