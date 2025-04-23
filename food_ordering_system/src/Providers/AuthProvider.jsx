import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const login = async (_userInfo, token) => {
    localStorage.setItem("token", token);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.user); // ✅ Set full user data
    } catch (error) {
      console.error("Failed to fetch user after login", error);
      logout();
    }
  };

  // 🔁 Load user when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("Error loading user:", err);
          logout();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


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
