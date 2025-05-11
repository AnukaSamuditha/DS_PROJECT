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
import RestaurantDashboard from "./pages/RestaurantDashboard";
import AddRestaurant from "./pages/AddRestaurant";
import RestaurantMenuItems from "./pages/RestaurantMenuItems";
import AddMenuItemPage from "./pages/AddMenuItemPage";
import RestaurantList from "./pages/RestaurantList";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminRestaurantManagement from "./pages/AdminRestaurantManagement";
import RestaurantDetails from "./pages/RestaurantDetails";
import EditRestaurant from "./pages/EditRestaurant";
import EditMenuItem from "./pages/EditMenuItem";
import MenuItems from "./pages/MenuItems";
import RequireAuth from "./components/RequireAuth";
import OrderStatus from "./pages/OrderStatus";
import StartDelivery from "./pages/StartDelivery";
import PreOrder from "./components/PreOrder";
import GoogleMapProvider from "./Providers/GoogleMapProvider";
import Success from "./pages/success";
import Cart from "./components/Payment/Cart";
import { PlaceOrder } from "./components/orders/placeOrder";
import MyOrders from "./components/orders/MyOrders";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected Routes */}
        <Route
          path="/restaurants"
          element={
            <RequireAuth>
              <RestaurantList />
            </RequireAuth>
          }
        />
        <Route
          path="/restaurant-dashboard"
          element={
            <RequireAuth>
              <RestaurantDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/add-restaurant"
          element={
            <RequireAuth>
              <AddRestaurant />
            </RequireAuth>
          }
        />
        <Route
          path="/restaurant/:id/menu-items"
          element={
            <RequireAuth>
              <RestaurantMenuItems />
            </RequireAuth>
          }
        />
        <Route
          path="/restaurant/:id/menu-items/add"
          element={
            <RequireAuth>
              <AddMenuItemPage />
            </RequireAuth>
          }
        />
        <Route
          path="/edit-restaurant/:id"
          element={
            <RequireAuth>
              <EditRestaurant />
            </RequireAuth>
          }
        />
        <Route
          path="/restaurant/:id/menu-items/edit/:id"
          element={
            <RequireAuth>
              <EditMenuItem />
            </RequireAuth>
          }
        />
        <Route
          path="/menuitems"
          element={
            <RequireAuth>
              <MenuItems />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAuth>
              <AdminUserManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <RequireAuth>
              <AdminRestaurantManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/restaurants/:id"
          element={
            <RequireAuth>
              <RestaurantDetails />
            </RequireAuth>
          }
        />
      </Route>
      <Route
        path="/pre-order"
        element={
          <RequireAuth>
            <PreOrder />
          </RequireAuth>
        }
      />
      <Route
        path="/deliver"
        element={
          <RequireAuth>
            <GoogleMapProvider>
              {(isLoaded) => <StartDelivery isLoaded={isLoaded} />}
            </GoogleMapProvider>
          </RequireAuth>
        }
      />
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
        path="/success"
        element={
          <RequireAuth>
            <Success />
          </RequireAuth>
        }
      />
      <Route path="/place-order" element={<PlaceOrder />} />

      <Route path="/my-orders" element={<MyOrders />} />
      
    </>
  )
);

export default function App() {
  const channel = new BroadcastChannel("userId_channel");

  channel.onmessage = (event) => {
    if (event.data.requestUserId) {
      const loggedInUserId = localStorage.getItem("userId");
      channel.postMessage({ userId: loggedInUserId });
    }
  };

  return <RouterProvider router={router} />;
}
