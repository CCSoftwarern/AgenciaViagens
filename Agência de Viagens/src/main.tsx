
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import React from "react";
import {  AgencyProvider } from "./context/AgencyContext";

// createRoot(document.getElementById("root")!).render(<App />);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <AgencyProvider>
      <App />
  </AgencyProvider>
  </React.StrictMode>
);
