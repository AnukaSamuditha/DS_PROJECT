import { Navigate, NavLink } from "react-router";
import { useAuth } from "../Providers/AuthProvider";
import { useNavigate } from "react-router";


export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between lg:justify-center items-center border-b border-zinc-800 backdrop-blur bg-transparent">
      <ul className="w-full flex justify-center items-center gap-10 font-semibold text-white text-sm">
        {/* Home - Always visible */}
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        {/* Restaurant Owner Links */}
        {user?.role === "restaurantOwner" && (
          <>
            <li>
              <NavLink to="/restaurant-dashboard">My Restaurants</NavLink>
            </li>
            <li>
              <NavLink to="/add-restaurant">Add Restaurant</NavLink>
            </li>
          </>
        )}

        {/* Admin Links */}
        {/* {user?.role === "admin" && (
          <li>
            <NavLink to="/admin-dashboard">Admin Panel</NavLink>
          </li>
        )} */}
        {user?.role === "admin" && (
          <>
            <li>
              <NavLink to="/admin/users">Manage Users</NavLink>
            </li>
            <li>
              <NavLink to="/admin/restaurants">Manage Restaurants</NavLink>
            </li>
          </>
        )}

        {/* Regular User Links */}
        {user?.role === "regular" && (
          <>
            <li>
              <NavLink to="/restaurants">Restaurants</NavLink>
            </li>
            <li>
              <NavLink to="/menuitems">Food</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </>
        )}

        {/* Authentication Links */}
        {!user ? (
          <>
            <li>
              <NavLink to="/signin">Sign In</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Sign Up</NavLink>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </header>
  );
}

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
