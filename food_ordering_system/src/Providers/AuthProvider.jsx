import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["user_self"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_PREFIX}/users/self`,
          {
            withCredentials: true,
          }
        );
        return res.data;
      } catch (error) {
        return null;
      }
    },
  });

  useEffect(() => {
    if (!isLoading) {
      setUser(data || null);
      setIsInitialized(true);
    }
  }, [data, isLoading]);

  const login = async (userInfo, token) => {
    setUser(userInfo);
    localStorage.setItem("token", token);
    localStorage.setItem("user", userInfo);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

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
