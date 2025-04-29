import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import { useAuth } from "@/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AdminRestaurantManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  const userRole = user?.role || user?.user?.role;

  useEffect(() => {
    if (user && userRole !== "admin") {
      navigate("/");
    }
  }, [user, userRole, navigate]);

  const fetchRestaurants = async () => {
    try {
      const res = await axiosInstance.get("/restaurants/get-restaurants");
      setRestaurants(res.data?.restaurants || []);
    } catch (err) {
      console.error("Error fetching restaurants", err);
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error("Error deleting restaurant", err);
    }
  };

  const toggleVerify = async (id, currentStatus) => {
    try {
      await axiosInstance.patch(`/restaurants/restaurant-verification/${id}`, {
        adminApproved: !currentStatus,
      });
      fetchRestaurants();
    } catch (err) {
      console.error("Verification error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchRestaurants();
    }
  }, [userRole]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Manage Restaurants</h2>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Address", "Contact", "Available", "Verified", "Actions"].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No restaurants found.
                  </td>
                </tr>
              ) : (
                restaurants.map((res) => (
                  <tr
                    key={res._id}
                    className="hover:bg-gray-100 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {res.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {res.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {res.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {res.isAvailable ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Not Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {res.adminApproved ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleVerify(res._id, res.adminApproved)}
                        className="px-4 py-2 text-xs font-semibold bg-black text-white rounded-full hover:bg-gray-900 transition"
                      >
                        {res.adminApproved ? "Unverify" : "Verify"}
                      </button>
                      <button
                        onClick={() => deleteRestaurant(res._id)}
                        className="px-4 py-2 text-xs font-semibold bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}










// //updated-working
// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // ✅ Axios with credentials
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router-dom"; // 🔥 fixed router import

// export default function AdminRestaurantManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [restaurants, setRestaurants] = useState([]);

//   // 🔥 updated: safely access user role
//   const userRole = user?.role || user?.user?.role;

//   useEffect(() => {
//     if (user && userRole !== "admin") { // 🔥 fix here
//       navigate("/");
//     }
//   }, [user, userRole, navigate]); // 🔥 add userRole to dependencies

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axiosInstance.get("/restaurants/get-restaurants");
//       setRestaurants(res.data?.restaurants || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//     }
//   };

//   const deleteRestaurant = async (id) => {
//     const confirmDelete = window.confirm("Delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant", err);
//     }
//   };

//   const toggleVerify = async (id, currentStatus) => {
//     try {
//       await axiosInstance.patch(`/restaurants/restaurant-verification/${id}`, {
//         adminApproved: !currentStatus,
//       });
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Verification error", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (userRole === "admin") { // 🔥 fix here
//       fetchRestaurants();
//     }
//   }, [userRole]); // 🔥 updated dependency

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-8">
//       {/* Heading */}
//       <h2 className="text-3xl font-bold text-gray-900">Restaurant Management (Admin)</h2>

//       {/* Restaurants Table */}
//       {restaurants.length === 0 ? (
//         <p className="text-gray-500 text-center">No restaurants found.</p>
//       ) : (
//         <div className="overflow-auto rounded-2xl shadow bg-white">
//           <table className="w-full text-sm text-left border-collapse">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-6 py-3">Name</th>
//                 <th className="px-6 py-3">Address</th>
//                 <th className="px-6 py-3">Contact</th>
//                 <th className="px-6 py-3">Available</th>
//                 <th className="px-6 py-3">Verified</th>
//                 <th className="px-6 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {restaurants.map((res) => (
//                 <tr key={res._id} className="border-t hover:bg-gray-50">
//                   <td className="px-6 py-4">{res.name}</td>
//                   <td className="px-6 py-4">{res.address}</td>
//                   <td className="px-6 py-4">{res.contactNumber}</td>
//                   <td className="px-6 py-4">
//                     {res.isAvailable ? (
//                       <span className="text-green-600 font-bold">Available</span>
//                     ) : (
//                       <span className="text-red-500 font-bold">Not Available</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     {res.adminApproved ? (
//                       <span className="text-green-600 font-bold">Verified</span>
//                     ) : (
//                       <span className="text-yellow-500 font-bold">Pending</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 space-x-2">
//                     <button
//                       onClick={() => toggleVerify(res._id, res.adminApproved)}
//                       className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition"
//                     >
//                       {res.adminApproved ? "Unverify" : "Verify"}
//                     </button>
//                     <button
//                       onClick={() => deleteRestaurant(res._id)}
//                       className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }






// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // ✅ Axios with credentials
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";

// export default function AdminRestaurantManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [restaurants, setRestaurants] = useState([]);

//   useEffect(() => {
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axiosInstance.get("/restaurants/get-restaurants");
//       setRestaurants(res.data?.restaurants || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//     }
//   };

//   const deleteRestaurant = async (id) => {
//     const confirmDelete = window.confirm("Delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant", err);
//     }
//   };

//   const toggleVerify = async (id, currentStatus) => {
//     try {
//       await axiosInstance.patch(`/restaurants/restaurant-verification/${id}`, {
//         adminApproved: !currentStatus,
//       });
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Verification error", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-8">
//       {/* Heading */}
//       <h2 className="text-3xl font-bold text-gray-900">Restaurant Management (Admin)</h2>

//       {/* Restaurants Table */}
//       {restaurants.length === 0 ? (
//         <p className="text-gray-500 text-center">No restaurants found.</p>
//       ) : (
//         <div className="overflow-auto rounded-2xl shadow bg-white">
//           <table className="w-full text-sm text-left border-collapse">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-6 py-3">Name</th>
//                 <th className="px-6 py-3">Address</th>
//                 <th className="px-6 py-3">Contact</th>
//                 <th className="px-6 py-3">Available</th>
//                 <th className="px-6 py-3">Verified</th>
//                 <th className="px-6 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {restaurants.map((res) => (
//                 <tr key={res._id} className="border-t hover:bg-gray-50">
//                   <td className="px-6 py-4">{res.name}</td>
//                   <td className="px-6 py-4">{res.address}</td>
//                   <td className="px-6 py-4">{res.contactNumber}</td>
//                   <td className="px-6 py-4">
//                     {res.isAvailable ? (
//                       <span className="text-green-600 font-bold">Available</span>
//                     ) : (
//                       <span className="text-red-500 font-bold">Not Available</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     {res.adminApproved ? (
//                       <span className="text-green-600 font-bold">Verified</span>
//                     ) : (
//                       <span className="text-yellow-500 font-bold">Pending</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 space-x-2">
//                     <button
//                       onClick={() => toggleVerify(res._id, res.adminApproved)}
//                       className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition"
//                     >
//                       {res.adminApproved ? "Unverify" : "Verify"}
//                     </button>
//                     <button
//                       onClick={() => deleteRestaurant(res._id)}
//                       className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }






//og
// import { useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // ✅ Axios with credentials
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";

// export default function AdminRestaurantManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [restaurants, setRestaurants] = useState([]);

//   useEffect(() => {
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axiosInstance.get("/restaurants/get-restaurants");
//       setRestaurants(res.data?.restaurants || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//     }
//   };

//   const deleteRestaurant = async (id) => {
//     const confirmDelete = window.confirm("Delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`/restaurants/restaurant-delete/${id}`);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant", err);
//     }
//   };

//   const toggleVerify = async (id, currentStatus) => {
//     try {
//       await axiosInstance.patch(
//         `/restaurants/restaurant-verification/${id}`,
//         { adminApproved: !currentStatus }
//       );
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Verification error", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   return (
//     <div className="p-6 text-white max-w-7xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Restaurant Management (Admin)</h2>

//       {restaurants.length === 0 ? (
//         <p className="text-zinc-400">No restaurants found.</p>
//       ) : (
//         <div className="overflow-auto">
//           <table className="w-full text-sm text-left border border-zinc-700">
//             <thead className="bg-zinc-800 text-white">
//               <tr>
//                 <th className="px-4 py-2 border border-zinc-700">Name</th>
//                 <th className="px-4 py-2 border border-zinc-700">Address</th>
//                 <th className="px-4 py-2 border border-zinc-700">Contact</th>
//                 <th className="px-4 py-2 border border-zinc-700">Available</th>
//                 <th className="px-4 py-2 border border-zinc-700">Verified</th>
//                 <th className="px-4 py-2 border border-zinc-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {restaurants.map((res) => (
//                 <tr key={res._id} className="bg-zinc-900 hover:bg-zinc-800 transition">
//                   <td className="px-4 py-2 border border-zinc-700">{res.name}</td>
//                   <td className="px-4 py-2 border border-zinc-700">{res.address}</td>
//                   <td className="px-4 py-2 border border-zinc-700">{res.contactNumber}</td>
//                   <td className="px-4 py-2 border border-zinc-700">
//                     {res.isAvailable ? "✅" : "❌"}
//                   </td>
//                   <td className="px-4 py-2 border border-zinc-700">
//                     {res.adminApproved ? "✅" : "❌"}
//                   </td>
//                   <td className="px-4 py-2 border border-zinc-700 space-x-2">
//                     <button
//                       onClick={() => toggleVerify(res._id, res.adminApproved)}
//                       className="bg-yellow-500 text-sm px-3 py-1 rounded"
//                     >
//                       {res.adminApproved ? "Unverify" : "Verify"}
//                     </button>
//                     <button
//                       onClick={() => deleteRestaurant(res._id)}
//                       className="bg-red-600 text-sm px-3 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }










// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";

// export default function AdminRestaurantManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [restaurants, setRestaurants] = useState([]);
//   const token = localStorage.getItem("token");

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   useEffect(() => {
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/restaurants/get-restaurants`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRestaurants(res.data?.restaurants || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//     }
//   };

//   const deleteRestaurant = async (id) => {
//     const confirmDelete = window.confirm("Delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${backendURL}/restaurants/restaurant-delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant", err);
//     }
//   };

//   const toggleVerify = async (id, currentStatus) => {
//     try {
//       await axios.patch(
//         `${backendURL}/restaurants/restaurant-verification/${id}`,
//         { adminApproved: !currentStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Verification error", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   return (
//     <div className="p-6 text-white max-w-7xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Restaurant Management (Admin)</h2>

//       {restaurants.length === 0 ? (
//         <p className="text-zinc-400">No restaurants found.</p>
//       ) : (
//         <div className="overflow-auto">
//           <table className="w-full text-sm text-left border border-zinc-700">
//             <thead className="bg-zinc-800 text-white">
//               <tr>
//                 <th className="px-4 py-2 border border-zinc-700">Name</th>
//                 <th className="px-4 py-2 border border-zinc-700">Address</th>
//                 <th className="px-4 py-2 border border-zinc-700">Contact</th>
//                 <th className="px-4 py-2 border border-zinc-700">Available</th>
//                 <th className="px-4 py-2 border border-zinc-700">Verified</th>
//                 <th className="px-4 py-2 border border-zinc-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {restaurants.map((res) => (
//                 <tr key={res._id} className="bg-zinc-900 hover:bg-zinc-800 transition">
//                   <td className="px-4 py-2 border border-zinc-700">{res.name}</td>
//                   <td className="px-4 py-2 border border-zinc-700">{res.address}</td>
//                   <td className="px-4 py-2 border border-zinc-700">{res.contactNumber}</td>
//                   <td className="px-4 py-2 border border-zinc-700">
//                     {res.isAvailable ? "✅" : "❌"}
//                   </td>
//                   <td className="px-4 py-2 border border-zinc-700">
//                     {res.adminApproved ? "✅" : "❌"}
//                   </td>
//                   <td className="px-4 py-2 border border-zinc-700 space-x-2">
//                     <button
//                       onClick={() => toggleVerify(res._id, res.adminApproved)}
//                       className="bg-yellow-500 text-sm px-3 py-1 rounded"
//                     >
//                       {res.adminApproved ? "Unverify" : "Verify"}
//                     </button>
//                     <button
//                       onClick={() => deleteRestaurant(res._id)}
//                       className="bg-red-600 text-sm px-3 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }










// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import RestaurantCard from "@/components/RestaurantCard";

// export default function AdminRestaurantManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [restaurants, setRestaurants] = useState([]);
//   const token = localStorage.getItem("token");

//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   // Redirect non-admin users
//   useEffect(() => {
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/restaurants/get-restaurants`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRestaurants(res.data?.restaurants || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//     }
//   };

//   const deleteRestaurant = async (id) => {
//     const confirmDelete = window.confirm("Delete this restaurant?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${backendURL}/restaurants/restaurant-delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant", err);
//     }
//   };

//   const toggleVerify = async (id, currentStatus) => {
//     try {
//       await axios.patch(
//         `${backendURL}/restaurants/restaurant-verification/${id}`,
//         { adminApproved: !currentStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Verification error", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   return (
//     <div className="p-6 text-white max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Restaurant Management (Admin)</h2>

//       {restaurants.length === 0 ? (
//         <p className="text-zinc-400">No restaurants found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {restaurants.map((res) => (
//             <RestaurantCard
//               key={res._id}
//               restaurant={res}
//               backendURL={backendURL}
//               role="admin"
//               onDelete={() => deleteRestaurant(res._id)}
//               onVerify={() => toggleVerify(res._id, res.adminApproved)}
//               //onToggleAvailability={() => console.log("Optionally add availability toggle")}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }









// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";

// export default function AdminRestaurantManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [restaurants, setRestaurants] = useState([]);
//   const token = localStorage.getItem("token");

//   // Redirect non-admins
//   useEffect(() => {
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/get-restaurants`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setRestaurants(res.data?.restaurants || []);
//     } catch (err) {
//       console.error("Error fetching restaurants", err);
//       setRestaurants([]);
//     }
//   };

//   const deleteRestaurant = async (id) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/restaurant-delete/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error deleting restaurant", err);
//     }
//   };

//   const toggleVerify = async (id, currentStatus) => {
//     try {
//       const res = await axios.patch(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/restaurant-verification/${id}`,
//         { adminApproved: !currentStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Verification updated:", res.data);
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error verifying restaurant", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchRestaurants();
//     }
//   }, [user]);

//   return (
//     <div className="p-6 text-white">
//       <h2 className="text-3xl font-bold mb-6">Restaurant Management</h2>
//       {restaurants.length === 0 ? (
//         <p>No restaurants found.</p>
//       ) : (
//         restaurants.map((res) => (
//           <div key={res._id} className="border p-4 mb-2 rounded">
//             <p>
//               <strong>{res.name}</strong> — {res.address}
//             </p>
//             <p>Status: {res.adminApproved ? "✅ Verified" : "❌ Unverified"}</p>
//             <div className="flex gap-3 mt-2">
//               <button
//                 onClick={() => toggleVerify(res._id, res.adminApproved)}
//                 className="bg-yellow-500 px-3 py-1 rounded"
//               >
//                 Toggle Verify
//               </button>
//               <button
//                 onClick={() => deleteRestaurant(res._id)}
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
