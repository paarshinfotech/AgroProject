import { useState } from "react";

import Sidebar from "./Admin/Components/Sidebar";
import Dashboard from "./Admin/Pages/Dashboard";
import CustomerManagement from "./Admin/Pages/CustomerManagement";
import Report from "./Admin/Pages/Report";
import VendorList from "./Admin/Pages/VendorList";
import PushNotifications from "./Admin/Pages/PushNotifications";
import ApprovalManagement from "./Admin/Components/CSS/Pages/ApprovalManagement";

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  return (
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

      {currentPage === "Approval Management" && (
        <div style={{ marginLeft: "260px" }}>
          <ApprovalManagement />
        </div>
      )}

      {currentPage === "Reports" && (
        <div style={{ marginLeft: "260px" }}>
          <Report />
        </div>
      )}

      {currentPage === "Push Notification" && (
        <div style={{ marginLeft: "260px" }}>
          <PushNotifications />
        </div>
      )}
    </>
  );
}

export default App;