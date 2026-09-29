import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/VendorList.css";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH VENDORS
  ============================================================ */

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/admin/vendors",
        {
          params: {
            search,
            location,
            status,
            page: currentPage,
            size: pageSize,
          },
        }
      );

      console.log("Vendor API Response:", response.data);

      setVendors(
        Array.isArray(response.data?.vendors)
          ? response.data.vendors
          : []
      );

      setTotalPages(
        Number(response.data?.totalPages) || 0
      );

      setTotalElements(
        Number(response.data?.totalElements) || 0
      );
    } catch (error) {
      console.error("Error fetching vendors:", error);

      /*
        Keep the table structure visible even when
        the backend is currently returning an error.
      */
      setVendors([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     FETCH WHEN FILTER / PAGE / PAGE SIZE CHANGES
  ============================================================ */

  useEffect(() => {
    fetchVendors();
  }, [search, location, status, currentPage, pageSize]);

  /* ============================================================
     SEARCH
  ============================================================ */

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  /* ============================================================
     LOCATION
  ============================================================ */

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setCurrentPage(0);
  };

  /* ============================================================
     STATUS
  ============================================================ */

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(0);
  };

  /* ============================================================
     PREVIOUS PAGE
  ============================================================ */

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  /* ============================================================
     NEXT PAGE
  ============================================================ */

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /* ============================================================
     ACTIVE / PENDING
  ============================================================ */

  const activeVendors = vendors.filter(
    (vendor) =>
      vendor.status?.toLowerCase() === "active"
  ).length;

  const pendingVendors = vendors.filter(
    (vendor) =>
      vendor.status?.toLowerCase() === "pending"
  ).length;

  /* ============================================================
     DISPLAY VALUES
  ============================================================ */

  const showingFrom =
    totalElements === 0
      ? 0
      : currentPage * pageSize + 1;

  const showingTo =
    totalElements === 0
      ? 0
      : Math.min(
          (currentPage + 1) * pageSize,
          totalElements
        );

  return (
    <div className="vendor-page">

      <div className="vendor-page-inner">

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="vendor-page-header">
          <h2>Vendor Management</h2>

          <p>
            View and manage vendor information
          </p>
        </div>


        {/* ======================================================
            KPI CARDS
        ====================================================== */}

        <div className="vendor-kpi-section">

          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <i className="bi bi-people"></i>
            </div>

            <div className="vendor-kpi-content">
              <p className="vendor-kpi-label">
                Total Vendors
              </p>

              <h3 className="vendor-kpi-value">
                {totalElements}
              </h3>
            </div>
          </div>


          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <i className="bi bi-person-check"></i>
            </div>

            <div className="vendor-kpi-content">
              <p className="vendor-kpi-label">
                Active Vendors
              </p>

              <h3 className="vendor-kpi-value">
                {activeVendors}
              </h3>
            </div>
          </div>


          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <i className="bi bi-person-exclamation"></i>
            </div>

            <div className="vendor-kpi-content">
              <p className="vendor-kpi-label">
                Pending Vendors
              </p>

              <h3 className="vendor-kpi-value">
                {pendingVendors}
              </h3>
            </div>
          </div>

        </div>


        {/* ======================================================
            MAIN CONTENT CARD
        ====================================================== */}

        <div className="vendor-content-card">

          {/* ====================================================
              FILTER SECTION
          ==================================================== */}

          <div className="vendor-filter-section">

            <h3 className="vendor-filter-title">
              All Vendors
            </h3>


            <div className="vendor-filter-controls">

              {/* Search */}

              <div className="vendor-search-box">
                <i className="bi bi-search"></i>

                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={search}
                  onChange={handleSearch}
                  autoComplete="off"
                />
              </div>


              {/* Location */}

              <div className="vendor-location-box">
                <i className="bi bi-geo-alt"></i>

                <input
                  type="text"
                  placeholder="Search by address"
                  value={location}
                  onChange={handleLocationChange}
                  autoComplete="off"
                />
              </div>


              {/* Status */}

              <div className="vendor-status-box">
                <select
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="">
                    All Status
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

          </div>


          {/* ====================================================
              TABLE
          ==================================================== */}

          <div className="vendor-table-wrapper">

            <table className="vendor-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Business Name</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>


              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="7"
                      className="vendor-loading"
                    >
                      Loading vendors...
                    </td>
                  </tr>

                ) : vendors.length > 0 ? (

                  vendors.map((vendor, index) => (

                    <tr
                      key={
                        vendor.id ||
                        vendor._id ||
                        index
                      }
                    >

                      <td>
                        {currentPage * pageSize +
                          index +
                          1}
                      </td>


                      <td>
                        <div className="vendor-name">
                          {vendor.name || "-"}
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
                        <div className="vendor-location">
                          <i className="bi bi-geo-alt"></i>

                          <span>
                            {vendor.address || "-"}
                          </span>
                        </div>
                      </td>


                      <td>
                        <span
                          className={`vendor-status-badge ${
                            vendor.status?.toLowerCase() || ""
                          }`}
                        >
                          {vendor.status || "-"}
                        </span>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="7"
                      className="vendor-loading"
                    >
                      Loading vendors...
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* ====================================================
              PAGINATION
          ==================================================== */}

          <div className="vendor-pagination">

            <div className="vendor-pagination-info">
              Showing{" "}
              <strong>{showingFrom}</strong>
              {"–"}
              <strong>{showingTo}</strong>
              {" "}of{" "}
              <strong>{totalElements}</strong>
              {" "}vendors
            </div>


            <div className="vendor-results-per-page">

              <span>
                Results per page
              </span>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(
                    Number(e.target.value)
                  );
                  setCurrentPage(0);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>

            </div>


            <div className="vendor-pagination-buttons">

              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                &lt;
              </button>


              <span className="vendor-current-page">
                {currentPage + 1}
              </span>


              <button
                type="button"
                onClick={handleNext}
                disabled={
                  currentPage >= totalPages - 1 ||
                  totalPages === 0
                }
                aria-label="Next page"
              >
                &gt;
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default VendorList;