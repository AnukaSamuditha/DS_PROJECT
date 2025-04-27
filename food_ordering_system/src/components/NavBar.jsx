import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/Providers/AuthProvider";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="flex sticky top-0 z-[100] w-full h-[60px] justify-between items-center border-b border-zinc-800 backdrop-blur bg-black px-5">
      <ul className="flex gap-6 text-white font-semibold">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/place-order">Place Order</NavLink></li>
        <li><NavLink to="/my-orders">My Orders</NavLink></li>
      </ul>

      <div className="flex gap-4 text-white text-sm">
        {user ? (
          <>
            <span>Hi, {user.email}</span>
            <button onClick={handleLogout} className="underline">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/signin" className="underline">Sign In</NavLink>
            <NavLink to="/signup" className="underline">Sign Up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}





