import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RestaurantList from './pages/RestaurantList';
import AddRestaurant from './pages/AddRestaurant';
import EditRestaurant from './pages/EditRestaurant';
import AddMenuItem from './pages/AddMenuItem';
import MenuItemList from './pages/MenuItemList';
import EditMenuItem from './pages/EditMenuItem';
import Navbar from './components/Navbar';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminVerifyRestaurants from './pages/AdminVerifyRestaurants';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurants" element={<RestaurantList />} />

            {/* Protected: restaurantOwner only */}
            <Route
              path="/restaurants/add"
              element={
                <ProtectedRoute allowedRoles={['restaurantOwner']}>
                  <AddRestaurant />
                </ProtectedRoute>
              }
            />

            <Route
              path="/restaurants/:id/add-menu-item"
              element={
                <ProtectedRoute allowedRoles={['restaurantOwner']}>
                  <AddMenuItem />
                </ProtectedRoute>
              }
            />

            {/* Accessible to owners/admins/editors if needed */}
            <Route path="/restaurants/edit/:id" element={<EditRestaurant />} />
            <Route path="/restaurants/:id/menu-items" element={<MenuItemList />} />
            <Route path="/menu-items/edit/:id" element={<EditMenuItem />} />

            {/* Protected: admin only */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verify-restaurants"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminVerifyRestaurants />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized fallback */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;






// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import RestaurantList from './pages/RestaurantList';
// import AddRestaurant from './pages/AddRestaurant';
// import EditRestaurant from './pages/EditRestaurant';
// import AddMenuItem from './pages/AddMenuItem';
// import MenuItemList from './pages/MenuItemList';
// import EditMenuItem from './pages/EditMenuItem';
// import Navbar from './components/Navbar';
// import AdminUserManagement from './pages/AdminUserManagement';
// import AdminVerifyRestaurants from './pages/AdminVerifyRestaurants';
// import { AuthProvider } from './auth/AuthContext';

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//       <Navbar />
//       <div style={{ padding: '20px' }}>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/restaurants" element={<RestaurantList />} />
//           <Route path="/restaurants/add" element={<AddRestaurant />} />
//           <Route path="/restaurants/edit/:id" element={<EditRestaurant />} />
//           <Route path="/restaurants/:id/add-menu-item" element={<AddMenuItem />} />
//           <Route path="/restaurants/:id/menu-items" element={<MenuItemList />} />
//           <Route path="/menu-items/edit/:id" element={<EditMenuItem />} />
//           <Route path="/admin/users" element={<AdminUserManagement />} />
//           <Route path="/admin/verify-restaurants" element={<AdminVerifyRestaurants />} />
//         </Routes>
//         </div>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
