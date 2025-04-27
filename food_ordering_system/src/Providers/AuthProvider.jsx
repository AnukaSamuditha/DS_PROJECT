import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Login function using cookies (no need to pass token)
  const login = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`,
        { withCredentials: true }
      );
      setUser(res.data.user);
    } catch (error) {
      console.error("Failed to fetch user after login", error);
      logout();
    }
  };

  // ✅ Logout: clear frontend user state (backend handles token deletion if needed)
  const logout = () => {
    setUser(null);
  };

  // ✅ Load user on app start using cookies
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        logout();
        setIsInitialized(true);
      });
  }, []);

  // ✅ Show loading indicator until we know if the user is logged in
  if (!isInitialized) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);










