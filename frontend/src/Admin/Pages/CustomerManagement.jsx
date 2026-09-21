import React, { useEffect, useMemo, useRef, useState } from "react";
import "../CSS/CustomerManagement.css";

/* ============================================================================
   AgroStar Admin Panel - Customer Management
   ----------------------------------------------------------------------------
   The UI below is the already-approved design and has NOT been changed.

   Only the DATA layer was replaced:
     - mock data  ->  real Spring Boot API (http://localhost:8080)
     - client-side search / filter / pagination  ->  server-side endpoints
     - local-only update  ->  real PUT request

   Everything uses the native fetch() API. No new dependencies, no new files.

   BACKEND CONTRACT (read from the actual Java source)
   ---------------------------------------------------
   Base URL .......... http://localhost:8080
   Controller ........ @RequestMapping("/api/admin/customers-management")
                       @CrossOrigin(origins = "http://localhost:5173")
   Returns ........... Spring Data Page<Customers>  (the entity, not the DTO)
   Customer fields ... id (MongoDB id), customerId (CUST001), name, email,
                       phone, location, date (LocalDate), status,
                       paymentStatus, notes

   IMPORTANT - the two identifiers:
     id         -> MongoDB document id. Used ONLY in API URLs (/search, /{id}).
     customerId -> business id shown to the user, e.g. CUST002.
   The table and the details modal display customerId, never id.
============================================================================ */

/* ----------------------------------------------------------------------------
   API base URL (declared once, reused by every request)
---------------------------------------------------------------------------- */
const API_BASE_URL = "http://localhost:8080";
const CUSTOMERS_API_URL = `${API_BASE_URL}/api/admin/customers-management`;

const DEMO_FALLBACK_ENABLED = true;

const DEMO_CUSTOMERS = [
  { id: "6741a0012c3d4e5f60718201", customerId: "CUST001", name: "Sonu Jup", phone: "9876543210", email: "sonu@gmail.com", location: "Kothrud", date: "2026-01-05", status: "Active", paymentStatus: "Paid", notes: "" },
  { id: "6741a0022c3d4e5f60718202", customerId: "CUST002", name: "Sneha Patil", phone: "9823456789", email: "sneha@gmail.com", location: "Wakad", date: "2026-01-18", status: "Active", paymentStatus: "Pending", notes: "" },
  { id: "6741a0032c3d4e5f60718203", customerId: "CUST003", name: "Abhilash Dixit", phone: "9765432109", email: "amit@gmail.com", location: "Hadapsar", date: "2025-12-25", status: "Inactive", paymentStatus: "Overdue", notes: "" },
  { id: "6741a0042c3d4e5f60718204", customerId: "CUST004", name: "Priya Joshi", phone: "8888888888", email: "priya@gmail.com", location: "Baner", date: "2026-02-02", status: "Active", paymentStatus: "Paid", notes: "" },
  { id: "6741a0052c3d4e5f60718205", customerId: "CUST005", name: "Swapnil Patil", phone: "9012345678", email: "kiran@gmail.com", location: "Hinjewadi", date: "2026-02-15", status: "New", paymentStatus: "Pending", notes: "" },
  { id: "6741a0062c3d4e5f60718206", customerId: "CUST006", name: "Vishal Chavan", phone: "9567890123", email: "rohan@gmail.com", location: "Shivajinagar", date: "2025-12-30", status: "VIP", paymentStatus: "Paid", notes: "" },
  { id: "6741a0072c3d4e5f60718207", customerId: "CUST007", name: "Meera Kulkarni", phone: "9123456780", email: "meera@gmail.com", location: "Aundh", date: "2026-01-10", status: "Active", paymentStatus: "Paid", notes: "" },
  { id: "6741a0082c3d4e5f60718208", customerId: "CUST008", name: "Rahul Deshmukh", phone: "9988776655", email: "rahul@gmail.com", location: "Viman Nagar", date: "2026-01-22", status: "New", paymentStatus: "Pending", notes: "" },
  { id: "6741a0092c3d4e5f60718209", customerId: "CUST009", name: "Anita Sharma", phone: "9090909090", email: "anita@gmail.com", location: "Pimpri", date: "2026-02-12", status: "VIP", paymentStatus: "Paid", notes: "" },
  { id: "6741a0102c3d4e5f60718210", customerId: "CUST010", name: "Nikhil Rane", phone: "9345678901", email: "nikhil@gmail.com", location: "Katraj", date: "2026-01-28", status: "Inactive", paymentStatus: "Overdue", notes: "" },
  { id: "6741a0112c3d4e5f60718211", customerId: "CUST011", name: "Kavita Pawar", phone: "9876500011", email: "kavita@gmail.com", location: "Kothrud", date: "2026-02-08", status: "Active", paymentStatus: "Pending", notes: "" },
  { id: "6741a0122c3d4e5f60718212", customerId: "CUST012", name: "Omkar Jadhav", phone: "9876500022", email: "omkar@gmail.com", location: "Baner", date: "2026-02-19", status: "New", paymentStatus: "Paid", notes: "" },
];

