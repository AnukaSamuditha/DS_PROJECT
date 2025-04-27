import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import "./App.css";
import Layout from "./Layout";
import Home from "./Home";
import SignUp from "./Auth/SignUp";
import SignIn from "./Auth/SignIn";
import Cart from "./components/Payment/Cart.jsx"
import {subscribeUser} from "@/Providers/subscribeUser.jsx";
import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";


const router = createBrowserRouter(
  createRoutesFromElements(
    // <Route path="/" element={<Layout />}>
        <Route>
        <Route index element={<Home />} />
        <Route path="/cart" element={<Cart/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin" element={<SignIn/>}/>
    </Route>
  )
);

export default function App() {

    const { data: userData } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/users/get-user`, {
                withCredentials: true,
            });
            return res.data;
        },
    });

    const userId = userData?.user?._id

    useEffect(() => {
        if (userId) {
            subscribeUser(userId);
        }
    }, [userId]);
  return <RouterProvider router={router} />;
}
