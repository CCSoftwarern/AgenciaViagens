
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import React from "react";
import {  AgencyProvider } from "./context/AgencyContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

// createRoot(document.getElementById("root")!).render(<App />);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="SEU_CLIENT_ID_AQUI.apps.googleusercontent.com">
  <AgencyProvider>
      <App />
  </AgencyProvider>
   </GoogleOAuthProvider>
  </React.StrictMode>
);