/* ----------------------------------------------------------------------------
   Inline SVG icons (unchanged)
---------------------------------------------------------------------------- */
function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.6 8S4 3.8 8 3.8 14.4 8 14.4 8 12 12.2 8 12.2 1.6 8 1.6 8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10.6 10.6 14 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 3.5h11L9.5 8.4v3.9l-3-1.6V8.4L2.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="6.6" r="3.1" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2.6 16.2c.6-2.6 2.8-4.2 5.4-4.2s4.8 1.6 5.4 4.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14.2 8.1a2.6 2.6 0 1 0 0-5.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
   UI options (unchanged values, must match what the backend stores)
---------------------------------------------------------------------------- */
const PAGE_SIZE_OPTIONS = [10, 25, 50];

const STATUS_OPTIONS = ["Active", "Inactive", "New", "VIP"];
const PAYMENT_OPTIONS = ["Paid", "Pending", "Overdue"];

const STATUS_BADGE = {
  Active: "customer-badge--solid",
  New: "customer-badge--outline",
  VIP: "customer-badge--dark",
  Inactive: "customer-badge--muted",
};

const PAYMENT_BADGE = {
  Paid: "customer-badge--solid",
  Pending: "customer-badge--muted",
  Overdue: "customer-badge--strong",
};

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  location: "",
  status: "Active",
};

/* ============================================================================
   Small helpers
============================================================================ */

/* Converts the backend LocalDate ("2026-01-18") into the UI format
   ("18 Jan 2026"). DISPLAY ONLY - the raw ISO value is kept in state so it can
   be sent back to the backend unchanged. */
