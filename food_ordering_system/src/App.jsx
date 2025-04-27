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
import OrderStatus from "./components/OrderStatus";
import StartDelivery from "./components/StartDelivery";
import RequireAuth from "./components/RequireAuth";
import PreOrder from "./components/PreOrder";
import GoogleMapProvider from "./Providers/GoogleMapProvider";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import Cart from "./components/Payment/Cart";
import {subscribeUser} from "@/Providers/subscribeUser";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
          <Route path="/cart" element={<Cart/>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Route>

      <Route
        path="/deliver"
        element={
          <RequireAuth>
            <GoogleMapProvider>{(isLoaded)=><StartDelivery isLoaded={isLoaded}/>}</GoogleMapProvider>
          </RequireAuth>
        }
      ></Route>

      <Route
        path="/find-rider"
        element={
          <RequireAuth>
            <GoogleMapProvider>
              {(isLoaded) => <OrderStatus isLoaded={isLoaded} />}
            </GoogleMapProvider>
          </RequireAuth>
        }
      />
      <Route
        path="/pre-order"
        element={
          <RequireAuth>
            <PreOrder />
          </RequireAuth>
        }
      />
    </>

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
