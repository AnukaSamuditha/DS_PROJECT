// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/Providers/AuthProvider";

// export default function ProtectedRoute({ children, allowedRoles = [] }) {
//   const { user } = useAuth();

//   // If no user is logged in
//   if (!user) return <Navigate to="/signin" replace />;

//   // If role-based protection is required
//   if (allowedRoles.length && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }
