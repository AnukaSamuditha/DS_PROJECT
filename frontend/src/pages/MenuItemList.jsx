import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

export default function MenuItemList() {
  const { id: restaurantId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (!token || !restaurantId) return;

    const fetchMenuItems = async () => {
      try {
        const res = await api.get(`/MenuItems/restaurant-menuItems/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMenuItems(res.data.menuItems);
      } catch (err) {
        alert('Failed to fetch menu items');
        console.error(err);
      }
    };

    fetchMenuItems();
  }, [token, restaurantId]);

  const handleToggleAvailability = async (itemId) => {
    try {
      await api.patch(`/MenuItems/availability-menuItem/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
        )
      );
    } catch (err) {
      alert('Failed to toggle availability');
      console.error(err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/MenuItems/delete-menuItem/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      alert('Failed to delete item');
      console.error(err);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(menuItems.map(i => i.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">🍔 Menu Items</h2>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <input
          type="text"
          placeholder="Search menu item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-gray-600">No menu items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white shadow rounded-lg p-4">
              {item.photo && (
                <img
                  src={`http://localhost:8080/uploads/${item.photo}`}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-sm mt-1 text-gray-700">{item.description}</p>
              <p className="text-sm mt-1 font-semibold text-green-700">${item.price}</p>
              <p className="text-sm">
                Status:{' '}
                {item.isAvailable ? (
                  <span className="text-green-600">Available</span>
                ) : (
                  <span className="text-red-500">Unavailable</span>
                )}
              </p>

              {/* 👤 Owner Actions */}
              {user.role === 'restaurantOwner' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Toggle Availability
                  </button>
                  <button
                    onClick={() => navigate(`/menu-items/edit/${item._id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}










// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { useAuth } from '../auth/AuthContext';

// export default function MenuItemList() {
//   const { id: restaurantId } = useParams();
//   const { token, user } = useAuth();
//   const navigate = useNavigate();
//   const [menuItems, setMenuItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');

//   useEffect(() => {
//     if (!token || !restaurantId) return;

//     const fetchMenuItems = async () => {
//       try {
//         const res = await api.get(`/MenuItems/restaurant-menuItems/${restaurantId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         setMenuItems(res.data.menuItems);
//       } catch (err) {
//         alert('Failed to fetch menu items');
//         console.error(err);
//       }
//     };

//     fetchMenuItems();
//   }, [token, restaurantId]);

//   const handleToggleAvailability = async (itemId) => {
//     try {
//       await api.patch(`/MenuItems/availability-menuItem/${itemId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setMenuItems((prev) =>
//         prev.map((item) =>
//           item._id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
//         )
//       );
//     } catch (err) {
//       alert('Failed to toggle availability');
//       console.error(err);
//     }
//   };

//   const handleDelete = async (itemId) => {
//     try {
//       await api.delete(`/MenuItems/delete-menuItem/${itemId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
//     } catch (err) {
//       alert('Failed to delete item');
//       console.error(err);
//     }
//   };

//   // 🔍 Filtered list
//   const filteredItems = menuItems.filter((item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
//     return matchesSearch && matchesCategory;
//   });

//   // 🗂️ Unique categories
//   const categories = [...new Set(menuItems.map(i => i.category))];

//   return (
//     <div>
//       <h2>Menu Items</h2>

//       {/* 🔍 Search + Filter */}
//       <div style={{ marginBottom: '15px' }}>
//         <input
//           type="text"
//           placeholder="Search menu item"
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

//       {filteredItems.length === 0 ? (
//         <p>No menu items found.</p>
//       ) : (
//         <ul>
//           {filteredItems.map((item) => (
//             <li key={item._id}>
//               <h3>{item.name}</h3>
//               <p>{item.description}</p>
//               <p>Category: {item.category}</p>
//               <p>Price: ${item.price}</p>
//               <p>Status: {item.isAvailable ? 'Available' : 'Unavailable'}</p>

//               {user.role === 'restaurantOwner' && (
//                 <>
//                   <button onClick={() => handleToggleAvailability(item._id)}>
//                     Toggle Availability
//                   </button>
//                   <button onClick={() => handleDelete(item._id)}>Delete</button>
//                   <button onClick={() => navigate(`/menu-items/edit/${item._id}`)}>Edit</button>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }



