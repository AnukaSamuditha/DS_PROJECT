import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

export default function AdminUserManagement() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;

    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/get-all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data);
      } catch (err) {
        alert('Failed to fetch users');
        console.error(err);
      }
    };

    fetchUsers();
  }, [token, user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  if (!token || user?.role !== 'admin') return <p className="text-red-600 text-center mt-6">Access denied.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">👥 User Management</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
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






// import { useEffect, useState } from 'react';
// import api from '../api/axios';
// import { useAuth } from '../auth/AuthContext';

// export default function AdminUserManagement() {
//   const { token, user } = useAuth();
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     if (!token || user?.role !== 'admin') return;

//     const fetchUsers = async () => {
//       try {
//         const res = await api.get('/users/get-all', {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setUsers(res.data.data);
//       } catch (err) {
//         alert('Failed to fetch users');
//         console.error(err);
//       }
//     };

//     fetchUsers();
//   }, [token, user]);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;

//     try {
//       await api.delete(`/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setUsers((prev) => prev.filter((u) => u._id !== id));
//     } catch (err) {
//       alert('Failed to delete user');
//       console.error(err);
//     }
//   };

//   if (!token || user?.role !== 'admin') return <p>Access denied.</p>;

//   return (
//     <div>
//       <h2>User Management</h2>

//       {users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
//           <thead>
//             <tr>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Created At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr key={u._id}>
//                 <td>{u.username}</td>
//                 <td>{u.email}</td>
//                 <td>{u.role}</td>
//                 <td>{new Date(u.createdAt).toLocaleString()}</td>
//                 <td>
//                   {u.role !== 'admin' && (
//                     <button onClick={() => handleDelete(u._id)}>Delete</button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
