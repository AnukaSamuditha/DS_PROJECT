import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig"; // ✅ Axios with credentials
import { useAuth } from "@/Providers/AuthProvider";
import { useNavigate } from "react-router";

export default function AdminUserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users/get-all");
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching users", err);
      setUsers([]);
    }
  };

  const deleteUser = async (id, role) => {
    if (role === "admin") {
      alert("You cannot delete another admin.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  // 🧠 Filtered list based on selected role + search
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        {/* Role Filter */}
        <div>
          <label className="block mb-1">Filter by role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zinc-800 border border-zinc-600 rounded px-3 py-1 text-white"
          >
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="restaurantOwner">Restaurant Owner</option>
            <option value="regular">Regular User</option>
          </select>
        </div>

        {/* Text Search */}
        <div className="flex-1 w-full">
          <label className="block mb-1">Search by username or email:</label>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-1 text-white"
          />
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <p className="text-zinc-400">No users found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm text-left border border-zinc-700">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-4 py-2 border border-zinc-700">Username</th>
                <th className="px-4 py-2 border border-zinc-700">Email</th>
                <th className="px-4 py-2 border border-zinc-700">Role</th>
                <th className="px-4 py-2 border border-zinc-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="bg-zinc-900 hover:bg-zinc-800">
                  <td className="px-4 py-2 border border-zinc-700">{u.username}</td>
                  <td className="px-4 py-2 border border-zinc-700">{u.email}</td>
                  <td className="px-4 py-2 border border-zinc-700 capitalize">{u.role}</td>
                  <td className="px-4 py-2 border border-zinc-700">
                    {u.role === "admin" ? (
                      <button
                        className="bg-gray-600 px-3 py-1 text-sm rounded cursor-not-allowed"
                        disabled
                      >
                        Protected
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteUser(u._id, u.role)}
                        className="bg-red-600 px-3 py-1 text-sm rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}













// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/Providers/AuthProvider";
// import { useNavigate } from "react-router";

// export default function AdminUserManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/get-all`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setUsers(res.data?.data || []);
//     } catch (err) {
//       console.error("Error fetching users", err);
//       setUsers([]);
//     }
//   };

//   const deleteUser = async (id, role) => {
//     if (role === "admin") {
//       alert("You cannot delete another admin.");
//       return;
//     }

//     const confirm = window.confirm("Are you sure you want to delete this user?");
//     if (!confirm) return;

//     try {
//       await axios.delete(`${import.meta.env.VITE_BACKEND_PREFIX}/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error("Error deleting user", err);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchUsers();
//     }
//   }, [user]);

//   // 🧠 Filtered list based on selected role + search
//   const filteredUsers = users.filter((u) => {
//     const matchesRole = roleFilter === "all" || u.role === roleFilter;
//     const matchesSearch =
//       u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.email.toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesRole && matchesSearch;
//   });

//   return (
//     <div className="p-6 text-white max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">User Management</h2>

//       {/* 🔍 Filters */}
//       <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
//         {/* Role Filter */}
//         <div>
//           <label className="block mb-1">Filter by role:</label>
//           <select
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//             className="bg-zinc-800 border border-zinc-600 rounded px-3 py-1 text-white"
//           >
//             <option value="all">All</option>
//             <option value="admin">Admin</option>
//             <option value="restaurantOwner">Restaurant Owner</option>
//             <option value="regular">Regular User</option>
//           </select>
//         </div>

//         {/* Text Search */}
//         <div className="flex-1 w-full">
//           <label className="block mb-1">Search by username or email:</label>
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-1 text-white"
//           />
//         </div>
//       </div>

//       {/* Users Table */}
//       {filteredUsers.length === 0 ? (
//         <p className="text-zinc-400">No users found.</p>
//       ) : (
//         <div className="overflow-auto">
//           <table className="w-full text-sm text-left border border-zinc-700">
//             <thead className="bg-zinc-800">
//               <tr>
//                 <th className="px-4 py-2 border border-zinc-700">Username</th>
//                 <th className="px-4 py-2 border border-zinc-700">Email</th>
//                 <th className="px-4 py-2 border border-zinc-700">Role</th>
//                 <th className="px-4 py-2 border border-zinc-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((u) => (
//                 <tr key={u._id} className="bg-zinc-900 hover:bg-zinc-800">
//                   <td className="px-4 py-2 border border-zinc-700">{u.username}</td>
//                   <td className="px-4 py-2 border border-zinc-700">{u.email}</td>
//                   <td className="px-4 py-2 border border-zinc-700 capitalize">{u.role}</td>
//                   <td className="px-4 py-2 border border-zinc-700">
//                     {u.role === "admin" ? (
//                       <button
//                         className="bg-gray-600 px-3 py-1 text-sm rounded cursor-not-allowed"
//                         disabled
//                       >
//                         Protected
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => deleteUser(u._id, u.role)}
//                         className="bg-red-600 px-3 py-1 text-sm rounded"
//                       >
//                         Delete
//                       </button>
//                     )}
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

// export default function AdminUserManagement() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (user && user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/get-all`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Fetched users response:", res.data);

//       setUsers(res.data?.data || []);

//     } catch (err) {
//       console.error("Error fetching users", err);
//       setUsers([]);
//     }
//   };

//   const deleteUser = async (id) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchUsers();
//     } catch (err) {
//       console.error("Error deleting user", err);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchUsers();
//     }
//   }, [user]);

//   return (
//     <div className="p-6 text-white">
//       <h2 className="text-3xl font-bold mb-6">User Management</h2>
//       {users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         users.map((u) => (
//           <div key={u._id} className="border p-4 mb-2 rounded">
//             <p>
//               <strong>{u.username}</strong> — {u.email} ({u.role})
//             </p>
//             <button
//               onClick={() => deleteUser(u._id)}
//               className="mt-2 bg-red-600 px-3 py-1 rounded"
//             >
//               Delete
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
