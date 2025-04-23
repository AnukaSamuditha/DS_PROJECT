import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex flex-wrap justify-between items-center">
      <div className="text-xl font-bold flex items-center gap-2">
        <span role="img" aria-label="food">🍔</span> FoodApp
      </div>

      {token && user ? (
        <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
          <span className="text-sm text-gray-300">Hello, {user.username}</span>

          <Link to="/dashboard" className="text-white hover:text-yellow-400 text-sm">Dashboard</Link>

          {user.role === 'restaurantOwner' && (
            <Link to="/restaurants" className="text-white hover:text-yellow-400 text-sm">
              My Restaurants
            </Link>
          )}

          {user.role === 'admin' && (
            <>
              <Link to="/restaurants" className="text-white hover:text-yellow-400 text-sm">
                All Restaurants
              </Link>
              <Link to="/admin/users" className="text-white hover:text-yellow-400 text-sm">
                Manage Users
              </Link>
              <Link to="/admin/verify-restaurants" className="text-white hover:text-yellow-400 text-sm">
                Verify Restaurants
              </Link>
            </>
          )}

          {user.role === 'regular' && (
            <Link to="/restaurants" className="text-white hover:text-yellow-400 text-sm">
              Browse Restaurants
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-yellow-400 text-sm">Login</Link>
          <Link to="/register" className="text-white hover:text-yellow-400 text-sm">Register</Link>
        </div>
      )}
    </nav>
  );
}







// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../auth/AuthContext';

// export default function Navbar() {
//   const { token, user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav>
//       <h2>🍔 FoodApp</h2>

//       {token && user ? (
//         <>
//           <span style={{ marginRight: '20px' }}>Hello, {user.username}</span>

//           <Link to="/dashboard" style={navLink}>Dashboard</Link>

//           {user.role === 'restaurantOwner' && (
//             <>
//               <Link to="/restaurants" style={navLink}>My Restaurants</Link>
//             </>
//           )}

//           {user.role === 'admin' && (
//             <>
//               <Link to="/restaurants" style={navLink}>All Restaurants</Link>
//               <Link to="/admin/users" style={navLink}>Manage Users</Link>
//               <Link to="/admin/verify-restaurants" style={navLink}>Verify Restaurants</Link>
//               <Link to="/admin/verify-restaurants" style={navLink}>Verify Restaurants</Link>
//             </>
//           )}

//           {user.role === 'regular' && (
//             <Link to="/restaurants" style={navLink}>Browse Restaurants</Link>
//           )}

//           <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
//         </>
//       ) : (
//         <>
//           <Link to="/" style={navLink}>Login</Link>
//           <Link to="/register" style={navLink}>Register</Link>
//         </>
//       )}
//     </nav>
//   );
// }

// const navLink = {
//   marginRight: '15px',
//   color: '#fff',
//   textDecoration: 'none'
// };
