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
import OrderStatus,{OrderLoader} from "./components/OrderStatus";
import StartDelivery,{DeliveryLoader} from "./components/StartDelivery";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/order-status" element={<OrderStatus/>} loader={OrderLoader}/>
      <Route path="/delivery" element={<StartDelivery/>} loader={DeliveryLoader}/>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
