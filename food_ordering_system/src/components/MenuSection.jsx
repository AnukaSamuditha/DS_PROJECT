import { useState, useMemo } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Importing an icon for the cart

export default function MenuSection({
  menuItems,
  backendURL,
  role = "regular",
  onEdit,
  onDelete,
  onToggleAvailability,
  onOrder // New prop for order functionality
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 🔍 Get unique categories dynamically
  const categories = useMemo(() => {
    const unique = new Set(menuItems.map((item) => item.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [menuItems]);

  // 🎯 Filter items based on search and selected category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* 🔍 Search + 🗂️ Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 📦 Menu Item Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center">No menu items match your search or filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
            >
              {item.photo && (
                <img
                  src={`${backendURL}/uploads/${item.photo}`}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-base text-black font-semibold mb-1">Rs. {item.price}</p>
              <p className="text-sm mb-4">
                {item.isAvailable ? (
                  <span className="text-green-600 font-semibold">🟢 Available</span>
                ) : (
                  <span className="text-red-500 font-semibold">🔴 Unavailable</span>
                )}
              </p>

              {/* 👥 Role-based Actions */}
              {(role === "restaurantOwner" || role === "admin") && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item._id)}
                      className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                      Edit
                    </button>
                  )}
                  {onToggleAvailability && (
                    <button
                      onClick={() => onToggleAvailability(item._id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-4 py-2 rounded-lg transition"
                    >
                      Toggle
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}

              {/* Order Button for Regular Users */}
              {role === "regular" && item.isAvailable && (
                <button
                  onClick={() => onOrder(item._id)} // Trigger the order function
                  className="mt-auto flex items-center justify-center bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-lg py-3 px-6 transition-all duration-300"
                >
                  <FaShoppingCart className="mr-2" /> Order Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




// import { useState, useMemo } from "react";

// export default function MenuSection({
//   menuItems,
//   backendURL,
//   role = "regular",
//   onEdit,
//   onDelete,
//   onToggleAvailability
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // 🔍 Get unique categories dynamically
//   const categories = useMemo(() => {
//     const unique = new Set(menuItems.map((item) => item.category).filter(Boolean));
//     return ["All", ...Array.from(unique)];
//   }, [menuItems]);

//   // 🎯 Filter items based on search and selected category
//   const filteredItems = menuItems.filter((item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "All" || item.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div>
//       {/* 🔍 Search + 🗂️ Category Filter */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search dishes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full sm:w-1/2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
//         >
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 📦 Menu Item Grid */}
//       {filteredItems.length === 0 ? (
//         <p className="text-gray-500 text-center">No menu items match your search or filter.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredItems.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
//             >
//               {item.photo && (
//                 <img
//                   src={`${backendURL}/uploads/${item.photo}`}
//                   alt={item.name}
//                   className="w-full h-40 object-cover rounded-xl mb-4"
//                 />
//               )}
//               <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
//               <p className="text-sm text-gray-600 mb-2">{item.description}</p>
//               <p className="text-base text-black font-semibold mb-1">Rs. {item.price}</p>
//               <p className="text-sm mb-4">
//                 {item.isAvailable ? (
//                   <span className="text-green-600 font-semibold">🟢 Available</span>
//                 ) : (
//                   <span className="text-red-500 font-semibold">🔴 Unavailable</span>
//                 )}
//               </p>

//               {/* 👥 Role-based Actions */}
//               {(role === "restaurantOwner" || role === "admin") && (
//                 <div className="flex flex-wrap gap-2 mt-auto">
//                   {onEdit && (
//                     <button
//                       onClick={() => onEdit(item._id)}
//                       className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg transition"
//                     >
//                       Edit
//                     </button>
//                   )}
//                   {onToggleAvailability && (
//                     <button
//                       onClick={() => onToggleAvailability(item._id)}
//                       className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-4 py-2 rounded-lg transition"
//                     >
//                       Toggle
//                     </button>
//                   )}
//                   {onDelete && (
//                     <button
//                       onClick={() => onDelete(item._id)}
//                       className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }












//og
// import { useState, useMemo } from "react";

// export default function MenuSection({
//   menuItems,
//   backendURL,
//   role = "regular",
//   onEdit,
//   onDelete,
//   onToggleAvailability
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // 🔍 Get unique categories dynamically
//   const categories = useMemo(() => {
//     const unique = new Set(menuItems.map((item) => item.category).filter(Boolean));
//     return ["All", ...Array.from(unique)];
//   }, [menuItems]);

//   // 🎯 Filter items based on search and selected category
//   const filteredItems = menuItems.filter((item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "All" || item.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div>
//       {/* 🔍 Search + 🗂️ Category Filter */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search dishes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full sm:w-1/2 px-3 py-2 rounded border border-zinc-600 bg-zinc-800 text-white placeholder-zinc-400"
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="px-3 py-2 rounded border border-zinc-600 bg-zinc-800 text-white"
//         >
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 📦 Menu Item Grid */}
//       {filteredItems.length === 0 ? (
//         <p className="text-zinc-400">No menu items match your search or filter.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredItems.map((item) => (
//             <div
//               key={item._id}
//               className="bg-zinc-800 p-4 rounded shadow hover:shadow-md transition"
//             >
//               {item.photo && (
//                 <img
//                   src={`${backendURL}/uploads/${item.photo}`}
//                   alt={item.name}
//                   className="w-full h-40 object-cover rounded mb-3"
//                 />
//               )}
//               <h4 className="text-lg font-semibold text-white mb-1">{item.name}</h4>
//               <p className="text-sm text-zinc-400 mb-1">{item.description}</p>
//               <p className="text-sm text-white font-bold mb-1">Rs. {item.price}</p>
//               <p className="text-sm text-zinc-400 mb-2">
//                 {item.isAvailable ? "🟢 Available" : "🔴 Unavailable"}
//               </p>

//               {/* 👥 Role-based Actions */}
//               {(role === "restaurantOwner" || role === "admin") && (
//                 <div className="flex gap-2 flex-wrap mt-2">
//                   {onEdit && (
//                     <button
//                       onClick={() => onEdit(item._id)}
//                       className="bg-blue-600 text-sm px-3 py-1 rounded hover:bg-blue-700"
//                     >
//                       Edit
//                     </button>
//                   )}
//                   {onToggleAvailability && (
//                     <button
//                       onClick={() => onToggleAvailability(item._id)}
//                       className="bg-yellow-500 text-sm px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       Toggle Availability
//                     </button>
//                   )}
//                   {onDelete && (
//                     <button
//                       onClick={() => onDelete(item._id)}
//                       className="bg-red-600 text-sm px-3 py-1 rounded hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }












// import { useState } from "react";

// export default function MenuSection({
//   menuItems,
//   backendURL,
//   role = "regular",
//   onEdit,
//   onDelete,
//   onToggleAvailability
// }) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredItems = menuItems.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       {/* 🔍 Search bar */}
//       <input
//         type="text"
//         placeholder="Search dishes..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-zinc-800 text-white placeholder-zinc-400"
//       />

//       {filteredItems.length === 0 ? (
//         <p className="text-zinc-400">No menu items match your search.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredItems.map((item) => (
//             <div
//               key={item._id}
//               className="bg-zinc-800 p-4 rounded shadow hover:shadow-md transition"
//             >
//               {item.photo && (
//                 <img
//                   src={`${backendURL}/uploads/${item.photo}`}
//                   alt={item.name}
//                   className="w-full h-40 object-cover rounded mb-3"
//                 />
//               )}

//               <h4 className="text-lg font-semibold text-white mb-1">{item.name}</h4>
//               <p className="text-sm text-zinc-400 mb-1">{item.description}</p>
//               <p className="text-sm text-white font-bold mb-1">Rs. {item.price}</p>
//               <p className="text-sm text-zinc-400 mb-2">
//                 {item.isAvailable ? "🟢 Available" : "🔴 Unavailable"}
//               </p>

//               {/* 👥 Actions based on role */}
//               {(role === "restaurantOwner" || role === "admin") && (
//                 <div className="flex gap-2 flex-wrap mt-2">
//                   {onEdit && (
//                     <button
//                       onClick={() => onEdit(item._id)}
//                       className="bg-blue-600 text-sm px-3 py-1 rounded hover:bg-blue-700"
//                     >
//                       Edit
//                     </button>
//                   )}
//                   {onToggleAvailability && (
//                     <button
//                       onClick={() => onToggleAvailability(item._id)}
//                       className="bg-yellow-500 text-sm px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       Toggle Availability
//                     </button>
//                   )}
//                   {onDelete && (
//                     <button
//                       onClick={() => onDelete(item._id)}
//                       className="bg-red-600 text-sm px-3 py-1 rounded hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }










// // components/MenuSection.jsx
// import { useState } from "react";

// export default function MenuSection({ menuItems, backendURL }) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredItems = menuItems.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       {/* 🔍 Search bar */}
//       <input
//         type="text"
//         placeholder="Search dishes..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-4 px-3 py-2 rounded border border-zinc-600 bg-zinc-800 text-white placeholder-zinc-400"
//       />

//       {filteredItems.length === 0 ? (
//         <p className="text-zinc-400">No menu items match your search.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredItems.map((item) => (
//             <div key={item._id} className="bg-zinc-800 p-4 rounded shadow">
//               {item.photo && (
//                 <img
//                   src={`${backendURL}/uploads/${item.photo}`}
//                   alt={item.name}
//                   className="w-full h-40 object-cover rounded mb-2"
//                 />
//               )}
//               <h4 className="text-lg font-semibold">{item.name}</h4>
//               <p className="text-sm text-zinc-400 mb-1">{item.description}</p>
//               <p className="text-sm text-white font-bold">Rs. {item.price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
