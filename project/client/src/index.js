import React, { StrictMode } from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client";



import HospitalList from "./pages/admin";





const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <HospitalList/>
  </StrictMode>
);