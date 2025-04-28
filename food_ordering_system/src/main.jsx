import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./Providers/AuthProvider.jsx";
import QueryClientProviderCom from "./Providers/QueryClientProvider.jsx";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the default CSS for react-toastify

createRoot(document.getElementById("root")).render(
<QueryClientProviderCom>
  <AuthProvider>
    <App />
    <ToastContainer
        position="top-right"
        autoClose={2000} // Auto close after 5 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Stack to top
        closeOnClick
        rtl={false} // Right to left
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="bg-blue-500 text-white p-4 rounded-lg shadow-lg"
      />
  </AuthProvider>
</QueryClientProviderCom>

);
