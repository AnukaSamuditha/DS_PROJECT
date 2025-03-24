import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./Providers/AuthProvider.jsx";
import QueryClientProviderCom from "./Providers/QueryClientProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <QueryClientProviderCom>
      <App />
    </QueryClientProviderCom>
  </AuthProvider>
);
