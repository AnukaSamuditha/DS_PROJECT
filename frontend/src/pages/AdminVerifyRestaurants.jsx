import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

export default function AdminVerifyRestaurants() {
  const { token, user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;

    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/restaurants/get-restaurants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRestaurants(res.data.restaurants);
      } catch (err) {
        alert('Failed to fetch restaurants');
        console.error(err);
      }
    };

    fetchRestaurants();
  }, [token, user]);

  const handleVerify = async (id, adminApproved) => {
    try {
      await api.patch(`/restaurants/restaurant-verification/${id}`, { adminApproved }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRestaurants((prev) =>
        prev.map((res) =>
          res._id === id ? { ...res, adminApproved } : res
        )
      );
    } catch (err) {
      alert('Failed to update verification status');
      console.error(err);
    }
  };

  if (!token || user?.role !== 'admin') return <p className="text-red-600 text-center mt-6">Access denied.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">✅ Verify Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Owner ID</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((res) => (
                <tr key={res._id} className="border-t">
                  <td className="px-4 py-2">{res.name}</td>
                  <td className="px-4 py-2">{res.owner}</td>
                  <td className="px-4 py-2">{res.address}</td>
                  <td className="px-4 py-2">
                    {res.adminApproved ? (
                      <span className="text-green-600">Verified</span>
                    ) : (
                      <span className="text-red-500">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleVerify(res._id, !res.adminApproved)}
                      className={`px-3 py-1 rounded text-sm text-white ${
                        res.adminApproved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {res.adminApproved ? 'Unverify' : 'Verify'}
                    </button>
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

// export default function AdminVerifyRestaurants() {
//   const { token, user } = useAuth();
//   const [restaurants, setRestaurants] = useState([]);

//   useEffect(() => {
//     if (!token || user?.role !== 'admin') return;

//     const fetchRestaurants = async () => {
//       try {
//         const res = await api.get('/restaurants/get-restaurants', {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setRestaurants(res.data.restaurants);
//       } catch (err) {
//         alert('Failed to fetch restaurants');
//         console.error(err);
//       }
//     };

//     fetchRestaurants();
//   }, [token, user]);

//   const handleVerify = async (id, adminApproved) => {
//     try {
//       await api.patch(`/restaurants/restaurant-verification/${id}`, { adminApproved }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setRestaurants((prev) =>
//         prev.map((res) =>
//           res._id === id ? { ...res, adminApproved } : res
//         )
//       );
//     } catch (err) {
//       alert('Failed to update verification status');
//       console.error(err);
//     }
//   };

//   if (!token || user?.role !== 'admin') return <p>Access denied.</p>;

//   return (
//     <div>
//       <h2>Verify Restaurants</h2>

//       {restaurants.length === 0 ? (
//         <p>No restaurants found.</p>
//       ) : (
//         <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Owner ID</th>
//               <th>Address</th>
//               <th>Status</th>
//               <th>Verify</th>
//             </tr>
//           </thead>
//           <tbody>
//             {restaurants.map((res) => (
//               <tr key={res._id}>
//                 <td>{res.name}</td>
//                 <td>{res.owner}</td>
//                 <td>{res.address}</td>
//                 <td>{res.adminApproved ? '✅ Verified' : '❌ Unverified'}</td>
//                 <td>
//                   <button
//                     onClick={() => handleVerify(res._id, !res.adminApproved)}
//                   >
//                     {res.adminApproved ? 'Unverify' : 'Verify'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
