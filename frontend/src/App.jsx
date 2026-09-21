import { useState } from "react";
import Sidebar from "./Admin/Components/Sidebar";
import CustomerManagement from "./Admin/Pages/CustomerManagement";

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  return (
    <>
      <Sidebar setCurrentPage={setCurrentPage} />

      {currentPage === "Customer Management" && (
        <div style={{ marginLeft: "260px" }}>
          <CustomerManagement />
        </div>
      )}
    </>
  );
}

export default App;
