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
import SignUp from "./Auth/SignUp";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/place-order" element={<PlaceOrderPage />} />
      <Route path="/signup" element={<SignUp/>}/>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
