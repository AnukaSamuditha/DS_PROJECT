import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import "./App.css";
import Layout from "./Layout";
import Home from "./Home";
import PlaceOrderPage from "./components/orders/placeOrder";
import MyOrders from "./components/orders/MyOrders";
import SignUp from "./Auth/SignUp";
import SignIn from "./Auth/SignIn";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/place-order" element={<PlaceOrderPage />} />
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin" element={<SignIn/>}/>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
