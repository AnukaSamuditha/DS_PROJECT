import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig"; // ✅ cookie-based axios
import { useParams, useNavigate } from "react-router-dom"; // 🔥 fixed router import
import { useAuth } from "../Providers/AuthProvider";
import MenuSection from "../components/MenuSection";
import Modal from "../components/Modal"; // Import Modal component

export default function RestaurantMenuItems() {
  const { id } = useParams(); // Restaurant ID
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Menu items state
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [itemToDelete, setItemToDelete] = useState(null); // State to store the item to delete

  const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

  const fetchMenuItems = async () => {
    try {
      const res = await axiosInstance.get(`/MenuItems/restaurant-menuItems/${id}`);
      // If no menu items, set empty array
      setItems(res.data.menuItems || []);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setItems([]); // Ensure empty array is set if error occurs
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

  const deleteItem = (itemId) => {
    setItemToDelete(itemId); // Set the item ID to delete
    setShowModal(true); // Show the modal
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await axiosInstance.delete(`/MenuItems/delete-menuItem/${itemToDelete}`);
      fetchMenuItems(); // Refresh list after deletion
      setShowModal(false); // Close the modal after deletion
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
    const userRole = user?.role || user?.user?.role; // 🔥 safe access
    if (!user || userRole !== "restaurantOwner") { // 🔥 safe check
      navigate("/signin");
    } else {
      fetchMenuItems();
    }
  }, [user, id, navigate]); // 🔥 added user in deps

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-8">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Manage Menu Items</h2>
          <button
            onClick={handleAdd}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            + Add Menu Item
          </button>
        </div>

        {/* Show a message if no menu items */}
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">No menu items available. Add some items to your menu!</p>
        ) : (
          <MenuSection
            menuItems={items}
            backendURL={backendURL}
            role="restaurantOwner"
            onEdit={handleEdit}
            onDelete={deleteItem}
            onToggleAvailability={toggleAvailability}
          />
        )}
      </div>

      {/* Modal for Confirming Deletion */}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)} // Close the modal
          onConfirm={handleConfirmDelete} // Confirm the deletion
          message="Are you sure you want to delete this item?"
        />
      )}
    </div>
  );
}










// //updated
// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // ✅ cookie-based axios
// import { useParams, useNavigate } from "react-router-dom"; // 🔥 fixed router import
// import { useAuth } from "../Providers/AuthProvider";
// import MenuSection from "../components/MenuSection";

// export default function RestaurantMenuItems() {
//   const { id } = useParams(); // Restaurant ID
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   const fetchMenuItems = async () => {
//     try {                                   
//       const res = await axiosInstance.get(`/MenuItems/restaurant-menuItems/${id}`);
//       setItems(res.data.menuItems || []);
//     } catch (err) {
//       console.error("Error fetching menu items:", err);
//     }
//   };

//   const toggleAvailability = async (itemId) => {
//     try {
//       await axiosInstance.patch(`/MenuItems/availability-menuItem/${itemId}`);
//       fetchMenuItems(); // Refresh list
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   };

//   const deleteItem = async (itemId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`/MenuItems/delete-menuItem/${itemId}`);
//       fetchMenuItems(); // Refresh list
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   const handleEdit = (itemId) => {
//     navigate(`/restaurant/${id}/menu-items/edit/${itemId}`);
//   };

//   const handleAdd = () => {
//     navigate(`/restaurant/${id}/menu-items/add`);
//   };

//   useEffect(() => {
//     const userRole = user?.role || user?.user?.role; // 🔥 safe access
//     if (!user || userRole !== "restaurantOwner") { // 🔥 safe check
//       navigate("/signin");
//     } else {
//       fetchMenuItems();
//     }
//   }, [user, id, navigate]); // 🔥 added user in deps

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
//       <div className="w-full max-w-7xl space-y-8">
//         {/* Page Heading */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           <h2 className="text-3xl font-bold text-gray-900">Manage Menu Items</h2>
//           <button
//             onClick={handleAdd}
//             className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold transition"
//           >
//             + Add Menu Item
//           </button>
//         </div>

//         {/* Menu Section */}
//         <MenuSection
//           menuItems={items}
//           backendURL={backendURL}
//           role="restaurantOwner"
//           onEdit={handleEdit}
//           onDelete={deleteItem}
//           onToggleAvailability={toggleAvailability}
//         />
//       </div>
//     </div>
//   );
// }










