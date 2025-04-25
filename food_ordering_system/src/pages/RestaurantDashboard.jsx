import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig"; // ✅ axios with credentials
import { useAuth } from "../Providers/AuthProvider";
import { useNavigate } from "react-router";
import RestaurantCard from "../components/RestaurantCard";

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

  const fetchRestaurants = async () => {
    try {
      const res = await axiosInstance.get("/restaurants/owned-restaurants");
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      setError("Failed to fetch restaurants");
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === "restaurantOwner") {
      fetchRestaurants();
    }
  }, [user]);

  const handleAvailabilityToggle = async (id) => {
    try {
      await axiosInstance.patch(`/restaurants/availability-restaurant/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error("Error deleting restaurant:", err);
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">My Restaurants</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Search your restaurants..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-zinc-800 text-white placeholder-zinc-400"
      />

      {filteredRestaurants.length === 0 ? (
        <p className="text-zinc-400">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((res) => (
            <RestaurantCard
              key={res._id}
              restaurant={res}
              backendURL={backendURL}
              role="restaurantOwner"
              showMap={false}
              onEdit={() => navigate(`/edit-restaurant/${res._id}`)}
              onDelete={() => handleDelete(res._id)}
              onToggleAvailability={() => handleAvailabilityToggle(res._id)}
              onManageMenu={() => navigate(`/restaurant/${res._id}/menu-items`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}











// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import RestaurantCard from "../components/RestaurantCard";

// export default function RestaurantDashboard() {
//   const { user } = useAuth();
//   const [restaurants, setRestaurants] = useState([]);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/restaurants/owned-restaurants`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setRestaurants(res.data.restaurants || []);
//     } catch (err) {
//       setError("Failed to fetch restaurants");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "restaurantOwner") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   const handleAvailabilityToggle = async (id) => {
//     try {
//       await axios.patch(`${backendURL}/restaurants/availability-restaurant/${id}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error toggling availability:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${backendURL}/restaurants/restaurant-delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant:", err);
//     }
//   };

//   const filteredRestaurants = restaurants.filter((r) =>
//     r.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">My Restaurants</h2>

//       {error && <p className="text-red-500">{error}</p>}

//       <input
//         type="text"
//         placeholder="Search your restaurants..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full mb-6 px-3 py-2 rounded border border-zinc-600 bg-zinc-800 text-white placeholder-zinc-400"
//       />

//       {filteredRestaurants.length === 0 ? (
//         <p className="text-zinc-400">No restaurants found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRestaurants.map((res) => (
//             <RestaurantCard
//               key={res._id}
//               restaurant={res}
//               backendURL={backendURL}
//               role="restaurantOwner"
//               showMap={false}
//               onEdit={() => navigate(`/edit-restaurant/${res._id}`)}
//               onDelete={() => handleDelete(res._id)}
//               onToggleAvailability={() => handleAvailabilityToggle(res._id)}
//               onManageMenu={() => navigate(`/restaurant/${res._id}/menu-items`)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


















// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router";

// export default function RestaurantDashboard() {
//   const { user } = useAuth();
//   const [restaurants, setRestaurants] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/owned-restaurants`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setRestaurants(res.data.restaurants);
//     } catch (err) {
//       setError("Failed to fetch restaurants");
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "restaurantOwner") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   const handleAvailabilityToggle = async (id) => {
//     try {
//       await axios.patch(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/availability-restaurant/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error toggling availability:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/restaurant-delete/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant:", err);
//     }
//   };

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">My Restaurants</h2>
//       {error && <p className="text-red-500">{error}</p>}

//       {restaurants.length === 0 ? (
//         <p>You don’t have any restaurants yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {restaurants.map((res) => (
//             <div key={res._id} className="border border-gray-600 p-4 rounded-md bg-zinc-900">
//               {res.photo && (
//                 <img
//                   src={`${import.meta.env.VITE_BACKEND_PREFIX}/uploads/${res.photo}`}
//                   alt={res.name}
//                   className="w-full h-48 object-cover rounded mb-3"
//                 />
//               )}

//               <h3 className="text-xl font-semibold mb-1">{res.name}</h3>
//               <p className="text-zinc-300 text-sm mb-2">{res.description}</p>

//               {/* Status badge */}
//               <span
//                 className={`inline-block px-2 py-1 text-sm rounded font-medium ${
//                   res.isAvailable ? "bg-green-600 text-white" : "bg-red-600 text-white"
//                 }`}
//               >
//                 {res.isAvailable ? "Open" : "Closed"}
//               </span>

//               <div className="flex flex-wrap gap-2 mt-4">
//                 <button
//                   onClick={() => navigate(`/restaurant/${res._id}/menu-items`)}
//                   className="bg-blue-600 px-3 py-1 rounded"
//                 >
//                   Manage Menu
//                 </button>
//                 <button
//                   onClick={() => handleAvailabilityToggle(res._id)}
//                   className="bg-yellow-500 px-3 py-1 rounded"
//                 >
//                   Toggle Availability
//                 </button>
//                 <button
//                   onClick={() => navigate(`/edit-restaurant/${res._id}`)}
//                   className="bg-purple-600 px-3 py-1 rounded"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(res._id)}
//                   className="bg-red-600 px-3 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


