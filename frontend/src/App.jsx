
import { useState } from "react";
import Sidebar from "./Admin/Components/Sidebar";
import Dashboard from "./Admin/Pages/Dashboards";
import CustomerManagement from "./Admin/Pages/CustomerManagement";
import Report from "./Admin/Pages/Report";

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

      {currentPage === "Reports" && (
        <div style={{ marginLeft: "260px" }}>
          <Report />
        </div>
      )}

    </>
  );
}

export default App;
