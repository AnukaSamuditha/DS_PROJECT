import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

export default function EditMenuItem() {
  const { id } = useParams(); // menuItem ID
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_BACKEND_PREFIX;

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
        const res = await axios.get(`${backendURL}/MenuItems/get-menuItem/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
        alert("Failed to load menu item.");
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

      await axios.patch(`${backendURL}/MenuItems/update-menuItem/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Menu item updated!");
      navigate(-1); // or navigate(`/restaurant/${restaurantId}/menu-items`);
    } catch (err) {
      console.error("Update error", err);
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          required
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          required
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
        />

        <input
          type="number"
          name="preparationTime"
          value={form.preparationTime}
          onChange={handleChange}
          placeholder="Preparation Time (min)"
          className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
        />

        <input
          type="text"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="External Image URL (optional)"
          className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
        />

        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full bg-zinc-800 border border-zinc-600 text-white rounded p-2"
        />

        {/* 📸 Preview image */}
        {(form.imageUrl || form.photo) && (
          <img
            src={form.photo ? URL.createObjectURL(form.photo) : form.imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded border mt-2"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Updating..." : "Update Item"}
        </button>
      </form>
    </div>
  );
}
