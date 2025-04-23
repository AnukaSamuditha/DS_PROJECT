import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

export default function EditMenuItem() {
  const { id: itemId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (!token || !itemId) return;

    const fetchMenuItem = async () => {
      try {
        const res = await api.get(`/MenuItems/all-menuItems`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const item = res.data.menuItems.find((m) => m._id === itemId);
        if (item) {
          setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            preparationTime: item.preparationTime,
            imageUrl: item.imageUrl || ''
          });
        } else {
          alert('Menu item not found');
        }
      } catch (err) {
        alert('Error fetching menu item');
        console.error(err);
      }
    };

    fetchMenuItem();
  }, [token, itemId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/MenuItems/update-menuItem/${itemId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Menu item updated!');
      navigate(-1);
    } catch (err) {
      alert('Failed to update menu item');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">✏️ Edit Menu Item</h2>

      <div className="space-y-4">
        <input
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="price"
          value={formData.price}
          placeholder="Price"
          type="number"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="category"
          value={formData.category}
          placeholder="Category"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="preparationTime"
          value={formData.preparationTime}
          placeholder="Prep Time (min)"
          type="number"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="imageUrl"
          value={formData.imageUrl}
          placeholder="Image URL"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Item
        </button>
      </div>
    </div>
  );
}









// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { useAuth } from '../auth/AuthContext';

// export default function EditMenuItem() {
//   const { id: itemId } = useParams(); // Menu Item ID from URL
//   const { token } = useAuth();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     preparationTime: '',
//     imageUrl: ''
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token || !itemId) return;

//     const fetchMenuItem = async () => {
//       try {
//         const res = await api.get(`/MenuItems/all-menuItems`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const item = res.data.menuItems.find((m) => m._id === itemId);
//         if (item) {
//           setFormData({
//             name: item.name,
//             description: item.description,
//             price: item.price,
//             category: item.category,
//             preparationTime: item.preparationTime,
//             imageUrl: item.imageUrl || ''
//           });
//         } else {
//           alert('Menu item not found');
//         }
//       } catch (err) {
//         alert('Error fetching menu item');
//         console.error(err);
//       }
//     };

//     fetchMenuItem();
//   }, [token, itemId]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       await api.patch(`/MenuItems/update-menuItem/${itemId}`, formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       alert('Menu item updated!');
//       navigate(-1); // go back
//     } catch (err) {
//       alert('Failed to update menu item');
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Edit Menu Item</h2>
//       <input name="name" value={formData.name} placeholder="Name" onChange={handleChange} />
//       <input name="description" value={formData.description} placeholder="Description" onChange={handleChange} />
//       <input name="price" value={formData.price} placeholder="Price" type="number" onChange={handleChange} />
//       <input name="category" value={formData.category} placeholder="Category" onChange={handleChange} />
//       <input name="preparationTime" value={formData.preparationTime} placeholder="Prep Time (min)" type="number" onChange={handleChange} />
//       <input name="imageUrl" value={formData.imageUrl} placeholder="Image URL" onChange={handleChange} />
//       <br />
//       <button onClick={handleUpdate}>Update Item</button>
//     </div>
//   );
// }
