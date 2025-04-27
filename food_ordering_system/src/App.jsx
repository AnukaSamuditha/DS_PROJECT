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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
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
  return <RouterProvider router={router} />;
}
