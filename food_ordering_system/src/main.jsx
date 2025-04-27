import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./Providers/AuthProvider.jsx";
import QueryClientProviderCom from "./Providers/QueryClientProvider.jsx";
import OrderStatusProvider from "./Providers/OrderStatusProvider.jsx";

createRoot(document.getElementById("root")).render(
  <QueryClientProviderCom>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProviderCom>
);
