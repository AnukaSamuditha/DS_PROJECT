//working
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig"; // ✅ axios with credentials
import { useNavigate } from "react-router";
import StarRating from "../components/StarRating"; // ⭐ Import star component

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axiosInstance.get("/restaurants/get-restaurants");

        const verified = res.data?.restaurants?.filter((r) => r.adminApproved);
        setRestaurants(verified || []);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((res) =>
    res.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Heading */}
      <h2 className="text-3xl font-bold text-gray-900">Browse Restaurants</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-black"
      />

      {/* Restaurants Grid */}
      {filteredRestaurants.length === 0 ? (
        <p className="text-center text-gray-500">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((res) => (
            <div
              key={res._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col"
              onClick={() => navigate(`/restaurants/${res._id}`)}
            >
              {res.photo && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_PREFIX}/uploads/${res.photo}`}
                  alt={res.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              )}

              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900">{res.name}</h3>

                {res.averageRating && (
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={parseFloat(res.averageRating)} />
                    <span className="text-xs text-gray-500">
                      ({parseFloat(res.averageRating).toFixed(1)})
                    </span>
                  </div>
                )}

                <p className="text-sm text-gray-600 mt-2">{res.address}</p>

                <span
                  className={`inline-block mt-3 w-max px-3 py-1 text-xs rounded-full font-semibold ${
                    res.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {res.isAvailable ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}















//og
// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // ✅ axios with credentials
// import { useNavigate } from "react-router";
// import StarRating from "../components/StarRating"; // ⭐ Import star component

// export default function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const res = await axiosInstance.get("/restaurants/get-restaurants");

//         const verified = res.data?.restaurants?.filter((r) => r.adminApproved);
//         setRestaurants(verified || []);
//       } catch (err) {
//         console.error("Error fetching restaurants", err);
//       }
//     };

//     fetchRestaurants();
//   }, []);

//   const filteredRestaurants = restaurants.filter((res) =>
//     res.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Browse Restaurants</h2>

//       <input
//         type="text"
//         placeholder="Search by name..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-transparent text-white placeholder-zinc-400"
//       />

//       {filteredRestaurants.length === 0 ? (
//         <p>No restaurants found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRestaurants.map((res) => (
//             <div
//               key={res._id}
//               className="border border-zinc-700 p-4 rounded bg-zinc-900 hover:shadow-lg cursor-pointer transition"
//               onClick={() => navigate(`/restaurants/${res._id}`)}
//             >
//               {res.photo && (
//                 <img
//                   src={`${import.meta.env.VITE_BACKEND_PREFIX}/uploads/${res.photo}`}
//                   alt={res.name}
//                   className="w-full h-40 object-cover rounded mb-3"
//                 />
//               )}

//               <h3 className="text-xl font-semibold">{res.name}</h3>

//               {res.averageRating && (
//                 <div className="flex items-center gap-1 mt-1">
//                   <StarRating rating={parseFloat(res.averageRating)} />
//                   <span className="text-xs text-zinc-400">
//                     ({parseFloat(res.averageRating).toFixed(1)})
//                   </span>
//                 </div>
//               )}

//               <p className="text-sm text-zinc-400 mt-1">{res.address}</p>

//               <span
//                 className={`inline-block mt-3 px-2 py-1 text-sm rounded font-medium ${
//                   res.isAvailable ? "bg-green-600 text-white" : "bg-red-600 text-white"
//                 }`}
//               >
//                 {res.isAvailable ? "Open" : "Closed"}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }








// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router";
// import StarRating from "../components/StarRating"; // ⭐ Import star component

// export default function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/get-restaurants`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const verified = res.data?.restaurants?.filter((r) => r.adminApproved);
//         setRestaurants(verified || []);
//       } catch (err) {
//         console.error("Error fetching restaurants", err);
//       }
//     };

//     fetchRestaurants();
//   }, []);

//   const filteredRestaurants = restaurants.filter((res) =>
//     res.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Browse Restaurants</h2>

//       <input
//         type="text"
//         placeholder="Search by name..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-transparent text-white placeholder-zinc-400"
//       />

//       {filteredRestaurants.length === 0 ? (
//         <p>No restaurants found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRestaurants.map((res) => (
//             <div
//               key={res._id}
//               className="border border-zinc-700 p-4 rounded bg-zinc-900 hover:shadow-lg cursor-pointer transition"
//               onClick={() => navigate(`/restaurants/${res._id}`)}
//             >
//               {res.photo && (
//                 <img
//                   src={`${import.meta.env.VITE_BACKEND_PREFIX}/uploads/${res.photo}`}
//                   alt={res.name}
//                   className="w-full h-40 object-cover rounded mb-3"
//                 />
//               )}

//               <h3 className="text-xl font-semibold">{res.name}</h3>

//               {/* ⭐ Average Rating Preview */}
//               {res.averageRating && (
//                 <div className="flex items-center gap-1 mt-1">
//                   <StarRating rating={parseFloat(res.averageRating)} />
//                   <span className="text-xs text-zinc-400">
//                     ({parseFloat(res.averageRating).toFixed(1)})
//                   </span>
//                 </div>
//               )}

//               <p className="text-sm text-zinc-400 mt-1">{res.address}</p>

//               <span
//                 className={`inline-block mt-3 px-2 py-1 text-sm rounded font-medium ${
//                   res.isAvailable ? "bg-green-600 text-white" : "bg-red-600 text-white"
//                 }`}
//               >
//                 {res.isAvailable ? "Open" : "Closed"}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router";

// export default function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();
//   const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY;

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/get-restaurants`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const verified = res.data?.restaurants?.filter(
//         (restaurant) => restaurant.adminApproved
//       );
//       setRestaurants(verified || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//     }
//   };

//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   const filteredRestaurants = restaurants.filter((res) =>
//     res.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Verified Restaurants</h2>

//       <input
//         type="text"
//         placeholder="Search by name..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-transparent text-white placeholder-zinc-400"
//       />

//       {filteredRestaurants.length === 0 ? (
//         <p>No restaurants available.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRestaurants.map((res) => {
//             const [lng, lat] = res.location?.coordinates || [];
//             return (
//               <div
//                 key={res._id}
//                 className="border border-zinc-700 p-4 rounded bg-zinc-900 hover:shadow-md transition-all"
//               >
//                 {/* 🖼️ Image */}
//                 {res.photo && (
//                   <img
//                     src={`${import.meta.env.VITE_BACKEND_PREFIX}/uploads/${res.photo}`}
//                     alt={res.name}
//                     className="w-full h-48 object-cover rounded mb-3"
//                   />
//                 )}

//                 <h3 className="text-xl font-semibold">{res.name}</h3>
//                 <p className="text-zinc-400 text-sm mb-1">{res.description}</p>
//                 <p className="text-sm text-zinc-500 mb-2">{res.address}</p>

//                 {/* 🔴🟢 Status badge */}
//                 <span
//                   className={`inline-block mb-3 px-2 py-1 text-sm rounded font-medium ${
//                     res.isAvailable ? "bg-green-600 text-white" : "bg-red-600 text-white"
//                   }`}
//                 >
//                   {res.isAvailable ? "Open" : "Closed"}
//                 </span>

//                 {/* 🗺️ Map */}
//                 {lat && lng && mapsKey && (
//                   <iframe
//                     title={`Map of ${res.name}`}
//                     width="100%"
//                     height="200"
//                     loading="lazy"
//                     className="rounded"
//                     style={{ border: 0 }}
//                     allowFullScreen
//                     referrerPolicy="no-referrer-when-downgrade"
//                     src={`https://www.google.com/maps/embed/v1/view?key=${mapsKey}&center=${lat},${lng}&zoom=15`}
//                   ></iframe>
//                 )}

//                 <button
//                   onClick={() => navigate(`/restaurants/${res._id}/menu`)}
//                   className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
//                 >
//                   View Menu
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }












// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router";

// export default function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/get-restaurants`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // ✅ Only show verified restaurants
//       const verified = res.data?.restaurants?.filter(
//         (restaurant) => restaurant.adminApproved
//       );
//       setRestaurants(verified || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//     }
//   };

//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   const filteredRestaurants = restaurants.filter((res) =>
//     res.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Verified Restaurants</h2>

//       {/* 🔍 Search */}
//       <input
//         type="text"
//         placeholder="Search by name..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-transparent text-white placeholder-zinc-400"
//       />

//       {filteredRestaurants.length === 0 ? (
//         <p>No restaurants available.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRestaurants.map((res) => (
//             <div
//               key={res._id}
//               className="border border-zinc-700 p-4 rounded bg-zinc-900 cursor-pointer hover:shadow-md transition-all"
//               onClick={() => navigate(`/restaurants/${res._id}/menu`)}
//             >
//               {/* 🖼️ Image */}
//               {res.photo && (
//                 <img
//                   src={`${import.meta.env.VITE_BACKEND_PREFIX}/uploads/${res.photo}`}
//                   alt={res.name}
//                   className="w-full h-48 object-cover rounded mb-3"
//                 />
//               )}

//               <h3 className="text-xl font-semibold">{res.name}</h3>
//               <p className="text-zinc-400 text-sm mb-2">{res.description}</p>
//               <p className="text-sm text-zinc-500">{res.address}</p>

//               {/* 🔴🟢 Status badge */}
//               <span
//                 className={`inline-block mt-3 px-2 py-1 text-sm rounded font-medium ${
//                   res.isAvailable ? "bg-green-600 text-white" : "bg-red-600 text-white"
//                 }`}
//               >
//                 {res.isAvailable ? "Open" : "Closed"}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }









