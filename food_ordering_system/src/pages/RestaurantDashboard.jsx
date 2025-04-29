import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import { useAuth } from "../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import Modal from "../components/Modal";

export default function RestaurantDashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

  useEffect(() => {
    if (!isLoading) {
      const role = localStorage.getItem("role");
      if (role !== "restaurantOwner") {
        navigate("/signin");
      }
    }
  }, [user, isLoading, navigate]);
  console.log(user);
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "restaurantOwner") {
      fetchRestaurants();
    }
  }, [user]);

  const fetchRestaurants = async () => {
    try {
      const res = await axiosInstance.get("/restaurants/owned-restaurants");
      setRestaurants(res.data.restaurants || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch restaurants.");
    }
  };

  const handleAvailabilityToggle = async (id) => {
    try {
      await axiosInstance.patch(`/restaurants/availability-restaurant/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error("Toggle availability failed:", err);
    }
  };

  const handleDelete = async () => {
    if (restaurantToDelete) {
      try {
        await axiosInstance.delete(`/restaurants/restaurant-delete/${restaurantToDelete}`);
        fetchRestaurants();
        setIsModalOpen(false);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="p-6 text-gray-600">Loading authentication...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900">My Restaurants</h2>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search your restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Restaurants List */}
      {filteredRestaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((res) => (
            <RestaurantCard
              key={res._id}
              restaurant={res}
              backendURL={backendURL}
              role="restaurantOwner"
              showMap={false}
              onEdit={() => navigate(`/edit-restaurant/${res._id}`)}
              onDelete={() => {
                setRestaurantToDelete(res._id);
                setIsModalOpen(true);
              }}
              onToggleAvailability={() => handleAvailabilityToggle(res._id)}
              onManageMenu={() => navigate(`/restaurant/${res._id}/menu-items`)}
            />
          ))}
        </div>
      )}

      {/* Modal Component */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this restaurant?"
        />
      )}
    </div>
  );
}







//updated - chatgpt - loading error
// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router-dom"; // 🔥 updated import
// import RestaurantCard from "../components/RestaurantCard";
// // import { toast } from "react-toastify"; // ✅ Optional toast support

// export default function RestaurantDashboard() {
//   const { user, isInitialized } = useAuth(); // 🔥 updated from authLoading ➔ isInitialized
//   const navigate = useNavigate();

//   const [restaurants, setRestaurants] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   useEffect(() => {
//     console.log("isInitialized:", isInitialized);
//     console.log("user:", user);

//     if (isInitialized) { // 🔥 use isInitialized safely
//       const role =  user?.user?.role; // 🔥 safe access
//       if (!user || role !== "restaurantOwner") {
//         navigate("/signin");
//       }
//     }
//   }, [user, isInitialized, navigate]);

//   useEffect(() => {
//     const role = user?.user?.role;
//     if (role === "restaurantOwner") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axiosInstance.get("/restaurants/owned-restaurants");
//       setRestaurants(res.data.restaurants || []);
//       setError("");
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to fetch restaurants.");
//     }
//   };

//   const handleAvailabilityToggle = async (id) => {
//     try {
//       await axiosInstance.patch(`/restaurants/availability-restaurant/${id}`);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Toggle availability failed:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   const filteredRestaurants = restaurants.filter((r) =>
//     r.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // 🔥 updated loading condition
//   if (!isInitialized) return <div className="p-6 text-gray-600">Loading...</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-8">
//       {/* Heading */}
//       <h2 className="text-3xl font-bold text-gray-900">My Restaurants</h2>

//       {/* Search Box */}
//       <div>
//         <input
//           type="text"
//           placeholder="Search your restaurants..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
//         />
//       </div>

//       {/* Error */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Restaurants List */}
//       {filteredRestaurants.length === 0 ? (
//         <p className="text-gray-500">No restaurants found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
// import axiosInstance from "@/axiosConfig";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import RestaurantCard from "../components/RestaurantCard";
// // import { toast } from "react-toastify"; // ✅ Optional toast support

// export default function RestaurantDashboard() {
//   const { user, authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [restaurants, setRestaurants] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   useEffect(() => {
//     if (!authLoading && (!user || user.role !== "restaurantOwner")) {
//       navigate("/signin");
//     }
//   }, [user, authLoading, navigate]);

//   useEffect(() => {
//     if (user?.role === "restaurantOwner") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axiosInstance.get("/restaurants/owned-restaurants");
//       setRestaurants(res.data.restaurants || []);
//       setError("");
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to fetch restaurants.");
//     }
//   };

//   const handleAvailabilityToggle = async (id) => {
//     try {
//       await axiosInstance.patch(`/restaurants/availability-restaurant/${id}`);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Toggle availability failed:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   const filteredRestaurants = restaurants.filter((r) =>
//     r.name.toLowerCase().includes(search.toLowerCase())
//   );

//   if (authLoading) return <div className="p-6 text-gray-600">Loading...</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-8">
//       {/* Heading */}
//       <h2 className="text-3xl font-bold text-gray-900">My Restaurants</h2>

//       {/* Search Box */}
//       <div>
//         <input
//           type="text"
//           placeholder="Search your restaurants..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
//         />
//       </div>

//       {/* Error */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Restaurants List */}
//       {filteredRestaurants.length === 0 ? (
//         <p className="text-gray-500">No restaurants found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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







//og
// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import RestaurantCard from "../components/RestaurantCard";
// // import { toast } from "react-toastify"; // ✅ Optional toast support

// export default function RestaurantDashboard() {
//   const { user, authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [restaurants, setRestaurants] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   // ⛔ Redirect if not authorized (after auth check completes)
//   useEffect(() => {
//     if (!authLoading && (!user || user.role !== "restaurantOwner")) {
//       navigate("/signin");
//     }
//   }, [user, authLoading, navigate]);

//   // ✅ Fetch restaurants after user is validated
//   useEffect(() => {
//     if (user?.role === "restaurantOwner") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axiosInstance.get("/restaurants/owned-restaurants");
//       setRestaurants(res.data.restaurants || []);
//       setError("");
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to fetch restaurants.");
//       // toast.error("Failed to fetch restaurants.");
//     }
//   };

//   const handleAvailabilityToggle = async (id) => {
//     try {
//       await axiosInstance.patch(`/restaurants/availability-restaurant/${id}`);
//       fetchRestaurants();
//       // toast.success("Availability updated.");
//     } catch (err) {
//       console.error("Toggle availability failed:", err);
//       // toast.error("Failed to update availability.");
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
//       fetchRestaurants();
//       // toast.success("Restaurant deleted.");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       // toast.error("Failed to delete restaurant.");
//     }
//   };

//   const filteredRestaurants = restaurants.filter((r) =>
//     r.name.toLowerCase().includes(search.toLowerCase())
//   );

//   if (authLoading) return <div className="text-white p-6">Loading...</div>;

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">My Restaurants</h2>

//       {error && <p className="text-red-500 mb-2">{error}</p>}

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


