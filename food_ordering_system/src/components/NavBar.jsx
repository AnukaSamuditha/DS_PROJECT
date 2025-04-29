import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Providers/AuthProvider";
import { BellRing } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { subscribeUser } from "@/Providers/subscribeUser.jsx";
import Swal from "sweetalert2";

export default function NavBar() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PREFIX}/users/self`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });

  const notifiy = () => {
    if (userId) {
      subscribeUser(userId);
    }
  };

  const handleNotifications = () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        console.log("Notifications are already enabled");
        notifiy();
      } else if (Notification.permission === "denied") {
        console.log("Notifications are blocked by the user");
      } else {
        console.log("Notifications have not been requested yet");
        Swal.fire({
          title: "Notification Permission",
          text: "Do you want to enable notifications",
          icon: "Question",
          showCancelButton: true,
          confirmButtonColor: "#000000",
          cancelButtonColor: "#ffffff",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          customClass: {
            cancelButton: "swal-cancel-button",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            notifiy();
          }
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userId");
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  let role = localStorage.getItem("role");
  console.log(role);

  const userRole = role;
  const isLoggedIn = userId != null;

  if (userId) {
    localStorage.setItem("userId", userId);
  }

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[60px]">
          <div
            className="text-xl font-bold text-black cursor-pointer"
            onClick={() => navigate("/")}
          ></div>
          <div className="text-black">Loading...</div>{" "}
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-black shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[60px]">
        <div
          className="text-xl font-bold text-black cursor-pointer"
          onClick={() => navigate("/")}
        ></div>

        <ul className="hidden md:flex items-center gap-8 font-medium text-white text-sm">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-green-400 font-semibold" : "text-white"
              }
            >
              Home
            </NavLink>
          </li>

          {userRole === "restaurantOwner" && (
            <>
              <li>
                <NavLink
                  to="/restaurant-dashboard"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  My Restaurants
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/add-restaurant"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Add Restaurant
                </NavLink>
              </li>
            </>
          )}

          {userRole === "admin" && (
            <>
              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Manage Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/restaurants"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Manage Restaurants
                </NavLink>
              </li>
            </>
          )}

          {userRole === "regular" && (
            <>
              <li>
                <NavLink
                  to="/restaurants"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Restaurants
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/menuitems"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Food
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Contact
                </NavLink>
              </li>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <li>
                <NavLink
                  to="/signin"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Sign In
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 font-semibold" : "text-white"
                  }
                >
                  Sign Up
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
        <div className="p-2">
          <BellRing
            className="text-white rotate-25 hover:text-gray-300"
            onClick={handleNotifications}
          />
        </div>
      </nav>
    </header>
  );
}
