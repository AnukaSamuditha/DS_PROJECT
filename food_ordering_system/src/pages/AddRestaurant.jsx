//working
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";
import axiosInstance from "@/axiosConfig"; // ✅ Axios with cookies
import { toast } from "react-toastify";

export default function AddRestaurant() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    contactNumber: "",
    openingHours: "",
    image: null,
  });

  const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
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
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);
      if (form.image) formData.append("photo", form.image);

      await axiosInstance.post("/restaurants/create-restaurant", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Restaurant added successfully!");
      navigate("/restaurant-dashboard");
    } catch (error) {
      console.error("Error adding restaurant", error);
      const message = error.response?.data?.message || "Failed to add restaurant";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Add New Restaurant</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
            rows={3}
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
          />

          <input
            type="text"
            name="openingHours"
            placeholder="Opening Hours (e.g., 10 AM - 10 PM)"
            value={form.openingHours}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
          />

          {/* 🌍 Google Maps Picker */}
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
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
          />

          {location.lat && (
            <p className="text-sm text-gray-500">
              Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white w-full p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Submitting..." : "Add Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}











// //working
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import MapPicker from "../components/MapPicker";
// import axiosInstance from "@/axiosConfig"; // ✅ Axios with cookies

// export default function AddRestaurant() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     address: "",
//     contactNumber: "",
//     openingHours: "",
//     image: null,
//   });

//   const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setForm({ ...form, image: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
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
//       formData.append("latitude", location.lat);
//       formData.append("longitude", location.lng);
//       if (form.image) formData.append("photo", form.image);

//       await axiosInstance.post("/restaurants/create-restaurant", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Restaurant added successfully!");
//       navigate("/restaurant-dashboard");
//     } catch (error) {
//       console.error("Error adding restaurant", error);
//       const message = error.response?.data?.message || "Failed to add restaurant";
//       alert(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
//         <h2 className="text-3xl font-bold text-gray-900 text-center">Add New Restaurant</h2>

//         <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//           <input
//             type="text"
//             name="name"
//             placeholder="Restaurant Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//             rows={3}
//           />

//           <input
//             type="text"
//             name="contactNumber"
//             placeholder="Contact Number"
//             value={form.contactNumber}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//           />

//           <input
//             type="text"
//             name="openingHours"
//             placeholder="Opening Hours (e.g., 10 AM - 10 PM)"
//             value={form.openingHours}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//           />

//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//           />

//           {/* 🌍 Google Maps Picker */}
//           <MapPicker
//             onLocationSelect={({ lat, lng, address }) => {
//               setLocation({ lat, lng, address });
//             }}
//           />

//           <input
//             type="text"
//             name="address"
//             placeholder="Address (optional)"
//             value={form.address}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-black text-gray-800"
//           />

//           {location.lat && (
//             <p className="text-sm text-gray-500">
//               Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-black hover:bg-gray-800 text-white w-full p-3 rounded-lg font-semibold transition"
//           >
//             {loading ? "Submitting..." : "Add Restaurant"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }








//og
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import MapPicker from "../components/MapPicker";
// import axiosInstance from "@/axiosConfig"; // ✅ Axios with cookies

// export default function AddRestaurant() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     address: "",
//     contactNumber: "",
//     openingHours: "",
//     image: null,
//   });

//   const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setForm({ ...form, image: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
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
//       formData.append("latitude", location.lat);
//       formData.append("longitude", location.lng);
//       if (form.image) formData.append("photo", form.image);

//       await axiosInstance.post("/restaurants/create-restaurant", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Restaurant added successfully!");
//       navigate("/restaurant-dashboard");
//     } catch (error) {
//       console.error("Error adding restaurant", error);
//       const message = error.response?.data?.message || "Failed to add restaurant";
//       alert(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto text-white p-4">
//       <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Restaurant Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <input
//           type="text"
//           name="contactNumber"
//           placeholder="Contact Number"
//           value={form.contactNumber}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <input
//           type="text"
//           name="openingHours"
//           placeholder="Opening Hours (e.g., 10 AM - 10 PM)"
//           value={form.openingHours}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full bg-zinc-800 border border-zinc-600 text-white rounded p-2"
//         />

//         {/* 🌍 Google Maps Picker */}
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
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         {location.lat && (
//           <p className="text-sm text-zinc-400">
//             Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
//           </p>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
//         >
//           {loading ? "Submitting..." : "Add Restaurant"}
//         </button>
//       </form>
//     </div>
//   );
// }







// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import MapPicker from "../components/MapPicker";

// export default function AddRestaurant() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     address: "",
//     contactNumber: "",
//     openingHours: "",
//     image: null,
//   });

//   const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setForm({ ...form, image: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
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
//       formData.append("latitude", location.lat);
//       formData.append("longitude", location.lng);
//       if (form.image) formData.append("photo", form.image);

//       await axios.post(`${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/create-restaurant`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Restaurant added successfully!");
//       navigate("/restaurant-dashboard");
//     } catch (error) {
//       console.error("Error adding restaurant", error);
//       const message = error.response?.data?.message || "Failed to add restaurant";
//       alert(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto text-white p-4">
//       <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Restaurant Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <input
//           type="text"
//           name="contactNumber"
//           placeholder="Contact Number"
//           value={form.contactNumber}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <input
//           type="text"
//           name="openingHours"
//           placeholder="Opening Hours (e.g., 10 AM - 10 PM)"
//           value={form.openingHours}
//           onChange={handleChange}
//           required
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full bg-zinc-800 border border-zinc-600 text-white rounded p-2"
//         />

//         {/* 🌍 Google Maps Picker */}
//         <MapPicker
//           onLocationSelect={({ lat, lng, address }) => {
//             setLocation({ lat, lng, address });
//           }}
//         />

//         {/* Optional manual fallback */}
//         <input
//           type="text"
//           name="address"
//           placeholder="Address (optional)"
//           value={form.address}
//           onChange={handleChange}
//           className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
//         />

//         {location.lat && (
//           <p className="text-sm text-zinc-400">
//             Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
//           </p>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
//         >
//           {loading ? "Submitting..." : "Add Restaurant"}
//         </button>
//       </form>
//     </div>
//   );
// }












// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router";
// import { useState } from "react";

// export default function AddRestaurant() {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();
//   const { user } = useAuth();
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const formData = new FormData();

//       // Append text fields
//       formData.append("name", data.name);
//       formData.append("description", data.description);
//       formData.append("address", data.address);
//       formData.append("contactNumber", data.contactNumber);
//       formData.append("openingHours", data.openingHours || "");
//       formData.append("latitude", 6.9271); // static for now
//       formData.append("longitude", 79.8612);

//       // Append file
//       if (data.photo && data.photo[0]) {
//         formData.append("photo", data.photo[0]);
//       }

//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/create-restaurant`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       alert("Restaurant added successfully!");
//       reset();
//       setPreview(null);
//       navigate("/restaurant-dashboard");
//     } catch (err) {
//       console.error("Error creating restaurant:", err);
//       alert("Failed to create restaurant");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
//         <input
//           type="text"
//           placeholder="Name"
//           {...register("name", { required: "Restaurant name is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.name && <small className="text-red-500">{errors.name.message}</small>}

//         <textarea
//           placeholder="Description"
//           {...register("description", { required: "Description is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.description && <small className="text-red-500">{errors.description.message}</small>}

//         <input
//           type="text"
//           placeholder="Address"
//           {...register("address", { required: "Address is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.address && <small className="text-red-500">{errors.address.message}</small>}

//         <input
//           type="text"
//           placeholder="Contact Number"
//           {...register("contactNumber", { required: "Contact number is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.contactNumber && <small className="text-red-500">{errors.contactNumber.message}</small>}

//         <input
//           type="text"
//           placeholder="Opening Hours (e.g. 9 AM - 10 PM)"
//           {...register("openingHours")}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />

//         <input
//           type="file"
//           accept="image/*"
//           {...register("photo")}
//           onChange={(e) => {
//             if (e.target.files[0]) {
//               setPreview(URL.createObjectURL(e.target.files[0]));
//             }
//           }}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />

//         {preview && (
//           <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className={`bg-green-500 p-2 rounded text-black font-semibold ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Creating..." : "Create Restaurant"}
//         </button>
//       </form>
//     </div>
//   );
// }









// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router";

// export default function AddRestaurant() {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();
//   const { user } = useAuth();
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     try {
//       const restaurantData = {
//         ...data,
//         latitude: 6.9271, // default lat for now
//         longitude: 79.8612, // default lng for now
//       };

//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/restaurants/create-restaurant`,
//         restaurantData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Restaurant added successfully!");
//       reset();
//       navigate("/restaurant-dashboard");
//     } catch (err) {
//       console.error("Error creating restaurant:", err);
//       alert("Failed to create restaurant");
//     }
//   };

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
//         <input
//           type="text"
//           placeholder="Name"
//           {...register("name", { required: "Restaurant name is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.name && <small className="text-red-500">{errors.name.message}</small>}

//         <textarea
//           placeholder="Description"
//           {...register("description", { required: "Description is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.description && <small className="text-red-500">{errors.description.message}</small>}

//         <input
//           type="text"
//           placeholder="Address"
//           {...register("address", { required: "Address is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.address && <small className="text-red-500">{errors.address.message}</small>}

//         <input
//           type="text"
//           placeholder="Contact Number"
//           {...register("contactNumber", { required: "Contact number is required" })}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />
//         {errors.contactNumber && <small className="text-red-500">{errors.contactNumber.message}</small>}

//         <input
//           type="text"
//           placeholder="Opening Hours (e.g. 9 AM - 10 PM)"
//           {...register("openingHours")}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />

//         <input
//           type="text"
//           placeholder="Image URL (optional)"
//           {...register("imageUrl")}
//           className="p-2 border border-zinc-700 rounded bg-transparent text-white"
//         />

//         <button type="submit" className="bg-green-500 p-2 rounded text-black font-semibold">
//           Create Restaurant
//         </button>
//       </form>
//     </div>
//   );
// }
