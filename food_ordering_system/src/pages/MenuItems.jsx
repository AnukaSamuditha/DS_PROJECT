// updated
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig"; // ✅ use axios with cookies
import MenuSection from "../components/MenuSection";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axiosInstance.get("/MenuItems/all-menuItems");

        // 🔥 Safe check to avoid crash if API returns empty or invalid data
        const availableItems = res.data?.menuItems?.filter((item) => item.isAvailable) || [];
        setMenuItems(availableItems);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setMenuItems([]); // 🔥 Reset to empty list if there's an error
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-8">
        {/* Page Heading */}
        <h2 className="text-3xl font-bold text-gray-900">🍽️ Explore Menu Items</h2>

        {/* Menu Section */}
        <MenuSection
          menuItems={menuItems}
          backendURL={import.meta.env.VITE_BACKEND_PREFIX}
          role="regular"
        />
      </div>
    </div>
  );
}









// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // ✅ use axios with cookies
// import MenuSection from "../components/MenuSection";

// export default function MenuItems() {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const res = await axiosInstance.get("/MenuItems/all-menuItems");

//         const availableItems = res.data.menuItems.filter((item) => item.isAvailable);
//         setMenuItems(availableItems);
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
//       <div className="w-full max-w-7xl space-y-8">
//         {/* Page Heading */}
//         <h2 className="text-3xl font-bold text-gray-900">🍽️ Explore Menu Items</h2>

//         {/* Menu Section */}
//         <MenuSection
//           menuItems={menuItems}
//           backendURL={import.meta.env.VITE_BACKEND_PREFIX}
//           role="regular"
//         />
//       </div>
//     </div>
//   );
// }







//og
// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // ✅ use axios with cookies
// import MenuSection from "../components/MenuSection";

// export default function MenuItems() {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const res = await axiosInstance.get("/MenuItems/all-menuItems");

//         const availableItems = res.data.menuItems.filter((item) => item.isAvailable);
//         setMenuItems(availableItems);
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   return (
//     <div className="p-6 text-white max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">🍽️ Explore Menu Items</h2>

//       <MenuSection
//         menuItems={menuItems}
//         backendURL={import.meta.env.VITE_BACKEND_PREFIX} // Optional: only used for images
//         role="regular"
//       />
//     </div>
//   );
// }













// import { useEffect, useState } from "react";
// import axios from "axios";
// import MenuSection from "../components/MenuSection";

// export default function MenuItems() {
//   const [menuItems, setMenuItems] = useState([]);

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const res = await axios.get(`${backendURL}/MenuItems/all-menuItems`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const availableItems = res.data.menuItems.filter((item) => item.isAvailable);
//         setMenuItems(availableItems);
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   return (
//     <div className="p-6 text-white max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">🍽️ Explore Menu Items</h2>

//       <MenuSection
//         menuItems={menuItems}
//         backendURL={backendURL}
//         role="regular"
//       />
//     </div>
//   );
// }
