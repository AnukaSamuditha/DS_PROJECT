import { useEffect, useState } from "react";
import axios from "axios";
import MenuSection from "../components/MenuSection";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);

  const backendURL = import.meta.env.VITE_BACKEND_PREFIX;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get(`${backendURL}/MenuItems/all-menuItems`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const availableItems = res.data.menuItems.filter((item) => item.isAvailable);
        setMenuItems(availableItems);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🍽️ Explore Menu Items</h2>

      <MenuSection
        menuItems={menuItems}
        backendURL={backendURL}
        role="regular"
      />
    </div>
  );
}
