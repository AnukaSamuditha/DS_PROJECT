import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

export default function EditRestaurant() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contactNumber: '',
    openingHours: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (!token || !user) return;

    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/restaurants/get-restaurant/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { name, description, address, contactNumber, openingHours, imageUrl } = res.data.restaurant;
        setFormData({ name, description, address, contactNumber, openingHours, imageUrl: imageUrl || '' });
      } catch (err) {
        alert('Failed to fetch restaurant');
        console.error(err);
      }
    };

    fetchRestaurant();
  }, [id, token, user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/restaurants/update-restaurant/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Restaurant updated!');
      navigate('/restaurants');
    } catch (err) {
      alert('Failed to update restaurant');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">✏️ Edit Restaurant</h2>

      <div className="space-y-4">
        {[
          ['name', 'Name'],
          ['description', 'Description'],
          ['address', 'Address'],
          ['contactNumber', 'Contact Number'],
          ['openingHours', 'Opening Hours'],
          ['imageUrl', 'Image URL']
        ].map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        ))}

        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </div>
    </div>
  );
}






// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { useAuth } from '../auth/AuthContext';

// export default function EditRestaurant() {
//   const { id } = useParams();
//   const { token, user } = useAuth();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     address: '',
//     contactNumber: '',
//     openingHours: '',
//     imageUrl: ''
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token || !user) return;

//     const fetchRestaurant = async () => {
//       try {
//         const res = await api.get(`/restaurants/get-restaurant/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const { name, description, address, contactNumber, openingHours, imageUrl } = res.data.restaurant;
//         setFormData({ name, description, address, contactNumber, openingHours, imageUrl: imageUrl || '' });
//       } catch (err) {
//         alert('Failed to fetch restaurant');
//         console.error(err);
//       }
//     };

//     fetchRestaurant();
//   }, [id, token, user]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       await api.patch(`/restaurants/update-restaurant/${id}`, formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       alert('Restaurant updated!');
//       navigate('/restaurants');
//     } catch (err) {
//       alert('Failed to update restaurant');
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Edit Restaurant</h2>
//       <input name="name" value={formData.name} placeholder="Name" onChange={handleChange} />
//       <input name="description" value={formData.description} placeholder="Description" onChange={handleChange} />
//       <input name="address" value={formData.address} placeholder="Address" onChange={handleChange} />
//       <input name="contactNumber" value={formData.contactNumber} placeholder="Contact Number" onChange={handleChange} />
//       <input name="openingHours" value={formData.openingHours} placeholder="Opening Hours" onChange={handleChange} />
//       <input name="imageUrl" value={formData.imageUrl} placeholder="Image URL" onChange={handleChange} />
//       <br />
//       <button onClick={handleUpdate}>Update</button>
//     </div>
//   );
// }
