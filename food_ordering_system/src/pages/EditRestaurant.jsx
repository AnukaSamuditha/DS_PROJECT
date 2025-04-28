import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosConfig"; // ✅ use cookie-based axios instance
import MapPicker from "../components/MapPicker";
import { toast } from "react-toastify";


export default function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    contactNumber: "",
    openingHours: "",
    isAvailable: true,
    image: null,
  });

  const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
  const [loading, setLoading] = useState(false);

  // Fetch existing restaurant
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axiosInstance.get(`/restaurants/get-restaurant/${id}`);
        const data = res.data.restaurant;

        setForm({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          contactNumber: data.contactNumber || "",
          openingHours: data.openingHours || "",
          isAvailable: data.isAvailable ?? true,
          image: null,
        });

        if (data.location?.coordinates?.length === 2) {
          setLocation({
            lat: data.location.coordinates[1],
            lng: data.location.coordinates[0],
            address: data.address,
          });
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        toast.error("Failed to load restaurant data");
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", location.address || form.address);
      formData.append("contactNumber", form.contactNumber);
      formData.append("openingHours", form.openingHours);
      formData.append("isAvailable", form.isAvailable);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);
      if (form.image) {
        formData.append("photo", form.image);
      }

      await axiosInstance.patch(`/restaurants/update-restaurant/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Restaurant updated successfully!");
      navigate("/restaurant-dashboard");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Edit Restaurant</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Restaurant Name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-black"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-black"
            rows={3}
          />

          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="openingHours"
            value={form.openingHours}
            onChange={handleChange}
            placeholder="Opening Hours"
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-black"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
          />

          <MapPicker
            onLocationSelect={({ lat, lng, address }) => {
              setLocation({ lat, lng, address });
            }}
          />

          <input
            type="text"
            name="address"
            placeholder="Address (optional)"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-black"
          />

          {/* Available Checkbox */}
          <label className="flex items-center gap-3 text-gray-700">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
            />
            <span>Available</span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white w-full p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Updating..." : "Update Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}








//og
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "@/axiosConfig"; // ✅ use cookie-based axios instance
// import MapPicker from "../components/MapPicker";

// export default function EditRestaurant() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     address: "",
//     contactNumber: "",
//     openingHours: "",
//     isAvailable: true,
//     image: null,
//   });

//   const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
//   const [loading, setLoading] = useState(false);

//   // Fetch existing restaurant
//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       try {
//         const res = await axiosInstance.get(`/restaurants/get-restaurant/${id}`);
//         const data = res.data.restaurant;

//         setForm({
//           name: data.name || "",
//           description: data.description || "",
//           address: data.address || "",
//           contactNumber: data.contactNumber || "",
//           openingHours: data.openingHours || "",
//           isAvailable: data.isAvailable ?? true,
//           image: null,
//         });

//         if (data.location?.coordinates?.length === 2) {
//           setLocation({
//             lat: data.location.coordinates[1],
//             lng: data.location.coordinates[0],
//             address: data.address,
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching restaurant:", err);
//         alert("Failed to load restaurant data.");
//       }
//     };

//     fetchRestaurant();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "file") {
//       setForm({ ...form, image: files[0] });
//     } else {
//       setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("address", location.address || form.address);
//       formData.append("contactNumber", form.contactNumber);
//       formData.append("openingHours", form.openingHours);
//       formData.append("isAvailable", form.isAvailable);
//       formData.append("latitude", location.lat);
//       formData.append("longitude", location.lng);
//       if (form.image) {
//         formData.append("photo", form.image);
//       }

//       await axiosInstance.patch(`/restaurants/update-restaurant/${id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Restaurant updated successfully!");
//       navigate("/restaurant-dashboard");
//     } catch (error) {
//       console.error("Update error:", error);
//       alert(error.response?.data?.message || "Failed to update restaurant.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto text-white p-4">
//       <h2 className="text-2xl font-bold mb-4">Edit Restaurant</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Restaurant Name"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="text"
//           name="contactNumber"
//           value={form.contactNumber}
//           onChange={handleChange}
//           placeholder="Contact Number"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="text"
//           name="openingHours"
//           value={form.openingHours}
//           onChange={handleChange}
//           placeholder="Opening Hours"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full bg-zinc-800 border border-zinc-600 text-white rounded p-2"
//         />

//         <MapPicker
//           onLocationSelect={({ lat, lng, address }) => {
//             setLocation({ lat, lng, address });
//           }}
//         />

//         <input
//           type="text"
//           name="address"
//           placeholder="Address (optional)"
//           value={form.address}
//           onChange={handleChange}
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="isAvailable"
//             checked={form.isAvailable}
//             onChange={handleChange}
//             className="form-checkbox"
//           />
//           <span>Available</span>
//         </label>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Updating..." : "Update Restaurant"}
//         </button>
//       </form>
//     </div>
//   );
// }












// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import MapPicker from "../components/MapPicker";

// export default function EditRestaurant() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     address: "",
//     contactNumber: "",
//     openingHours: "",
//     isAvailable: true,
//     image: null,
//   });

//   const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
//   const [loading, setLoading] = useState(false);

//   // Fetch existing restaurant
//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       try {
//         const res = await axios.get(`${backendURL}/restaurants/get-restaurant/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data.restaurant;
//         setForm({
//           name: data.name || "",
//           description: data.description || "",
//           address: data.address || "",
//           contactNumber: data.contactNumber || "",
//           openingHours: data.openingHours || "",
//           isAvailable: data.isAvailable ?? true,
//           image: null, // we won’t load existing image file here
//         });

//         if (data.location?.coordinates?.length === 2) {
//           setLocation({
//             lat: data.location.coordinates[1],
//             lng: data.location.coordinates[0],
//             address: data.address,
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching restaurant:", err);
//       }
//     };

//     fetchRestaurant();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "file") {
//       setForm({ ...form, image: files[0] });
//     } else {
//       setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("address", location.address || form.address);
//       formData.append("contactNumber", form.contactNumber);
//       formData.append("openingHours", form.openingHours);
//       formData.append("isAvailable", form.isAvailable);
//       formData.append("latitude", location.lat);
//       formData.append("longitude", location.lng);
//       if (form.image) {
//         formData.append("photo", form.image);
//       }

//       await axios.patch(`${backendURL}/restaurants/update-restaurant/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Restaurant updated successfully!");
//       navigate("/restaurant-dashboard");
//     } catch (error) {
//       console.error("Update error:", error);
//       alert(error.response?.data?.message || "Failed to update restaurant.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto text-white p-4">
//       <h2 className="text-2xl font-bold mb-4">Edit Restaurant</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Restaurant Name"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="text"
//           name="contactNumber"
//           value={form.contactNumber}
//           onChange={handleChange}
//           placeholder="Contact Number"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="text"
//           name="openingHours"
//           value={form.openingHours}
//           onChange={handleChange}
//           placeholder="Opening Hours"
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         {/* 📸 File Upload */}
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full bg-zinc-800 border border-zinc-600 text-white rounded p-2"
//         />

//         {/* 🗺️ Map Picker */}
//         <MapPicker
//           onLocationSelect={({ lat, lng, address }) => {
//             setLocation({ lat, lng, address });
//           }}
//         />

//         {/* ✏️ Fallback address */}
//         <input
//           type="text"
//           name="address"
//           placeholder="Address (optional)"
//           value={form.address}
//           onChange={handleChange}
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         {/* 🟢 Availability */}
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="isAvailable"
//             checked={form.isAvailable}
//             onChange={handleChange}
//             className="form-checkbox"
//           />
//           <span>Available</span>
//         </label>

//         {/* ✅ Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Updating..." : "Update Restaurant"}
//         </button>
//       </form>
//     </div>
//   );
// }















// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import MapPicker from "../components/MapPicker";

// export default function EditRestaurant() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     address: "",
//     contactNumber: "",
//     openingHours: "",
//     isAvailable: true,
//     image: null,
//   });

//   const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
//   const [loading, setLoading] = useState(false);
//   const [existingPhoto, setExistingPhoto] = useState("");

//   const fetchRestaurant = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/restaurants/get-restaurant/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const r = res.data.restaurant;
//       setForm({
//         name: r.name || "",
//         description: r.description || "",
//         address: r.address || "",
//         contactNumber: r.contactNumber || "",
//         openingHours: r.openingHours || "",
//         isAvailable: r.isAvailable ?? true,
//         image: null,
//       });

//       setExistingPhoto(r.photo);
//       setLocation({
//         lat: r.location?.coordinates?.[1],
//         lng: r.location?.coordinates?.[0],
//         address: r.address,
//       });
//     } catch (err) {
//       console.error("Error fetching restaurant:", err);
//       alert("Failed to load restaurant data.");
//     }
//   };

//   useEffect(() => {
//     fetchRestaurant();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files, type, checked } = e.target;
//     if (name === "image") {
//       setForm({ ...form, image: files[0] });
//     } else {
//       setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name.trim());
//       formData.append("description", form.description.trim());
//       formData.append("address", location.address || form.address);
//       formData.append("contactNumber", form.contactNumber.trim());
//       formData.append("openingHours", form.openingHours.trim());
//       formData.append("isAvailable", form.isAvailable);
//       formData.append("latitude", location.lat);
//       formData.append("longitude", location.lng);
//       if (form.image) formData.append("photo", form.image);

//       await axios.patch(`${backendURL}/restaurants/update-restaurant/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Restaurant updated successfully!");
//       navigate("/restaurant-dashboard");
//     } catch (err) {
//       console.error("Update error:", err);
//       alert(err.response?.data?.message || "Update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto text-white p-4">
//       <h2 className="text-2xl font-bold mb-4">Edit Restaurant</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Restaurant Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="text"
//           name="contactNumber"
//           placeholder="Contact Number"
//           value={form.contactNumber}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="text"
//           name="openingHours"
//           placeholder="Opening Hours (e.g., 10 AM - 10 PM)"
//           value={form.openingHours}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         {/* Image upload */}
//         {existingPhoto && (
//           <div>
//             <p className="text-sm text-zinc-400 mb-1">Current Photo:</p>
//             <img
//               src={`${backendURL}/uploads/${existingPhoto}`}
//               alt="Current restaurant"
//               className="w-full h-48 object-cover rounded mb-2"
//             />
//           </div>
//         )}
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full bg-zinc-800 border border-zinc-600 text-white rounded p-2"
//         />

//         {/* Location Picker */}
//         <MapPicker
//           onLocationSelect={({ lat, lng, address }) => {
//             setLocation({ lat, lng, address });
//           }}
//         />

//         <input
//           type="text"
//           name="address"
//           placeholder="Address (optional)"
//           value={form.address}
//           onChange={handleChange}
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         {location.lat && (
//           <p className="text-sm text-zinc-400">
//             Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
//           </p>
//         )}

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="isAvailable"
//             checked={form.isAvailable}
//             onChange={handleChange}
//           />
//           Available
//         </label>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Updating..." : "Update Restaurant"}
//         </button>
//       </form>
//     </div>
//   );
// }
