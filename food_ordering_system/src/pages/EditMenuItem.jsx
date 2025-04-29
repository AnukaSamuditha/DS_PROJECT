import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "@/axiosConfig"; // ✅ axios with credentials
import { toast } from "react-toastify";

export default function EditMenuItem() {
  const { id } = useParams(); // menuItem ID
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    imageUrl: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await axiosInstance.get(`/MenuItems/get-menuItem/${id}`);
        const data = res.data.menuItem;

        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          preparationTime: data.preparationTime || "",
          imageUrl: data.imageUrl || "",
          photo: null, // Leave photo null for now
        });
      } catch (err) {
        console.error("Error loading menu item", err);
        toast.error("Failed to load menu item.");
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("preparationTime", form.preparationTime);
      data.append("imageUrl", form.imageUrl);
      if (form.photo) data.append("photo", form.photo);

      await axiosInstance.patch(`/MenuItems/update-menuItem/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Menu Item Edited successfully!");
      navigate(-1); // back to previous page
    } catch (err) {
      console.error("Update error", err);
      toast.error("Menu Item update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Edit Menu Item</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the item"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Item price"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="preparationTime" className="text-sm font-medium text-gray-700">Preparation Time (min)</label>
          <input
            type="number"
            name="preparationTime"
            id="preparationTime"
            value={form.preparationTime}
            onChange={handleChange}
            placeholder="Preparation time"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">External Image URL (optional)</label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Paste external image URL"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="photo" className="text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="mt-2 p-3 bg-white border border-gray-300 text-gray-700 rounded-lg"
          />
        </div>

        {/* Image Preview */}
        {(form.imageUrl || form.photo) && (
          <div className="mt-4">
            <img
              src={form.photo ? URL.createObjectURL(form.photo) : form.imageUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Updating..." : "Update Item"}
        </button>
      </form>
    </div>
  );
}
















// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import axiosInstance from "@/axiosConfig"; // ✅ axios with credentials
// import { toast } from "react-toastify";
// export default function EditMenuItem() {
//   const { id } = useParams(); // menuItem ID
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     preparationTime: "",
//     imageUrl: "",
//     photo: null,
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchMenuItem = async () => {
//       try {
//         const res = await axiosInstance.get(`/MenuItems/get-menuItem/${id}`);
//         const data = res.data.menuItem;

//         setForm({
//           name: data.name || "",
//           description: data.description || "",
//           price: data.price || "",
//           category: data.category || "",
//           preparationTime: data.preparationTime || "",
//           imageUrl: data.imageUrl || "",
//           photo: null, // Leave photo null for now
//         });
//       } catch (err) {
//         console.error("Error loading menu item", err);
//         toast.error("Failed to load menu item.");
//       }
//     };

//     fetchMenuItem();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "photo") {
//       setForm({ ...form, photo: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = new FormData();
//       data.append("name", form.name);
//       data.append("description", form.description);
//       data.append("price", form.price);
//       data.append("category", form.category);
//       data.append("preparationTime", form.preparationTime);
//       data.append("imageUrl", form.imageUrl);
//       if (form.photo) data.append("photo", form.photo);

//       await axiosInstance.patch(`/MenuItems/update-menuItem/${id}`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Menu Item Edited successfully!")
//       navigate(-1); // back to previous page
//     } catch (err) {
//       console.error("Update error", err);
//       toast.error("Menu Item update Failed")
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto text-white">
//       <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Name"
//           className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
//           required
//         />

//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
//           required
//         />

//         <input
//           type="number"
//           name="price"
//           value={form.price}
//           onChange={handleChange}
//           placeholder="Price"
//           className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
//           required
//         />

//         <input
//           type="text"
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           placeholder="Category"
//           className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="number"
//           name="preparationTime"
//           value={form.preparationTime}
//           onChange={handleChange}
//           placeholder="Preparation Time (min)"
//           className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="text"
//           name="imageUrl"
//           value={form.imageUrl}
//           onChange={handleChange}
//           placeholder="External Image URL (optional)"
//           className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
//         />

//         <input
//           type="file"
//           name="photo"
//           accept="image/*"
//           onChange={handleChange}
//           className="w-full bg-zinc-800 border border-zinc-600 text-white rounded p-2"
//         />

//         {/* 📸 Preview image */}
//         {(form.imageUrl || form.photo) && (
//           <img
//             src={form.photo ? URL.createObjectURL(form.photo) : form.imageUrl}
//             alt="Preview"
//             className="w-full h-48 object-cover rounded border mt-2"
//           />
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
//         >
//           {loading ? "Updating..." : "Update Item"}
//         </button>
//       </form>
//     </div>
//   );
// }
