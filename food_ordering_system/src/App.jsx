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
// import RestaurantMenuPublic from "./pages/RestaurantMenuPublic";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminRestaurantManagement from "./pages/AdminRestaurantManagement";
import RestaurantDetails from "./pages/RestaurantDetails";
import EditRestaurant from "./pages/EditRestaurant";
import EditMenuItem from "./pages/EditMenuItem";
import MenuItems from "./pages/MenuItems";
// import ProtectedRoute from "./components/ProtectedRoute"; // 🔐 Import
import RequireAuth from './components/RequireAuth';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Protected Routes - Any authenticated user */}
      <Route
        path="/restaurants"
        element={
          <RequireAuth>
            <RestaurantList />
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
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}










// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   RouterProvider,
// } from "react-router";
// import "./App.css";
// import Layout from "./Layout";
// import Home from "./Home";
// import SignUp from "./Auth/SignUp";
// import SignIn from "./Auth/SignIn";
// import RestaurantDashboard from "./pages/RestaurantDashboard";
// import AddRestaurant from "./pages/AddRestaurant";
// import RestaurantMenuItems from "./pages/RestaurantMenuItems";
// import AddMenuItemPage from "./pages/AddMenuItemPage";
// import RestaurantList from "./pages/RestaurantList";
// // import RestaurantMenuPublic from "./pages/RestaurantMenuPublic";

// import AdminUserManagement from "./pages/AdminUserManagement";
// import AdminRestaurantManagement from "./pages/AdminRestaurantManagement";
// import RestaurantDetails from "./pages/RestaurantDetails";
// import EditRestaurant from "./pages/EditRestaurant";
// import EditMenuItem from "./pages/EditMenuItem";
// import MenuItems from "./pages/MenuItems";


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<Layout />}>
//       <Route index element={<Home />} />
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/signin" element={<SignIn />} />
//       <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
//       <Route path="/add-restaurant" element={<AddRestaurant />} />
//       <Route
//         path="/restaurant/:id/menu-items"
//         element={<RestaurantMenuItems />}
//       />
//       <Route
//         path="/restaurant/:id/menu-items/add"
//         element={<AddMenuItemPage />}
//       />
//       <Route path="/restaurants" element={<RestaurantList />} />
//       {/* <Route path="/restaurants/:id/menu" element={<RestaurantMenuPublic />} /> */}

//       <Route path="/admin/users" element={<AdminUserManagement />} />
//       <Route
//         path="/admin/restaurants"
//         element={<AdminRestaurantManagement />}
//       />

//       <Route path="/restaurants/:id" element={<RestaurantDetails />} />

//       <Route path="/edit-restaurant/:id" element={<EditRestaurant />} />

//       <Route path="/restaurant/:id/menu-items/edit/:id" element={<EditMenuItem />} />

//       <Route path="/menuitems" element={<MenuItems />} />

//     </Route>
//   )
// );

// export default function App() {
//   return <RouterProvider router={router} />;
// }
