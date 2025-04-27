import { NavLink } from "react-router";
import { useAuth } from "../Providers/AuthProvider";
import { useNavigate } from "react-router";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // ✅ Clear cookie + reset user
      navigate("/signin"); // ✅ Redirect
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between lg:justify-center items-center border-b border-zinc-800 backdrop-blur bg-transparent">
      <nav className="w-full flex justify-center items-center gap-10 font-semibold text-black text-sm">
        {/* 🏠 Home (Always visible) */}
        <NavLink to="/" className="hover:underline">Home</NavLink>

        {/* 👨‍🍳 Restaurant Owner Links */}
        {user?.role === "restaurantOwner" && (
          <>
            <NavLink to="/restaurant-dashboard" className="hover:underline">My Restaurants</NavLink>
            <NavLink to="/add-restaurant" className="hover:underline">Add Restaurant</NavLink>
          </>
        )}

        {/* 🛡️ Admin Links */}
        {user?.role === "admin" && (
          <>
            <NavLink to="/admin/users" className="hover:underline">Manage Users</NavLink>
            <NavLink to="/admin/restaurants" className="hover:underline">Manage Restaurants</NavLink>
          </>
        )}

        {/* 👤 Regular User Links */}
        {user?.role === "regular" && (
          <>
            <NavLink to="/restaurants" className="hover:underline">Restaurants</NavLink>
            <NavLink to="/menuitems" className="hover:underline">Food</NavLink>
            <NavLink to="/contact" className="hover:underline">Contact</NavLink>
          </>
        )}

        {/* 🔐 Auth Links */}
        {!user ? (
          <>
            <NavLink to="/signin" className="hover:underline">Sign In</NavLink>
            <NavLink to="/signup" className="hover:underline">Sign Up</NavLink>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-white"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}














// import { Navigate, NavLink } from "react-router";
// import { useAuth } from "../Providers/AuthProvider";
// import { useNavigate } from "react-router";


// export default function NavBar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   }

//   return (
//     <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between lg:justify-center items-center border-b border-zinc-800 backdrop-blur bg-transparent">
//       <ul className="w-full flex justify-center items-center gap-10 font-semibold text-white text-sm">
//         {/* Home - Always visible */}
//         <li>
//           <NavLink to="/">Home</NavLink>
//         </li>

//         {/* Restaurant Owner Links */}
//         {user?.role === "restaurantOwner" && (
//           <>
//             <li>
//               <NavLink to="/restaurant-dashboard">My Restaurants</NavLink>
//             </li>
//             <li>
//               <NavLink to="/add-restaurant">Add Restaurant</NavLink>
//             </li>
//           </>
//         )}

//         {/* Admin Links */}
//         {/* {user?.role === "admin" && (
//           <li>
//             <NavLink to="/admin-dashboard">Admin Panel</NavLink>
//           </li>
//         )} */}
//         {user?.role === "admin" && (
//           <>
//             <li>
//               <NavLink to="/admin/users">Manage Users</NavLink>
//             </li>
//             <li>
//               <NavLink to="/admin/restaurants">Manage Restaurants</NavLink>
//             </li>
//           </>
//         )}

//         {/* Regular User Links */}
//         {user?.role === "regular" && (
//           <>
//             <li>
//               <NavLink to="/restaurants">Restaurants</NavLink>
//             </li>
//             <li>
//               <NavLink to="/menuitems">Food</NavLink>
//             </li>
//             <li>
//               <NavLink to="/contact">Contact</NavLink>
//             </li>
//           </>
//         )}

//         {/* Authentication Links */}
//         {!user ? (
//           <>
//             <li>
//               <NavLink to="/signin">Sign In</NavLink>
//             </li>
//             <li>
//               <NavLink to="/signup">Sign Up</NavLink>
//             </li>
//           </>
//         ) : (
//           <li>
//             <button
//               onClick={handleLogout}
//               className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
//             >
//               Logout
//             </button>
//           </li>
//         )}
//       </ul>
//     </header>
//   );
// }

// import { NavLink } from "react-router";
// import { useAuth } from "../Providers/AuthProvider";

// export default function NavBar() {
//   const { user, logout } = useAuth();

//   return (
//     <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between lg:justify-center items-center border-b border-zinc-800 backdrop-blur bg-transparent">
//       <ul className="w-full flex justify-center items-center gap-10 font-semibold text-white text-sm">
//         <li>
//           <NavLink to="/">Home</NavLink>
//         </li>

//         {user?.role === "restaurantOwner" && (
//           <>
//             <li>
//               <NavLink to="/restaurant-dashboard">My Restaurants</NavLink>
//             </li>
//             <li>
//               <NavLink to="/add-restaurant">Add Restaurant</NavLink>
//             </li>
//           </>
//         )}

//         {user?.role === "admin" && (
//           <>
//             <li>
//               <NavLink to="/admin-dashboard">Admin Panel</NavLink>
//             </li>
//           </>
//         )}

//         {user?.role === "regular" && (
//           <>
//             <li>
//               <NavLink to="/restaurants">Restaurants</NavLink>
//             </li>
//           </>
//         )}

//         {!user ? (
//           <>
//             <li>
//               <NavLink to="/signin">Sign In</NavLink>
//             </li>
//             <li>
//               <NavLink to="/signup">Sign Up</NavLink>
//             </li>
//           </>
//         ) : (
//           <li>
//             <button
//               onClick={logout}
//               className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
//             >
//               Logout
//             </button>
//           </li>
//         )}
//       </ul>
//     </header>
//   );
// }

// import { NavLink } from "react-router";

// export default function NavBar(){
//     return(
//         <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between lg:justify-center items-center border-b border-zinc-800 backdrop-blur bg-transparent">
//             <ul className="w-full flex justify-center items-center gap-10 font-semibold text-white text-sm">
//                 <li><NavLink>Home</NavLink></li>
//                 <li><NavLink>Restaurants</NavLink></li>
//                 <li><NavLink>Food</NavLink></li>
//                 <li><NavLink>Contact</NavLink></li>

//             </ul>
//         </header>
//     )
// }
