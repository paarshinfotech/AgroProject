
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/VendorList.css";

const VendorList = () => {

  // Vendor data
  const [vendors, setVendors] = useState([]);

  // Search and filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch vendors
  const handleVendorList = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/admin/vendors",
        {
          params: {
            search: search,
            location: location,
            status: status,
            page: currentPage,
            size: pageSize
          }
        }
      );

      console.log("Vendor API response:", response.data);

      setVendors(response.data.vendors);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);

    } catch (error) {

      console.log("Vendor API Error:", error);
      setError("Failed to load vendors.");

    } finally {

      setLoading(false);

    }
  };

  // Fetch whenever filters or page changes
  useEffect(() => {

    handleVendorList();

  }, [search, location, status, currentPage]);


  // Search
  const handleSearchChange = (e) => {

    setSearch(e.target.value);
    setCurrentPage(0);

  };


  // Location
  const handleLocationChange = (e) => {

    setLocation(e.target.value);
    setCurrentPage(0);

  };


  // Status
  const handleStatusChange = (e) => {

    setStatus(e.target.value);
    setCurrentPage(0);

  };


  // Previous page
  const handlePrevious = () => {

    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }

  };


  // Next page
  const handleNext = () => {

    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }

  };


  return (

    <div className="vendor-content">

      {/* Page Header */}

      <div className="vendor-page-header">

        <div>

          <h2>Vendor Management</h2>

          <p>
            Manage and monitor all registered vendors
          </p>

        </div>

        <div className="vendor-total-card">

          <span>Total Vendors</span>

          <strong>{totalElements}</strong>

        </div>

      </div>


      {/* Filters Card */}

      <div className="vendor-filter-card">

        <div className="filter-header">

          <h4>Vendor List</h4>

          <span>
            {totalElements} vendors
          </span>

        </div>


        <div className="vendor-filters">

          {/* Search */}

          <div className="filter-group search-group">

            <label>Search</label>

            <div className="input-wrapper">

              <span className="input-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search vendor name..."
                value={search}
                onChange={handleSearchChange}
              />

            </div>

          </div>


          {/* Location */}

          <div className="filter-group">

            <label>Location</label>

            <div className="input-wrapper">

              <span className="input-icon">
                📍
              </span>

              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={handleLocationChange}
              />

            </div>

          </div>


          {/* Status */}

          <div className="filter-group">

            <label>Status</label>

            <select
              value={status}
              onChange={handleStatusChange}
            >

              <option value="">
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

        </div>

      </div>


      {/* Error */}

      {error && (

        <div className="vendor-error">

          {error}

        </div>

      )}


      {/* Table Card */}

      <div className="vendor-table-card">

        <div className="table-responsive">

          <table className="vendor-table">

            <thead>

              <tr>

                <th>#</th>

                <th>Vendor</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Business</th>

                <th>Location</th>

                <th>Status</th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="table-message"
                  >

                    <div className="loading-spinner"></div>

                    Loading vendors...

                  </td>

                </tr>

              ) : vendors.length > 0 ? (

                vendors.map((vendor, index) => (

                  <tr key={vendor.id}>

                    <td className="vendor-number">

                      {currentPage * pageSize + index + 1}

                    </td>


                    <td>

                      <div className="vendor-name-cell">

                        <div className="vendor-avatar">

                          {vendor.name
                            ? vendor.name.charAt(0).toUpperCase()
                            : "V"}

                        </div>

                        <span>
                          {vendor.name || "-"}
                        </span>

                      </div>

                    </td>


                    <td>
                      {vendor.email || "-"}
                    </td>


                    <td>
                      {vendor.mobile || "-"}
                    </td>


                    <td>
                      {vendor.businessName || "-"}
                    </td>


                    <td>
                      {vendor.address || "-"}
                    </td>


                    <td>

                      <span
                        className={`status-badge ${
                          vendor.status
                            ? vendor.status.toLowerCase()
                            : ""
                        }`}
                      >

                        <span className="status-dot"></span>

                        {vendor.status || "Unknown"}

                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="table-message"
                  >

                    <div className="empty-icon">
                      📋
                    </div>

                    <strong>
                      No vendors found
                    </strong>

                    <span>
                      Try changing your search or filter.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* Pagination */}

        <div className="vendor-pagination">

          <div className="pagination-info">

            Showing{" "}

            {totalElements === 0
              ? 0
              : currentPage * pageSize + 1}

            {" "}to{" "}

            {Math.min(
              (currentPage + 1) * pageSize,
              totalElements
            )}

            {" "}of{" "}

            {totalElements}

          </div>


          <div className="pagination-controls">

            <button
              className="pagination-btn"
              onClick={handlePrevious}
              disabled={currentPage === 0}
            >

              ← Previous

            </button>


            <span className="page-number">

              {totalPages === 0
                ? 0
                : currentPage + 1}

            </span>


            <button
              className="pagination-btn"
              onClick={handleNext}
              disabled={
                totalPages === 0 ||
                currentPage >= totalPages - 1
              }
            >

              Next →

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default VendorList;

