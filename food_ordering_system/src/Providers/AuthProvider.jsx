import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["user_self"],
        queryFn: async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/get-user`, {
                    withCredentials: true
                });
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

    const login = async (userInfo) => {
        //setUser(userInfo);
    };

    const logout = async () => {
        //setUser(null);
    };

    if (!isInitialized) {
        return <div>Loading authentication...</div>;
    }
    
    return (
        <AuthContext.Provider value={{ login, logout, user, isLoading: isLoading || isFetching }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

















// import {createContext, useContext, useState} from 'react'

// export const AuthContext = createContext();

// export default function AuthProvider({children}){
    
//     const [user,setUser] = useState(null);

//     const login = async(userInfo,token)=>{
//         setUser(userInfo);
//         localStorage.setItem("token",token);
//         localStorage.setItem("user",userInfo)

//     }
    
//     const logout = async()=>{
//         setUser(null);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user")
//     }

//     return(
//         <AuthContext.Provider value={{login,logout,user}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = () =>useContext(AuthContext);




















// import { createContext, useContext, useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const { data, isLoading, isFetching } = useQuery({
//     queryKey: ["user_self"],
//     queryFn: async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`,
//           {
//             withCredentials: true,
//           }
//         );
//         return res.data;
//       } catch (error) {
//         return null;
//       }
//     },
//   });

//   useEffect(() => {
//     if (!isLoading) {
//       setUser(data || null);
//       setIsInitialized(true);
//     }
//   }, [data, isLoading]);

//   const login = async (userInfo) => {
//     setUser(userInfo);
//   };

//   const logout = async () => {
//       setUser(null);
//   };

//   if (!isInitialized) {
//     return <div>Loading authentication...</div>;
//   }

//   return (
//     <AuthContext.Provider
//       value={{ login, logout, user, isLoading: isLoading || isFetching }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useEffect, useState } from "react";
// import axiosInstance from "@/axiosConfig"; // axios with credentials

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true); // ✅ loading initially

//   // 🔐 Login (manual or fetch from server)
//   const login = async (userData = null) => {
//     try {
//       if (userData) {
//         setUser(userData); // ✅ use provided user
//       } else {
//         const res = await axiosInstance.get("/users/get-user");
//         setUser(res.data.user);
//       }
//     } catch (error) {
//       console.error("Login failed", error);
//       setUser(null);
//     }
//   };

//   // 🚪 Logout
//   const logout = async () => {
//     try {
//       await axiosInstance.post("/users/logout");
//       setUser(null);
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   // ⏳ On first app load: try to get logged-in user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axiosInstance.get("/users/get-user");
//         setUser(res.data.user);
//       } catch (err) {
//         setUser(null); // no active session
//       } finally {
//         setAuthLoading(false); // ✅ done checking
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, authLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//   };

//   const login = async (_userInfo, token) => {
//     localStorage.setItem("token", token);

//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setUser(res.data.user); // ✅ Set full user data
//     } catch (error) {
//       console.error("Failed to fetch user after login", error);
//       logout();
//     }
//   };

//   // 🔁 Load user when app starts
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios
//         .get(`${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((res) => {
//           setUser(res.data.user);
//         })
//         .catch((err) => {
//           console.error("Error loading user:", err);
//           logout();
//         });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ login, logout, user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   const login = async (userInfo, token) => {
//     setUser(userInfo);
//     localStorage.setItem("token", token);
//   };

//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem("token");
//   };

//   // 🔁 Load user on app refresh
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token && !user) {
//       axios
//         .get(`${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setUser(res.data.user);
//         })
//         .catch((err) => {
//           console.error("Error loading user:", err);
//           logout();
//         });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ login, logout, user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// import {createContext, useContext, useState} from 'react'

// export const AuthContext = createContext();

// export default function AuthProvider({children}){

//     const [user,setUser] = useState(null);

//     const login = async(userInfo,token)=>{
//         setUser(userInfo);
//         localStorage.setItem("token",token);
//     }

//     const logout = async()=>{
//         setUser(null);
//         localStorage.removeItem("token");
//     }

//     return(
//         <AuthContext.Provider value={{login,logout,user}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = () =>useContext(AuthContext);
