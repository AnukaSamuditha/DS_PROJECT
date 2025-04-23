import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RestaurantList() {
  const { token, user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) return;

    const fetchRestaurants = async () => {
      try {
        const endpoint =
          user.role === 'restaurantOwner'
            ? '/restaurants/owned-restaurants'
            : '/restaurants/get-restaurants';

        const res = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        let filteredRestaurants = res.data.restaurants;

        if (user.role === 'regular') {
          filteredRestaurants = filteredRestaurants.filter(r => r.adminApproved);
        }

        setRestaurants(filteredRestaurants);
      } catch (err) {
        alert('Error fetching restaurants');
        console.error(err);
      }
    };

    fetchRestaurants();
  }, [token, user]);

  const filteredList = restaurants.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? res.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(restaurants.map(r => r.category))];

  if (!token || !user) return <p className="text-center text-gray-500">Loading user info...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">
        {user.role === 'restaurantOwner' ? 'My Restaurants' : 'All Restaurants'}
      </h2>

      {/* 🔍 Search + Category filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <input
          type="text"
          placeholder="Search restaurant..."
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/3"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredList.length === 0 ? (
        <p className="text-gray-600">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredList.map((res) => (
            <div key={res._id} className="bg-white shadow rounded-lg p-4">
              {res.photo && (
                <img
                  src={`http://localhost:8080/uploads/${res.photo}`}
                  alt={res.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <h3 className="text-lg font-bold">{res.name}</h3>
              <p className="text-sm text-gray-500">{res.category}</p>
              <p className="text-sm mt-1 text-gray-700">{res.description}</p>
              <p className="text-sm mt-1 text-gray-600">📍 {res.address}</p>
              <p className="text-sm">📞 {res.contactNumber}</p>
              <p className="text-sm">Status: {res.isAvailable ? '✅ Open' : '❌ Closed'}</p>

              {user.role === 'restaurantOwner' && (
                <p className="text-sm text-blue-600 mt-1">
                  Approval Status: {res.adminApproved ? '✅ Verified by Admin' : '❌ Not Verified Yet'}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/restaurants/${res._id}/menu-items`)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  View Menu
                </button>

                {user.role === 'restaurantOwner' && (
                  <>
                    <button
                      onClick={() => navigate(`/restaurants/edit/${res._id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    {res.adminApproved ? (
                      <button
                        onClick={() => navigate(`/restaurants/${res._id}/add-menu-item`)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Add Menu Item
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-3 py-1 rounded text-sm cursor-not-allowed"
                      >
                        Waiting for Approval
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}








// import { useEffect, useState } from 'react';
// import api from '../api/axios';
// import { useAuth } from '../auth/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function RestaurantList() {
//   const { token, user } = useAuth();
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token || !user) return;

//     const fetchRestaurants = async () => {
//       try {
//         const endpoint =
//           user.role === 'restaurantOwner'
//             ? '/restaurants/owned-restaurants'
//             : '/restaurants/get-restaurants';

//         const res = await api.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         let filteredRestaurants = res.data.restaurants;

//         // ✅ Only show verified restaurants to regular users
//         if (user.role === 'regular') {
//           filteredRestaurants = filteredRestaurants.filter(r => r.adminApproved);
//         }

//         setRestaurants(filteredRestaurants);
//       } catch (err) {
//         alert('Error fetching restaurants');
//         console.error(err);
//       }
//     };

//     fetchRestaurants();
//   }, [token, user]);

//   // 🔍 Search + filter
//   const filteredList = restaurants.filter((res) => {
//     const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter ? res.category === categoryFilter : true;
//     return matchesSearch && matchesCategory;
//   });

//   // 🗂️ Unique categories
//   const categories = [...new Set(restaurants.map(r => r.category))];

//   if (!token || !user) return <p>Loading user info...</p>;

//   return (
//     <div>
//       <h2>{user.role === 'restaurantOwner' ? 'My Restaurants' : 'All Restaurants'}</h2>

//       {/* 🔍 Search + Category filter */}
//       <div style={{ marginBottom: '15px' }}>
//         <input
//           type="text"
//           placeholder="Search restaurant"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         &nbsp;&nbsp;
//         <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
//           <option value="">All Categories</option>
//           {categories.map((cat, i) => (
//             <option key={i} value={cat}>{cat}</option>
//           ))}
//         </select>
//       </div>

//       {filteredList.length === 0 ? (
//         <p>No restaurants found.</p>
//       ) : (
//         <ul>
//           {filteredList.map((res) => (
//             <li key={res._id} style={{ marginBottom: '20px' }}>
//               <h3>{res.name}</h3>
//               <p>Category: {res.category}</p>
//               <p>{res.description}</p>
//               <p>Address: {res.address}</p>
//               <p>Contact: {res.contactNumber}</p>
//               <p>Status: {res.isAvailable ? 'Open' : 'Closed'}</p>

//               {/* ✅ Show approval status to restaurantOwner */}
//               {user.role === 'restaurantOwner' && (
//                 <p>Approval Status: {res.adminApproved ? '✅ Verified by Admin' : '❌ Not Verified Yet'}</p>
//               )}

//               <button onClick={() => navigate(`/restaurants/${res._id}/menu-items`)}>View Menu</button>

//               {/* 🔧 Owner-only actions */}
//               {user.role === 'restaurantOwner' && (
//                 <>
//                   <button onClick={() => navigate(`/restaurants/edit/${res._id}`)}>Edit</button>
//                   {res.adminApproved ? (
//                     <button onClick={() => navigate(`/restaurants/${res._id}/add-menu-item`)}>
//                       Add Menu Item
//                     </button>
//                   ) : (
//                     <button disabled style={{ color: 'gray' }}>Waiting for Approval</button>
//                   )}
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }




