import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { token, user } = useAuth();
  
    if (!token || !user) {
      return <Navigate to="/" />;
    }
  
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  
    return children;
  }