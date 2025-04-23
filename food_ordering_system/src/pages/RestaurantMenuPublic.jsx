// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router";

// // Public Menu Display
// export default function RestaurantMenuPublic() {
//   const { id } = useParams();
//   const [menuItems, setMenuItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   const token = localStorage.getItem("token");

//   const fetchMenuItems = async () => {
//     try {
//       const res = await axios.get(
//         `${
//           import.meta.env.VITE_BACKEND_PREFIX
//         }/MenuItems/restaurant-menuItems/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const availableItems = res.data.menuItems.filter(
//         (item) => item.isAvailable
//       );
//       setMenuItems(availableItems);
//     } catch (err) {
//       console.error("Error fetching menu items", err);
//     }
//   };

//   useEffect(() => {
//     fetchMenuItems();
//   }, [id]);

//   // 🔍 Filter items based on search + category
//   const filteredItems = menuItems.filter((item) => {
//     const matchesSearch = item.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "All" || item.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // 📌 Extract unique categories for the dropdown
//   const uniqueCategories = [
//     "All",
//     ...new Set(menuItems.map((item) => item.category)),
//   ];

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Menu</h2>

//       {/* 🔍 Search */}
//       <input
//         type="text"
//         placeholder="Search menu items..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-4 px-3 py-2 rounded border border-zinc-600 bg-transparent text-white placeholder-zinc-400"
//       />

//       {/* 🏷️ Category Filter */}
//       <select
//         value={selectedCategory}
//         onChange={(e) => setSelectedCategory(e.target.value)}
//         className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-black text-white"
//       >
//         {uniqueCategories.map((cat) => (
//           <option key={cat} value={cat}>
//             {cat}
//           </option>
//         ))}
//       </select>

//       {/* ✅ Menu Display */}
//       {filteredItems.length === 0 ? (
//         <p>No matching menu items found.</p>
//       ) : (
//         filteredItems.map((item) => (
//           <div key={item._id} className="border p-4 mb-4 rounded">
//             <h3 className="text-xl font-semibold">{item.name}</h3>
//             <p>{item.description}</p>
//             <p>Category: {item.category}</p>
//             <p>Price: Rs. {item.price}</p>
//             <p>Prep Time: {item.preparationTime} min</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router";

// // Public menu for restaurant
// export default function RestaurantMenuPublic() {
//   const { id } = useParams();
//   const [menuItems, setMenuItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
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
//       setMenuItems(res.data.menuItems.filter((item) => item.isAvailable));
//     } catch (err) {
//       console.error("Error fetching menu items", err);
//     }
//   };

//   useEffect(() => {
//     fetchMenuItems();
//   }, [id]);

//   // 🔍 Filter items based on search term (name or category)
//   const filteredItems = menuItems.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Menu</h2>

//       {/* 🔍 Search input */}
//       <input
//         type="text"
//         placeholder="Search by name or category..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-4 px-3 py-2 rounded border border-zinc-600 bg-transparent text-white placeholder-zinc-400"
//       />

//       {filteredItems.length === 0 ? (
//         <p>No matching menu items found.</p>
//       ) : (
//         filteredItems.map((item) => (
//           <div key={item._id} className="border p-4 mb-4 rounded">
//             <h3 className="text-xl font-semibold">{item.name}</h3>
//             <p>{item.description}</p>
//             <p>Category: {item.category}</p>
//             <p>Price: Rs. {item.price}</p>
//             <p>Prep Time: {item.preparationTime} min</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router";

// //verified restaurants display to regular users
// export default function RestaurantMenuPublic() {
//   const { id } = useParams();
//   const [menuItems, setMenuItems] = useState([]);
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
//       setMenuItems(res.data.menuItems.filter((item) => item.isAvailable));
//     } catch (err) {
//       console.error("Error fetching menu items", err);
//     }
//   };

//   useEffect(() => {
//     fetchMenuItems();
//   }, [id]);

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Menu</h2>

//       {menuItems.length === 0 ? (
//         <p>No available menu items.</p>
//       ) : (
//         menuItems.map((item) => (
//           <div key={item._id} className="border p-4 mb-4 rounded">
//             <h3 className="text-xl font-semibold">{item.name}</h3>
//             <p>{item.description}</p>
//             <p>Category: {item.category}</p>
//             <p>Price: Rs. {item.price}</p>
//             <p>Prep Time: {item.preparationTime} min</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
