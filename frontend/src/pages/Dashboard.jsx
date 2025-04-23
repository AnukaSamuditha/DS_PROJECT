import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!token || !user) return navigate('/');

    if (user.role !== 'regular') return;

    const fetchRestaurantsAndMenus = async () => {
      try {
        const res = await api.get('/restaurants/get-restaurants', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const approvedRestaurants = res.data.restaurants.filter(r => r.adminApproved);
        setRestaurants(approvedRestaurants);

        const allMenuItems = [];

        for (const restaurant of approvedRestaurants) {
          try {
            const menuRes = await api.get(`/MenuItems/restaurant-menuItems/${restaurant._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            allMenuItems.push(...menuRes.data.menuItems);
          } catch (err) {
            // Ignore 404
          }
        }

        setMenuItems(allMenuItems);
      } catch (err) {
        console.error(err);
        alert('Failed to load dashboard data');
      }
    };

    fetchRestaurantsAndMenus();
  }, [token, user]);

  if (!token || !user) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.username} 👋</h2>
        {/* <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Logout
        </button> */}
      </div>

      <p className="text-gray-500 mt-1">Role: {user.role}</p>

      {/* Regular User Content */}
      {user.role === 'regular' && (
        <>
          <h3 className="text-xl font-semibold mt-10">🍽 Verified Restaurants</h3>
          {restaurants.length === 0 ? (
            <p className="text-gray-500">No verified restaurants available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {restaurants.map((r) => (
                <div
                  key={r._id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
                >
                  {r.photo && (
                    <img
                      src={`http://localhost:8080/uploads/${r.photo}`}
                      alt={r.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="text-lg font-bold">{r.name}</h4>
                  <p className="text-sm text-gray-600">{r.category}</p>
                  <p className="text-sm mt-2 text-gray-700">{r.description}</p>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-xl font-semibold mt-10">🍔 Menu Items from Verified Restaurants</h3>
          {menuItems.length === 0 ? (
            <p className="text-gray-500">No menu items available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
                >
                  {item.photo && (
                    <img
                      src={`http://localhost:8080/uploads/${item.photo}`}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    ${item.price} – {item.category}
                  </p>
                  <p className="text-sm mt-2 text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Restaurant Owner View */}
      {user.role === 'restaurantOwner' && (
        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold">➕ Add Your Restaurant</h3>
          <p className="text-gray-600 mt-2">Start managing your restaurant by adding it to the system.</p>
          <button
            onClick={() => navigate('/restaurants/add')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Restaurant
          </button>
        </div>
      )}
    </div>
  );
}








// import { useEffect, useState } from 'react';
// import { useAuth } from '../auth/AuthContext';
// import api from '../api/axios';
// import { useNavigate } from 'react-router-dom';

// export default function Dashboard() {
//   const { token, user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [restaurants, setRestaurants] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     if (!token || !user) return navigate('/');

//     if (user.role !== 'regular') return;

//     const fetchRestaurantsAndMenus = async () => {
//       try {
//         const res = await api.get('/restaurants/get-restaurants', {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const approvedRestaurants = res.data.restaurants.filter(r => r.adminApproved);
//         setRestaurants(approvedRestaurants);

//         const allMenuItems = [];

//         for (const restaurant of approvedRestaurants) {
//           try {
//             const menuRes = await api.get(`/MenuItems/restaurant-menuItems/${restaurant._id}`, {
//               headers: { Authorization: `Bearer ${token}` }
//             });
//             allMenuItems.push(...menuRes.data.menuItems);
//           } catch (err) {
//             // Skip if no menu items
//           }
//         }

//         setMenuItems(allMenuItems);
//       } catch (err) {
//         console.error(err);
//         alert('Failed to load dashboard data');
//       }
//     };

//     fetchRestaurantsAndMenus();
//   }, [token, user]);

//   if (!token || !user) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>Welcome, {user.username} 👋</h2>
//       <p>Role: {user.role}</p>

//       <hr />

//       {user.role === 'regular' && (
//         <>
//           <h3>🍽 Verified Restaurants</h3>
//           {restaurants.length === 0 ? (
//             <p>No verified restaurants available.</p>
//           ) : (
//             <ul>
//               {restaurants.map((r) => (
//                 <li key={r._id} style={{ marginBottom: '20px' }}>
//                   {/* 🖼 Restaurant Image */}
//                   {r.photo && (
//                     <img
//                       src={`http://localhost:8080/uploads/${r.photo}`}
//                       alt={r.name}
//                       width="200"
//                       style={{ borderRadius: '10px', marginBottom: '10px' }}
//                     />
//                   )}
//                   <br />
//                   <strong>{r.name}</strong> – {r.category}
//                   <br />
//                   <span>{r.description}</span>
//                 </li>
//               ))}
//             </ul>
//           )}

//           <hr />

//           <h3>🍔 Menu Items from Verified Restaurants</h3>
//           {menuItems.length === 0 ? (
//             <p>No menu items available yet.</p>
//           ) : (
//             <ul>
//               {menuItems.map((item) => (
//                 <li key={item._id} style={{ marginBottom: '20px' }}>
//                   {/* 🖼 Menu Item Image */}
//                   {item.photo && (
//                     <img
//                       src={`http://localhost:8080/uploads/${item.photo}`}
//                       alt={item.name}
//                       width="150"
//                       style={{ borderRadius: '8px', marginBottom: '8px' }}
//                     />
//                   )}
//                   <br />
//                   <strong>{item.name}</strong> – ${item.price}
//                   <br />
//                   <span>{item.description}</span> ({item.category})
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}

//       {user.role === 'restaurantOwner' && (
//         <>
//           <h3>➕ Add Your Restaurant</h3>
//           <p>Start managing your restaurant by adding it to the system.</p>
//           <button onClick={() => navigate('/restaurants/add')}>
//             Add Restaurant
//           </button>
//         </>
//       )}

//       <br />
//       <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
//     </div>
//   );
// }




