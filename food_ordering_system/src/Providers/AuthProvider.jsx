import {createContext, useContext, useState} from 'react'

export const AuthContext = createContext();

export default function AuthProvider({children}){
    
    const [user,setUser] = useState(null);

    const login = async(userInfo,token)=>{
        setUser(userInfo);
        localStorage.setItem("token",token);
        localStorage.setItem("user",userInfo)
    }
    
    const logout = async()=>{
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user")
    }

    return(
        <AuthContext.Provider value={{login,logout,user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>useContext(AuthContext);
