// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import AuthProvider from "./Providers/AuthProvider.jsx";
// import QueryClientProviderCom from "./Providers/QueryClientProvider.jsx";

// createRoot(document.getElementById("root")).render(
//   <AuthProvider>
//     <QueryClientProviderCom>
//       <App />
//     </QueryClientProviderCom>
//   </AuthProvider>
// );
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/Providers/AuthProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
       
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

