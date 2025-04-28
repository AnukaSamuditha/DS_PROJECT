import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosConfig";
import { useAuth } from "../Providers/AuthProvider"; // Import auth
import { toast } from "react-toastify"; // Import toast

export default function AddMenuItemPage() {
  const { id } = useParams(); // restaurantId
  const { user } = useAuth(); // get user
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    imageUrl: "",
    imageFile: null,
  });

  // Block non-restaurant owners
  useEffect(() => {
    const userRole = user?.role || user?.user?.role;
    if (!user || userRole !== "restaurantOwner") {
      navigate("/signin");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("category", form.category);
      formData.append("preparationTime", Number(form.preparationTime));

      if (form.imageFile) {
        formData.append("photo", form.imageFile);
      } else if (form.imageUrl) {
        formData.append("imageUrl", form.imageUrl);
      }

      await axiosInstance.post(`/MenuItems/create-menuItem/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Menu item added successfully!", {
        position: "top-right",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: true, // Hide progress bar
      });

      navigate(`/restaurant/${id}/menu-items`);
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Failed to add menu item.", {
        position: "top-right",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: true, // Hide progress bar
      });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Add New Menu Item
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
            rows={3}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
            required
          />
          <input
            name="category"
            placeholder="Category (e.g., Pizza, Salad)"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
            required
          />
          <input
            name="preparationTime"
            type="number"
            placeholder="Prep Time (minutes)"
            value={form.preparationTime}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
          />
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
          />

          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg font-semibold transition mt-2"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}











// //updated-working
// import { useState, useEffect } from "react"; // 🔥 added useEffect
// import { useParams, useNavigate } from "react-router-dom"; // 🔥 fixed import
// import axiosInstance from "@/axiosConfig";
// import { useAuth } from "../Providers/AuthProvider"; // 🔥 import auth

// export default function AddMenuItemPage() {
//   const { id } = useParams(); // restaurantId
//   const { user } = useAuth(); // 🔥 get user
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     preparationTime: "",
//     imageUrl: "",
//     imageFile: null,
//   });

//   // 🔥 added: block non-restaurant owners
//   useEffect(() => {
//     const userRole = user?.role || user?.user?.role;
//     if (!user || userRole !== "restaurantOwner") {
//       navigate("/signin");
//     }
//   }, [user, navigate]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "imageFile") {
//       setForm({ ...form, imageFile: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("price", Number(form.price));
//       formData.append("category", form.category);
//       formData.append("preparationTime", Number(form.preparationTime));

//       if (form.imageFile) {
//         formData.append("photo", form.imageFile);
//       } else if (form.imageUrl) {
//         formData.append("imageUrl", form.imageUrl);
//       }

//       await axiosInstance.post(`/MenuItems/create-menuItem/${id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Menu item added successfully!");
//       navigate(`/restaurant/${id}/menu-items`);
//     } catch (err) {
//       console.error("Error adding menu item:", err);
//       alert("Failed to add menu item.");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
//         <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add New Menu Item</h2>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col gap-4"
//           encType="multipart/form-data"
//         >
//           <input
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             required
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             rows={3}
//             required
//           />
//           <input
//             name="price"
//             type="number"
//             placeholder="Price"
//             value={form.price}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             required
//           />
//           <input
//             name="category"
//             placeholder="Category (e.g., Pizza, Salad)"
//             value={form.category}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             required
//           />
//           <input
//             name="preparationTime"
//             type="number"
//             placeholder="Prep Time (minutes)"
//             value={form.preparationTime}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//           />
//           <input
//             type="file"
//             name="imageFile"
//             accept="image/*"
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//           />

//           <button
//             type="submit"
//             className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg font-semibold transition mt-2"
//           >
//             Add Item
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }







// import { useState } from "react";
// import { useParams, useNavigate } from "react-router";
// import axiosInstance from "@/axiosConfig"; // ✅ use axios with credentials

// export default function AddMenuItemPage() {
//   const { id } = useParams(); // restaurantId
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     preparationTime: "",
//     imageUrl: "",
//     imageFile: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "imageFile") {
//       setForm({ ...form, imageFile: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("price", Number(form.price));
//       formData.append("category", form.category);
//       formData.append("preparationTime", Number(form.preparationTime));

//       if (form.imageFile) {
//         formData.append("photo", form.imageFile);
//       } else if (form.imageUrl) {
//         formData.append("imageUrl", form.imageUrl);
//       }

//       await axiosInstance.post(`/MenuItems/create-menuItem/${id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Menu item added successfully");
//       navigate(`/restaurant/${id}/menu-items`);
//     } catch (err) {
//       console.error("Error adding menu item:", err);
//       alert("Failed to add item");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
//         <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add New Menu Item</h2>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col gap-4"
//           encType="multipart/form-data"
//         >
//           <input
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             required
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             rows={3}
//             required
//           />
//           <input
//             name="price"
//             type="number"
//             placeholder="Price"
//             value={form.price}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             required
//           />
//           <input
//             name="category"
//             placeholder="Category (e.g., Pizza)"
//             value={form.category}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//             required
//           />
//           <input
//             name="preparationTime"
//             type="number"
//             placeholder="Prep Time (minutes)"
//             value={form.preparationTime}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//           />

//           <input
//             type="file"
//             name="imageFile"
//             accept="image/*"
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
//           />

//           <button
//             type="submit"
//             className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg font-semibold transition mt-2"
//           >
//             Add Item
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
















// import { useState } from "react";
// import { useParams, useNavigate } from "react-router";
// import axiosInstance from "@/axiosConfig"; // ✅ use axios with credentials

// export default function AddMenuItemPage() {
//   const { id } = useParams(); // restaurantId
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     preparationTime: "",
//     imageUrl: "",
//     imageFile: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "imageFile") {
//       setForm({ ...form, imageFile: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("price", Number(form.price));
//       formData.append("category", form.category);
//       formData.append("preparationTime", Number(form.preparationTime));

//       if (form.imageFile) {
//         formData.append("photo", form.imageFile);
//       } else if (form.imageUrl) {
//         formData.append("imageUrl", form.imageUrl);
//       }

//       await axiosInstance.post(`/MenuItems/create-menuItem/${id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Menu item added successfully");
//       navigate(`/restaurant/${id}/menu-items`);
//     } catch (err) {
//       console.error("Error adding menu item:", err);
//       alert("Failed to add item");
//     }
//   };

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-3 border p-4 rounded max-w-md"
//         encType="multipart/form-data"
//       >
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={form.price}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="category"
//           placeholder="Category (e.g., Pizza)"
//           value={form.category}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="preparationTime"
//           type="number"
//           placeholder="Prep Time (minutes)"
//           value={form.preparationTime}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//         />

//         <input
//           type="file"
//           name="imageFile"
//           accept="image/*"
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//         />

//         <button
//           type="submit"
//           className="bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
//         >
//           Add Item
//         </button>
//       </form>
//     </div>
//   );
// }















// import { useState } from "react";
// import { useParams, useNavigate } from "react-router";
// import axios from "axios";

// export default function AddMenuItemPage() {
//   const { id } = useParams(); // restaurantId
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     preparationTime: "",
//     imageUrl: "",
//     imageFile: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "imageFile") {
//       setForm({ ...form, imageFile: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);
//       formData.append("price", Number(form.price));
//       formData.append("category", form.category);
//       formData.append("preparationTime", Number(form.preparationTime));

//       if (form.imageFile) {
//         formData.append("photo", form.imageFile);
//       } else if (form.imageUrl) {
//         formData.append("imageUrl", form.imageUrl);
//       }

//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/MenuItems/create-menuItem/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       alert("Menu item added successfully");
//       navigate(`/restaurant/${id}/menu-items`);
//     } catch (err) {
//       console.error("Error adding menu item:", err);
//       alert("Failed to add item");
//     }
//   };

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-3 border p-4 rounded max-w-md"
//         encType="multipart/form-data"
//       >
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={form.price}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="category"
//           placeholder="Category (e.g., Pizza)"
//           value={form.category}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="preparationTime"
//           type="number"
//           placeholder="Prep Time (minutes)"
//           value={form.preparationTime}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//         />

//         {/* Image Input Option 1: Upload */}
//         <input
//           type="file"
//           name="imageFile"
//           accept="image/*"
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//         />

//         <button
//           type="submit"
//           className="bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
//         >
//           Add Item
//         </button>
//       </form>
//     </div>
//   );
// }















// import { useState } from "react";
// import { useParams, useNavigate } from "react-router";
// import axios from "axios";

// export default function AddMenuItemPage() {
//   const { id } = useParams(); // restaurantId
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     preparationTime: "",
//     imageUrl: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/MenuItems/create-menuItem/${id}`,
//         {
//           ...form,
//           price: Number(form.price),
//           preparationTime: Number(form.preparationTime),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Menu item added successfully");
//       navigate(`/restaurant/${id}/menu-items`);
//     } catch (err) {
//       console.error("Error adding menu item:", err);
//       alert("Failed to add item");
//     }
//   };

//   return (
//     <div className="p-4 text-white">
//       <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>

//       <form onSubmit={handleSubmit} className="flex flex-col gap-3 border p-4 rounded max-w-md">
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={form.price}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="category"
//           placeholder="Category (e.g., Pizza)"
//           value={form.category}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//           required
//         />
//         <input
//           name="preparationTime"
//           type="number"
//           placeholder="Prep Time (min)"
//           value={form.preparationTime}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//         />
//         <input
//           name="imageUrl"
//           placeholder="Image URL (optional)"
//           value={form.imageUrl}
//           onChange={handleChange}
//           className="p-2 bg-transparent border rounded text-white"
//         />
//         <button
//           type="submit"
//           className="bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
//         >
//           Add Item
//         </button>
//       </form>
//     </div>
//   );
// }
