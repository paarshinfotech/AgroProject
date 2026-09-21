
import React, { useState } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import "../CSS/VendorList.css";
import Topbar from "../Components/Topbar.jsx";

const VendorList = () => {



  // -----------------------------
  // 1. Dummy Vendor Data
  // -----------------------------
  const [vendors] = useState([
    {
      id: 1,
      name: "ABC Suppliers",
      email: "abc@gmail.com",
      phone: "9876543210",
      status: "Active",
      date: "15 Sep 2026",
    },
    {
      id: 2,
      name: "XYZ Traders",
      email: "xyz@gmail.com",
      phone: "9876543211",
      status: "Pending",
      date: "14 Sep 2026",
    },
    {
      id: 3,
      name: "PQR Enterprises",
      email: "pqr@gmail.com",
      phone: "9876543212",
      status: "Active",
      date: "12 Sep 2026",
    },
    {
      id: 4,
      name: "Global Suppliers",
      email: "global@gmail.com",
      phone: "9876543213",
      status: "Inactive",
      date: "10 Sep 2026",
    },
    {
      id: 5,
      name: "Maharashtra Traders",
      email: "maha@gmail.com",
      phone: "9876543214",
      status: "Active",
      date: "08 Sep 2026",
    },
    {
      id: 6,
      name: "Prime Enterprises",
      email: "prime@gmail.com",
      phone: "9876543215",
      status: "Pending",
      date: "05 Sep 2026",
    },
    {
      id: 7,
      name: "Smart Distributors",
      email: "smart@gmail.com",
      phone: "9876543216",
      status: "Active",
      date: "03 Sep 2026",
    },
    {
      id: 8,
      name: "Reliable Traders",
      email: "reliable@gmail.com",
      phone: "9876543217",
      status: "Inactive",
      date: "01 Sep 2026",
    },
  ]);


  // -----------------------------
  // 2. Search State
  // -----------------------------
  const [search, setSearch] = useState("");


  // -----------------------------
  // 3. Filter State
  // -----------------------------
  const [statusFilter, setStatusFilter] = useState("All");


  // -----------------------------
  // 4. Sort State
  // -----------------------------
  const [sortOrder, setSortOrder] = useState("asc");


  // -----------------------------
  // 5. Pagination State
  // -----------------------------
  const [currentPage, setCurrentPage] = useState(1);

  const vendorsPerPage = 5;


  // -----------------------------
  // 6. Search + Filter
  // -----------------------------
  const filteredVendors = vendors.filter((vendor) => {

    const searchValue = search.toLowerCase();

    const matchesSearch =
      vendor.name.toLowerCase().includes(searchValue) ||
      vendor.email.toLowerCase().includes(searchValue) ||
      vendor.phone.includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      vendor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  // -----------------------------
  // 7. Sort
  // -----------------------------
  const sortedVendors = [...filteredVendors].sort((a, b) => {

    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    }

    return b.name.localeCompare(a.name);
  });


  // -----------------------------
  // 8. Pagination
  // -----------------------------
  const totalPages = Math.ceil(
    sortedVendors.length / vendorsPerPage
  );

  const startIndex =
    (currentPage - 1) * vendorsPerPage;

  const currentVendors = sortedVendors.slice(
    startIndex,
    startIndex + vendorsPerPage
  );


  // -----------------------------
  // 9. Status Counts
  // -----------------------------
  const totalVendors = vendors.length;

  const activeVendors = vendors.filter(
    (vendor) => vendor.status === "Active"
  ).length;

  const pendingVendors = vendors.filter(
    (vendor) => vendor.status === "Pending"
  ).length;


  // -----------------------------
  // 10. Search Handler
  // -----------------------------
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };


  // -----------------------------
  // 11. Filter Handler
  // -----------------------------
  const handleFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };


  // -----------------------------
  // 12. Sort Handler
  // -----------------------------
  const handleSort = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };


  // -----------------------------
  // 13. Page Change
  // -----------------------------
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [isOpen, setIsOpen] = useState(true);


  return (
     <div className="admin-layout">
     <Topbar/>
    <Sidebar
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />

    <main
      className={`vendor-content ${
        isOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >

          {/* =========================
              Page Header
          ========================= */}
          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h2 className="fw-bold mb-1">
                Vendor Management
              </h2>

              <p className="text-muted mb-0">
                Manage and monitor all vendors
              </p>
            </div>

            <button className="btn btn-dark">
              + Add Vendor
            </button>

          </div>


          {/* =========================
              Statistics Cards
          ========================= */}
          <div className="row g-3 mb-4">

            {/* Total */}
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">

                  <p className="text-muted mb-2">
                    Total Vendors
                  </p>

                  <h3 className="fw-bold mb-0">
                    {totalVendors}
                  </h3>

                </div>
              </div>
            </div>


            {/* Active */}
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">

                  <p className="text-muted mb-2">
                    Active Vendors
                  </p>

                  <h3 className="fw-bold mb-0">
                    {activeVendors}
                  </h3>

                </div>
              </div>
            </div>


            {/* Pending */}
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">

                  <p className="text-muted mb-2">
                    Pending Vendors
                  </p>

                  <h3 className="fw-bold mb-0">
                    {pendingVendors}
                  </h3>

                </div>
              </div>
            </div>

          </div>


          {/* =========================
              Vendor Table Card
          ========================= */}
          <div className="card border-0 shadow-sm">

            {/* Table Header */}
            <div className="card-body border-bottom">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                <div>
                  <h5 className="fw-bold mb-1">
                    Vendor List
                  </h5>

                  <p className="text-muted mb-0">
                    View and manage registered vendors
                  </p>
                </div>


                {/* =========================
                    Search
                ========================= */}
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search vendors..."
                    value={search}
                    onChange={handleSearch}
                  />
                </div>

              </div>


              {/* =========================
                  Filter + Sort
              ========================= */}
              <div className="row mt-3 g-2">

                {/* Status Filter */}
                <div className="col-md-3 col-sm-6 col-12">

                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={handleFilter}
                  >
                    <option value="All">
                      All Status
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>


                {/* Sort */}
                <div className="col-md-3 col-sm-6 col-12">

                  <select
                    className="form-select"
                    value={sortOrder}
                    onChange={handleSort}
                  >
                    <option value="asc">
                      Name: A - Z
                    </option>

                    <option value="desc">
                      Name: Z - A
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* =========================
                Table
            ========================= */}
            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Vendor Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Registration Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentVendors.length > 0 ? (

                    currentVendors.map((vendor, index) => (

                      <tr key={vendor.id}>

                        <td>
                          {startIndex + index + 1}
                        </td>

                        <td>
                          <strong>
                            {vendor.name}
                          </strong>
                        </td>

                        <td>
                          {vendor.email}
                        </td>

                        <td>
                          {vendor.phone}
                        </td>

                        <td>
                          {vendor.date}
                        </td>

                        <td>

                          <span
                            className={
                              vendor.status === "Active"
                                ? "badge bg-dark"
                                : vendor.status === "Pending"
                                ? "badge bg-secondary"
                                : "badge bg-light text-dark border"
                            }
                          >
                            {vendor.status}
                          </span>

                        </td>

                        <td>

                          <button
                            className="btn btn-sm btn-outline-dark me-2"
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center py-4 text-muted"
                      >
                        No vendors found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>


            {/* =========================
                Pagination
            ========================= */}
            <div className="card-body border-top">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                <p className="text-muted mb-0">
                  Showing{" "}
                  {currentVendors.length > 0
                    ? startIndex + 1
                    : 0}
                  {" "}
                  to{" "}
                  {Math.min(
                    startIndex + vendorsPerPage,
                    sortedVendors.length
                  )}
                  {" "}
                  of {sortedVendors.length} vendors
                </p>


                <div>

                  {/* Previous */}
                  <button
                    className="btn btn-sm btn-outline-dark me-2"
                    disabled={currentPage === 1}
                    onClick={() =>
                      handlePageChange(currentPage - 1)
                    }
                  >
                    Previous
                  </button>


                  {/* Page Numbers */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (

                    <button
                      key={page}
                      className={
                        currentPage === page
                          ? "btn btn-sm btn-dark me-2"
                          : "btn btn-sm btn-outline-dark me-2"
                      }
                      onClick={() =>
                        handlePageChange(page)
                      }
                    >
                      {page}
                    </button>

                  ))}


                  {/* Next */}
                  <button
                    className="btn btn-sm btn-outline-dark"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      handlePageChange(currentPage + 1)
                    }
                  >
                    Next
                  </button>

                </div>

              </div>

            </div>

          </div>

         </main>

  </div>
  );
};

export default VendorList;