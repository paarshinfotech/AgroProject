import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./Admin/Components/Sidebar";
import Dashboard from "./Admin/Pages/Dashboard";
import CustomerManagement from "./Admin/Pages/CustomerManagement";
import Report from "./Admin/Pages/Report";
import VendorList from "./Admin/Pages/VendorList";
import PushNotifications from "./Admin/Pages/PushNotifications";
import ApprovalManagement from "./Admin/Pages/ApprovalManagement";

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sidebarWidth =
    windowWidth <= 640
      ? "0px"
      : windowWidth <= 900
        ? "240px"
        : sidebarCollapsed
          ? "76px"
          : "260px";

  return (
    <>
      <Sidebar
        setCurrentPage={setCurrentPage}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {currentPage === "Dashboard" && (
        <div
          className="app-content"
          style={{ "--sidebar-width": sidebarWidth }}
        >
          <Dashboard />
        </div>
      )}

      {currentPage === "Customer Management" && (
        <div
          className="app-content"
          style={{ "--sidebar-width": sidebarWidth }}
        >
          <CustomerManagement />
        </div>
      )}

      {currentPage === "Vendor Management" && (
        <div
          className="app-content"
          style={{ "--sidebar-width": sidebarWidth }}
        >
          <VendorList />
        </div>
      )}

      {currentPage === "Approval Management" && (
        <div
          className="app-content"
          style={{ "--sidebar-width": sidebarWidth }}
        >
          <ApprovalManagement />
        </div>
      )}

      {currentPage === "Reports" && (
        <div
          className="app-content"
          style={{ "--sidebar-width": sidebarWidth }}
        >
          <Report />
        </div>
      )}

      {currentPage === "Push Notification" && (
        <div
          className="app-content"
          style={{ "--sidebar-width": sidebarWidth }}
        >
          <PushNotifications />
        </div>
      )}
    </>
  );
}

export default App;