function formatCustomerDate(dateValue) {
  if (!dateValue) return "-";

  // Already in the UI format? Return it untouched.
  if (typeof dateValue === "string" && /[A-Za-z]{3}/.test(dateValue)) {
    return dateValue;
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return String(dateValue);

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* Reads the pagination information from a Spring Data page response.
   Supports both serialisation shapes:
     flat   -> { content, totalElements, totalPages, number, size }
     wrapped-> { content, page: { totalElements, totalPages, number, size } }
   (Spring Boot can produce either depending on the page serialisation mode.) */
function readPageMeta(responseBody) {
  const body = responseBody || {};
  const meta = body.page ? body.page : body;

  return {
    content: Array.isArray(body.content) ? body.content : [],
    totalElements: Number(meta.totalElements || 0),
    totalPages: Number(meta.totalPages || 0),
    number: Number(meta.number || 0),
    size: Number(meta.size || 0),
  };
}

/* Turns any failed response into a short, readable message. */
async function buildApiError(response) {
  let detail = "";

  try {
    const body = await response.json();
    detail = body.message || body.error || "";
  } catch {
    detail = "";
  }

  if (response.status === 400) {
    return detail || "The request was rejected by the server (400).";
  }
  if (response.status === 404) {
    return "Customer not found (404).";
  }
  if (response.status >= 500) {
    return detail || "The server had a problem (500). Please try again.";
  }

  return detail || `Request failed (${response.status}).`;
}

/* ============================================================================
   API functions - each one maps to exactly one backend endpoint
============================================================================ */

/* GET /api/admin/customers-management?page=0&size=10
   GET /api/admin/customers-management/search?keyword=..&page=..&size=..
   GET /api/admin/customers-management/filter/status?status=..&page=..&size=..
   GET /api/admin/customers-management/filter/payment-status?paymentStatus=..
   One function, because all four return the same Spring Data Page object. */
async function fetchCustomersPage({
  keyword,
  status,
  paymentStatus,
  page,
  size,
}) {
  const encodedKeyword = encodeURIComponent(keyword || "");
  const encodedStatus = encodeURIComponent(status || "");
  const encodedPayment = encodeURIComponent(paymentStatus || "");

  let url = `${CUSTOMERS_API_URL}?page=${page}&size=${size}`;

  // The backend has no combined endpoint, so we follow its own priority:
  // search first, then status, then payment status.
  if (keyword) {
    url = `${CUSTOMERS_API_URL}/search?keyword=${encodedKeyword}&page=${page}&size=${size}`;
  } else if (status) {
    url = `${CUSTOMERS_API_URL}/filter/status?status=${encodedStatus}&page=${page}&size=${size}`;
  } else if (paymentStatus) {
    url = `${CUSTOMERS_API_URL}/filter/payment-status?paymentStatus=${encodedPayment}&page=${page}&size=${size}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(await buildApiError(response));
  return response.json();
}

/* GET /api/admin/customers-management/count - returns a plain number (long). */
async function fetchCustomerCount() {
  const response = await fetch(`${CUSTOMERS_API_URL}/count`);
  if (!response.ok) throw new Error(await buildApiError(response));
  return response.json();
}

/* GET /api/admin/customers-management/{id} - {id} is the MongoDB id. */
async function fetchCustomerDetails(id) {
  const response = await fetch(`${CUSTOMERS_API_URL}/${id}`);
  if (!response.ok) throw new Error(await buildApiError(response));
  return response.json();
}

/* PUT /api/admin/customers-management/{id} - {id} is the MongoDB id.
   The backend service copies customerId, name, email, phone, location, date,
   status, paymentStatus and notes from the body, so the body must carry the
   unchanged fields too, otherwise they would be overwritten with null. */
async function updateCustomer(id, customerBody) {
  const response = await fetch(`${CUSTOMERS_API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerBody),
  });

  if (!response.ok) throw new Error(await buildApiError(response));
  return response.json();
}

/* ----------------------------------------------------------------------------
   Builds the compact page list: 1 2 3 ... 13
---------------------------------------------------------------------------- */
function buildPageList(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("start-ellipsis");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("end-ellipsis");

  pages.push(totalPages);
  return pages;
}

/* ============================================================================
   Component
============================================================================ */
export default function CustomerManagement() {
  /* ------------------------------ state ---------------------------------- */
  // Table data (only the current backend page is held in memory)
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState("");

  // Total customers, from GET /count
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Server-side pagination, driven by the backend response
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [totalPages, setTotalPages] = useState(1);

  // Search (searchTerm = what is typed, debouncedSearch = what we request)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filter (panel selection, then applied values used for the request)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedPayment, setAppliedPayment] = useState("");

  // Details / edit modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [detailError, setDetailError] = useState("");

  const filterWrapperRef = useRef(null);

  // Guards against an older, slower response overwriting a newer one.
  const requestIdRef = useRef(0);

  /* --------------------- total customers (once on mount) ------------------ */
  useEffect(() => {
    let isMounted = true;

    fetchCustomerCount()
      .then((count) => {
        if (isMounted) setTotalCustomers(Number(count) || 0);
      })
      .catch(() => {
        // The count is only a summary value. If it fails we leave it at 0 and
        // the list keeps working; buildApiError already covers the list.
        if (isMounted) setTotalCustomers(0);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /* -------------------------- search debounce ---------------------------- */
  // Wait until typing pauses before calling the backend, so we do not fire one
  // request per keystroke. Also resets to the first page.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* --------------------- load the customer page -------------------------- */
  // Re-runs whenever the search, filters, page or page size change.
  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setListError("");

    fetchCustomersPage({
      keyword: debouncedSearch.trim(),
      status: appliedStatus,
      paymentStatus: appliedPayment,
      page: currentPage - 1, // backend pages are zero-indexed
      size: pageSize,
    })
      .then((body) => {
        if (requestIdRef.current !== requestId) return; // stale response

        const page = readPageMeta(body);
        setCustomers(page.content);
        setTotalPages(Math.max(1, page.totalPages));

        // Trust the backend's own page number.
        const backendPage = page.number + 1;
        if (backendPage !== currentPage) setCurrentPage(backendPage);
      })
      .catch((error) => {
        if (requestIdRef.current !== requestId) return;
        setCustomers([]);
        setTotalPages(1);
        setListError(error.message);
      })
      .finally(() => {
        if (requestIdRef.current !== requestId) return;
        setIsLoading(false);
      });
  }, [debouncedSearch, appliedStatus, appliedPayment, currentPage, pageSize]);

  /* ----------------------- modal keyboard support ------------------------- */
  useEffect(() => {
    if (!selectedCustomer) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleCloseModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCustomer]);

  /* ------------------- close filter panel on outside click ---------------- */
  useEffect(() => {
    if (!isFilterOpen) return undefined;

    const handleDocumentClick = (event) => {
      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [isFilterOpen]);

  /* --------------------------- row numbers -------------------------------- */
  const safePage = Math.min(currentPage, totalPages);
  const rowOffset = (safePage - 1) * pageSize;
  const firstRowNumber = customers.length === 0 ? 0 : rowOffset + 1;
  const lastRowNumber =
    customers.length === 0 ? 0 : rowOffset + customers.length;

  /* ----------------------------- handlers --------------------------------- */
  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleFilterChange(field, value) {
    if (field === "status") setStatusFilter(value);
    if (field === "payment") setPaymentFilter(value);
  }

  function handleApplyFilters() {
    setAppliedStatus(statusFilter);
    setAppliedPayment(paymentFilter);
    setCurrentPage(1);
    setIsFilterOpen(false);
  }

  function handleResetFilters() {
    setStatusFilter("");
    setPaymentFilter("");
    setAppliedStatus("");
    setAppliedPayment("");
    setSearchTerm("");
    setCurrentPage(1);
    setIsFilterOpen(false);
  }

  /* GET the full customer before opening the modal, so the details always
     come from the backend and include fields the row may not carry. */
  async function handleViewCustomer(customer) {
    setSelectedCustomer(customer); // show the modal straight away
    setIsEditing(false);
    setDetailError("");
    setIsDetailLoading(true);

    try {
      const fullCustomer = await fetchCustomerDetails(customer.id);
      setSelectedCustomer(fullCustomer);
    } catch (error) {
      setDetailError(error.message);
    } finally {
      setIsDetailLoading(false);
    }
  }

  function handleEditCustomer() {
    if (!selectedCustomer) return;
    // Only the fields the approved UI allows to be edited.
    setEditForm({
      name: selectedCustomer.name || "",
      phone: selectedCustomer.phone || "",
      email: selectedCustomer.email || "",
      location: selectedCustomer.location || "",
      status: selectedCustomer.status || "Active",
    });
    setDetailError("");
    setIsEditing(true);
  }

  function handleEditFormChange(event) {
    const { name, value } = event.target;
    setEditForm((previous) => ({ ...previous, [name]: value }));
  }

  /* PUT the edited values. The body keeps customerId, date, paymentStatus and
     notes from the selected customer, because the backend copies all of those
     fields and would otherwise blank them out. */
  async function handleUpdateCustomer(event) {
    event.preventDefault();
    if (!selectedCustomer) return;

    const requestBody = {
      ...selectedCustomer, // keeps id, customerId, date, paymentStatus, notes
      ...editForm, // replaces name, phone, email, location, status
    };

    setIsUpdating(true);
    setDetailError("");

    try {
      const updatedCustomer = await updateCustomer(
        selectedCustomer.id,
        requestBody,
      );

      // Use the backend's returned customer as the source of truth.
      setSelectedCustomer(updatedCustomer);
      setIsEditing(false);

      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer,
        ),
      );
    } catch (error) {
      setDetailError(error.message);
    } finally {
      setIsUpdating(false);
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setDetailError("");
  }

  function handleCloseModal() {
    setSelectedCustomer(null);
    setIsEditing(false);
    setDetailError("");
    setIsDetailLoading(false);
    setIsUpdating(false);
  }

  function handlePageChange(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function handlePageSizeChange(event) {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  }

  /* ------------------------------ render ---------------------------------- */
  const pageList = useMemo(
    () => buildPageList(safePage, totalPages),
    [safePage, totalPages],
  );

  return (
    <main className="customer-management">
      {/* ============================ HEADER ============================== */}
      <header className="customer-header">
        <h1 className="customer-header-title">Customer Management</h1>
        <p className="customer-header-subtitle">
          View and manage customer information
        </p>
      </header>

      {/* ========================= SUMMARY CARD =========================== */}
      <section className="customer-summary" aria-label="Customer summary">
        <div className="customer-summary-card">
          <span className="customer-summary-icon" aria-hidden="true">
            <UsersIcon />
          </span>
          <div>
            <p className="customer-summary-label">Total Customers</p>
            <p className="customer-summary-value">{totalCustomers}</p>
          </div>
        </div>
      </section>

      {/* ========================== CUSTOMER LIST ========================= */}
      <section
        className="customer-list-card"
        aria-labelledby="all-customers-heading"
      >
        <div className="customer-toolbar">
          <h2 className="customer-toolbar-title" id="all-customers-heading">
            All Customers
          </h2>

          <div className="customer-toolbar-actions">
            {/* ---------------------------- Search ---------------------------- */}
            <div className="customer-search">
              <span className="customer-search-icon" aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                type="search"
                className="form-control customer-search-input"
                placeholder="Search customers..."
                aria-label="Search customers"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* ---------------------------- Filter ---------------------------- */}
            <div className="customer-filter-wrapper" ref={filterWrapperRef}>
              <button
                type="button"
                className="btn customer-filter-btn"
                onClick={() => setIsFilterOpen((open) => !open)}
                aria-expanded={isFilterOpen}
                aria-haspopup="true"
              >
                <FilterIcon />
                <span>Filter</span>
              </button>

              {isFilterOpen && (
                <div
                  className="customer-filter-panel"
                  role="group"
                  aria-label="Customer filters"
                >
                  <div className="customer-filter-panel-header">
                    <span>Filters</span>
                    <button
                      type="button"
                      className="customer-filter-close"
                      onClick={() => setIsFilterOpen(false)}
                      aria-label="Close filters"
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  <div className="customer-filter-field">
                    <label htmlFor="filter-status">Status</label>
                    <select
                      id="filter-status"
                      className="form-select form-select-sm"
                      value={statusFilter}
                      onChange={(event) =>
                        handleFilterChange("status", event.target.value)
                      }
                    >
                      <option value="">All statuses</option>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="customer-filter-field">
                    <label htmlFor="filter-payment">Payment Status</label>
                    <select
                      id="filter-payment"
                      className="form-select form-select-sm"
                      value={paymentFilter}
                      onChange={(event) =>
                        handleFilterChange("payment", event.target.value)
                      }
                    >
                      <option value="">All payment statuses</option>
                      {PAYMENT_OPTIONS.map((payment) => (
                        <option key={payment} value={payment}>
                          {payment}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="customer-filter-actions">
                    <button
                      type="button"
                      className="btn customer-btn-secondary btn-sm"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn customer-btn-primary btn-sm"
                      onClick={handleApplyFilters}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------ Table ------------------------------ */}
        <div className="table-responsive customer-table-wrapper">
          <table className="table customer-table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Email</th>
                <th scope="col">Location</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Payment Status</th>
                <th scope="col" className="text-end">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="customer-empty-state">
                    Loading customers...
                  </td>
                </tr>
              )}

              {!isLoading && listError && (
                <tr>
                  <td
                    colSpan={8}
                    className="customer-empty-state customer-error-state"
                  >
                    {listError}
                  </td>
                </tr>
              )}

              {!isLoading &&
                !listError &&
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <span className="customer-name">{customer.name}</span>
                      {/* Display the business id, not the MongoDB id */}
                      <span className="customer-id">{customer.customerId}</span>
                    </td>
                    <td>{customer.phone}</td>
                    <td className="customer-email">{customer.email}</td>
                    <td>{customer.location}</td>
                    <td className="customer-date">
                      {formatCustomerDate(customer.date)}
                    </td>
                    <td>
                      <span
                        className={`customer-badge ${STATUS_BADGE[customer.status] || "customer-badge--muted"}`}
                      >
                        <span
                          className="customer-badge-dot"
                          aria-hidden="true"
                        />
                        {customer.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`customer-badge ${PAYMENT_BADGE[customer.paymentStatus] || "customer-badge--muted"}`}
                      >
                        <span
                          className="customer-badge-dot"
                          aria-hidden="true"
                        />
                        {customer.paymentStatus}
                      </span>
                    </td>
                    <td className="customer-action-cell">
                      <button
                        type="button"
                        className="customer-action-btn"
                        onClick={() => handleViewCustomer(customer)}
                        aria-label={`View details of ${customer.name}`}
                      >
                        <EyeIcon />
                        <span className="customer-tooltip" role="tooltip">
                          View Details
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}

              {!isLoading && !listError && customers.length === 0 && (
                <tr>
                  <td colSpan={8} className="customer-empty-state">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --------------------------- Pagination ---------------------------- */}
        <div className="customer-pagination-bar">
          <p className="customer-pagination-info mb-0">
            Showing <strong>{firstRowNumber}</strong>–
            <strong>{lastRowNumber}</strong> of{" "}
            <strong>{totalCustomers}</strong> customers
          </p>

          <div className="customer-page-size">
            <label htmlFor="page-size-select">Results per page</label>
            <select
              id="page-size-select"
              className="form-select form-select-sm"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav
          className="customer-pagination"
          aria-label="Customer list pagination"
        >
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => handlePageChange(safePage - 1)}
                aria-label="Previous page"
                disabled={safePage === 1}
              >
                ‹
              </button>
            </li>

            {pageList.map((page, index) =>
              typeof page === "number" ? (
                <li
                  key={page}
                  className={`page-item ${page === safePage ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                    aria-current={page === safePage ? "page" : undefined}
                  >
                    {page}
                  </button>
                </li>
              ) : (
                <li key={page + index} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              ),
            )}

            <li
              className={`page-item ${safePage === totalPages ? "disabled" : ""}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => handlePageChange(safePage + 1)}
                aria-label="Next page"
                disabled={safePage === totalPages}
              >
                ›
              </button>
            </li>
          </ul>
        </nav>
      </section>

      {/* ===================== CUSTOMER DETAILS / EDIT ==================== */}
      {selectedCustomer && (
        <div
          className="customer-modal-backdrop"
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-modal-header">
              <h2 className="customer-modal-title" id="customer-modal-title">
                {isEditing ? "Edit Customer" : "Customer Details"}
              </h2>
              <button
                type="button"
                className="customer-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* -------------------------- Details view -------------------------- */}
            {!isEditing && (
              <>
                <div className="customer-modal-body">
                  {isDetailLoading && (
                    <p className="customer-modal-message">
                      Loading customer details...
                    </p>
                  )}

                  {!isDetailLoading && detailError && (
                    <p className="customer-modal-message customer-error-state">
                      {detailError}
                    </p>
                  )}

                  {!isDetailLoading && (
                    <dl className="customer-detail-list">
                      <div className="customer-detail-row">
                        <dt>Customer ID</dt>
                        {/* Business id, not the MongoDB id */}
                        <dd>{selectedCustomer.customerId}</dd>
                      </div>
                      <div className="customer-detail-row">
                        <dt>Name</dt>
                        <dd>{selectedCustomer.name}</dd>
                      </div>
                      <div className="customer-detail-row">
                        <dt>Phone</dt>
                        <dd>{selectedCustomer.phone}</dd>
                      </div>
                      <div className="customer-detail-row">
                        <dt>Email</dt>
                        <dd>{selectedCustomer.email}</dd>
                      </div>
                      <div className="customer-detail-row">
                        <dt>Location</dt>
                        <dd>{selectedCustomer.location}</dd>
                      </div>
                      <div className="customer-detail-row">
                        <dt>Date</dt>
                        <dd>{formatCustomerDate(selectedCustomer.date)}</dd>
                      </div>
                      <div className="customer-detail-row">
                        <dt>Status</dt>
                        <dd>
                          <span
                            className={`customer-badge ${
                              STATUS_BADGE[selectedCustomer.status] ||
                              "customer-badge--muted"
                            }`}
                          >
                            <span
                              className="customer-badge-dot"
                              aria-hidden="true"
                            />
                            {selectedCustomer.status}
                          </span>
                        </dd>
                      </div>
                      <div className="customer-detail-row">
                        <dt>Payment Status</dt>
                        <dd>
                          <span
                            className={`customer-badge ${
                              PAYMENT_BADGE[selectedCustomer.paymentStatus] ||
                              "customer-badge--muted"
                            }`}
                          >
                            <span
                              className="customer-badge-dot"
                              aria-hidden="true"
                            />
                            {selectedCustomer.paymentStatus}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>

                <div className="customer-modal-footer">
                  <button
                    type="button"
                    className="btn customer-btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn customer-btn-primary"
                    onClick={handleEditCustomer}
                    disabled={isDetailLoading}
                  >
                    Edit
                  </button>
                </div>
              </>
            )}

            {/* --------------------------- Edit view ---------------------------- */}
            {isEditing && (
              <form
                className="customer-edit-form"
                onSubmit={handleUpdateCustomer}
              >
                <div className="customer-modal-body">
                  {detailError && (
                    <p className="customer-modal-message customer-error-state">
                      {detailError}
                    </p>
                  )}

                  <div className="customer-form-field">
                    <label htmlFor="edit-name">Name</label>
                    <input
                      id="edit-name"
                      name="name"
                      type="text"
                      className="form-control"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="edit-phone">Phone</label>
                    <input
                      id="edit-phone"
                      name="phone"
                      type="tel"
                      className="form-control"
                      value={editForm.phone}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="edit-email">Email</label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={editForm.email}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="edit-location">Location</label>
                    <input
                      id="edit-location"
                      name="location"
                      type="text"
                      className="form-control"
                      value={editForm.location}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="edit-status">Status</label>
                    <select
                      id="edit-status"
                      name="status"
                      className="form-select"
                      value={editForm.status}
                      onChange={handleEditFormChange}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="customer-modal-footer">
                  <button
                    type="button"
                    className="btn customer-btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn customer-btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating customer..." : "Update"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

