import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AddRestaurant() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contactNumber: '',
    openingHours: '',
    latitude: '',
    longitude: ''
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

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (photo) {
        data.append('photo', photo);
      }

      await api.post('/restaurants/create-restaurant', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Restaurant created successfully!');
      //alert('Restaurant created!');
      navigate('/restaurants');
    } catch (err) {
      //alert(err.response?.data?.message || 'Failed to create restaurant');
      toast.error(err.response?.data?.message || 'Failed to create restaurant');
      console.error(err);
    }
  };

  if (user?.role !== 'restaurantOwner') {
    return <p className="text-red-500 text-center mt-10">Access denied. Only restaurant owners can add restaurants.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">➕ Add New Restaurant</h2>

      <div className="space-y-4">
        {[
          ['name', 'Name'],
          ['description', 'Description'],
          ['address', 'Address'],
          ['contactNumber', 'Contact Number'],
          ['openingHours', 'Opening Hours'],
          ['latitude', 'Latitude'],
          ['longitude', 'Longitude']
        ].map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            placeholder={placeholder}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        ))}

        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Restaurant
        </button>
      </div>
    </div>
  );
}






// import { useState } from 'react';
// import { useAuth } from '../auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';

// export default function AddRestaurant() {
//   const { token, user } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     address: '',
//     contactNumber: '',
//     openingHours: '',
//     latitude: '',
//     longitude: ''
//   });

//   const [photo, setPhoto] = useState(null); // 👈 file upload

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleFileChange = (e) => {
//     setPhoto(e.target.files[0]); // 👈 set selected file
//   };

//   const handleSubmit = async () => {
//     try {
//       const data = new FormData();

//       // Append all form fields
//       for (const key in formData) {
//         data.append(key, formData[key]);
//       }

//       if (photo) {
//         data.append('photo', photo);
//       }

//       const res = await api.post('/restaurants/create-restaurant', data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       alert('Restaurant created!');
//       navigate('/restaurants');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to create restaurant');
//       console.error(err);
//     }
//   };

//   if (user?.role !== 'restaurantOwner') {
//     return <p>Access denied. Only restaurant owners can add restaurants.</p>;
//   }

//   return (
//     <div>
//       <h2>Add New Restaurant</h2>

//       <input name="name" placeholder="Name" onChange={handleChange} /><br />
//       <input name="description" placeholder="Description" onChange={handleChange} /><br />
//       <input name="address" placeholder="Address" onChange={handleChange} /><br />
//       <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} /><br />
//       <input name="openingHours" placeholder="Opening Hours" onChange={handleChange} /><br />
//       <input name="latitude" placeholder="Latitude" onChange={handleChange} /><br />
//       <input name="longitude" placeholder="Longitude" onChange={handleChange} /><br />

//       <input type="file" accept="image/*" onChange={handleFileChange} /><br /><br />

//       <button onClick={handleSubmit}>Create Restaurant</button>
//     </div>
//   );
// }







// import { useState } from 'react';
// import { useAuth } from '../auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';

// export default function AddRestaurant() {
//   const { token, user } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     address: '',
//     contactNumber: '',
//     openingHours: '',
//     imageUrl: '',
//     latitude: '',
//     longitude: ''
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await api.post('/restaurants/create-restaurant', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       alert('Restaurant created!');
//       navigate('/restaurants');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to create restaurant');
//       console.error(err);
//     }
//   };

//   if (user?.role !== 'restaurantOwner') {
//     return <p>Access denied. Only restaurant owners can add restaurants.</p>;
//   }

//   return (
//     <div>
//       <h2>Add New Restaurant</h2>
//       <input name="name" placeholder="Name" onChange={handleChange} />
//       <input name="description" placeholder="Description" onChange={handleChange} />
//       <input name="address" placeholder="Address" onChange={handleChange} />
//       <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
//       <input name="openingHours" placeholder="Opening Hours" onChange={handleChange} />
//       <input name="imageUrl" placeholder="Image URL (optional)" onChange={handleChange} />
//       <input name="latitude" placeholder="Latitude" onChange={handleChange} />
//       <input name="longitude" placeholder="Longitude" onChange={handleChange} />
//       <br />
//       <button onClick={handleSubmit}>Create Restaurant</button>
//     </div>
//   );
// }
