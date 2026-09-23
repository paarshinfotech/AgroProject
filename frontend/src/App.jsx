<<<<<<< HEAD

import { useState } from "react";
import Sidebar from "./Admin/Components/Sidebar";
import Dashboard from "./Admin/Pages/Dashboard";
import CustomerManagement from "./Admin/Pages/CustomerManagement";
import Report from "./Admin/Pages/Report";
import VendorList from "./Admin/Pages/VendorList";
=======
import React from "react";
import ApprovalManagement from "./Admin/Components/CSS/Pages/ApprovalManagement";
>>>>>>> f722e78e1e9f085fc20922a3483466c2fce9111f

function App() {
  return (
<<<<<<< HEAD
    <>
      <Sidebar setCurrentPage={setCurrentPage} />

      {currentPage === "Dashboard" && (
        <div style={{ marginLeft: "260px" }}>
          <Dashboard />
        </div>
      )}

      {currentPage === "Customer Management" && (
        <div style={{ marginLeft: "260px" }}>
          <CustomerManagement />
        </div>
      )}

      {currentPage === "Vendor Management" && (
  <div style={{ marginLeft: "260px" }}>
    <VendorList />
  </div>
)}

      {currentPage === "Reports" && (
        <div style={{ marginLeft: "260px" }}>
          <Report />
        </div>
      )}

    </>
=======
    <ApprovalManagement />
>>>>>>> f722e78e1e9f085fc20922a3483466c2fce9111f
  );
}

export default App;