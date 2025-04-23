import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axios';

export default function AddMenuItem() {
  const { token } = useAuth();
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: ''
  });

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (photo) data.append('photo', photo);

    try {
      await api.post(`/MenuItems/create-menuItem/${restaurantId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Menu item created!');
      navigate('/restaurants');
    } catch (err) {
      alert('Error creating menu item');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">➕ Add Menu Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Item Name"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="preparationTime"
          placeholder="Prep Time (min)"
          type="number"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}










// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../auth/AuthContext';
// import api from '../api/axios';

// export default function AddMenuItem() {
//   const { token } = useAuth();
//   const { id: restaurantId } = useParams(); // from URL
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     preparationTime: ''
//   });

//   const [photo, setPhoto] = useState(null); // 👈 New photo state

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleFileChange = (e) => {
//     setPhoto(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();

//     // Append form fields
//     for (const key in formData) {
//       data.append(key, formData[key]);
//     }

//     if (photo) {
//       data.append('photo', photo);
//     }

//     try {
//       await api.post(`/MenuItems/create-menuItem/${restaurantId}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       alert('Menu item created!');
//       navigate('/restaurants');
//     } catch (err) {
//       alert('Error creating menu item');
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Menu Item</h2>

//       <form onSubmit={handleSubmit}>
//         <input name="name" placeholder="Item Name" onChange={handleChange} required /><br />
//         <input name="description" placeholder="Description" onChange={handleChange} required /><br />
//         <input name="price" placeholder="Price" type="number" onChange={handleChange} required /><br />
//         <input name="category" placeholder="Category" onChange={handleChange} required /><br />
//         <input name="preparationTime" placeholder="Prep Time (min)" type="number" onChange={handleChange} /><br />
//         <input type="file" accept="image/*" onChange={handleFileChange} /><br /><br />

//         <button type="submit">Add Item</button>
//       </form>
//     </div>
//   );
// }
