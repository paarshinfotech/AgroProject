import { useState, useMemo, useEffect } from "react";
import "../CSS/Report.css";

const API_BASE = "http://localhost:8080";


const REPORT_API_REGISTRY = {
  farmer: {
    serverPaginated: true,
    url: (pageIndex) =>
      `${API_BASE}/api/admin/customers-management?page=${pageIndex}&size=${ROWS_PER_PAGE}`,
    contentKey: "content",
    totalPagesKey: "totalPages",
    totalElementsKey: "totalElements",
  },
  vendor: {
    serverPaginated: true,
    url: (pageIndex) =>
      `${API_BASE}/api/admin/vendors?page=${pageIndex}&size=${ROWS_PER_PAGE}`,
    contentKey: "vendors",
    totalPagesKey: "totalPages",
    totalElementsKey: "totalElements",
  },
  approval: {
    serverPaginated: false,
    url: () => `${API_BASE}/api/approvals`,
    contentKey: null, 
  },
};


const REPORTS = [
  {
    id: "farmer",
    category: "Customers",
    title: "Customers Report",
    tagline: "Registered customers and their activity",
   
    fields: [
      { label: "Customer ID", key: "customerId" },
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" },
      { label: "Location", key: "location" },
      { label: "Date", key: "date" },
      { label: "Status", key: "status" },
      { label: "Payment Status", key: "paymentStatus" },
    ],
  },
  {
    id: "vendor",
    category: "Vendors",
    title: "Vendor Report",
    tagline: "Seed, fertilizer & equipment suppliers",
    
    fields: [
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Mobile", key: "mobile" },
      { label: "Business Name", key: "businessName" },
      { label: "Address", key: "address" },
      { label: "Status", key: "status" },
    ],
  },
  {
    id: "approval",
    category: "Approvals",
    title: "Approval Report",
    tagline: "Farmer & vendor registrations pending review",
   
    fields: [
      { label: "Request ID", key: "requestId" },
      { label: "Request Type", key: "requestType" },
      { label: "Name", key: "name" },
      { label: "Submitted By", key: "submittedBy" },
      { label: "Date", key: "date" },
      { label: "Status", key: "status" },
    ],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(REPORTS.map((r) => r.category)))];
const ROWS_PER_PAGE = 5;

function formatValue(val) {
  if (val === null || val === undefined) return "—";
  if (Array.isArray(val)) return val.join("-"); // e.g. LocalDate as [2026,1,15]
  if (typeof val === "object") return JSON.stringify(val);
  const str = String(val);

  if (str.includes("T") && str.length > 10 && /^\d{4}-\d{2}-\d{2}T/.test(str)) {
    return str.slice(0, 10);
  }
  return str;
}

export default function Report() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // ---- real API state 
  const [apiPageIndex, setApiPageIndex] = useState(0); 
  const [apiContent, setApiContent] = useState([]); 
  const [apiAllRows, setApiAllRows] = useState([]); 
  const [apiTotalPages, setApiTotalPages] = useState(1);
  const [apiTotalElements, setApiTotalElements] = useState(0);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const apiConfig = selectedReport ? REPORT_API_REGISTRY[selectedReport.id] : null;

  const filtered = useMemo(() => {
    return REPORTS.filter((r) => {
      const matchesCategory = activeCategory === "All" || r.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.tagline.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  // ---- Fetch: server-paginated reports 
  useEffect(() => {
    if (!apiConfig || !apiConfig.serverPaginated) return;

    setApiLoading(true);
    setApiError(null);

    fetch(apiConfig.url(apiPageIndex))
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setApiContent(data[apiConfig.contentKey] || []);
        setApiTotalPages(data[apiConfig.totalPagesKey] ?? 1);
        setApiTotalElements(data[apiConfig.totalElementsKey] ?? 0);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        setApiError(err.message);
        setApiContent([]);
      })
      .finally(() => setApiLoading(false));
  }, [apiConfig, apiPageIndex]);

  // ---- Fetch: client-paginated reports
  useEffect(() => {
    if (!apiConfig || apiConfig.serverPaginated) return;

    setApiLoading(true);
    setApiError(null);

    fetch(apiConfig.url())
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = apiConfig.contentKey ? data[apiConfig.contentKey] : data;
        setApiAllRows(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        setApiError(err.message);
        setApiAllRows([]);
      })
      .finally(() => setApiLoading(false));
   
  }, [selectedReport]);

  
  const clientPagedRows = apiAllRows.slice(
    apiPageIndex * ROWS_PER_PAGE,
    (apiPageIndex + 1) * ROWS_PER_PAGE
  );
  const clientTotalPages = Math.max(1, Math.ceil(apiAllRows.length / ROWS_PER_PAGE));

  const handleView = (report) => {
    setSelectedReport(report);
    setApiPageIndex(0);
  };

  const handleBack = () => {
    setSelectedReport(null);
  };

  const handleDownload = async (report) => {
    setDownloadingId(report.id);
    try {
      
      await new Promise((resolve) => setTimeout(resolve, 600));
    } finally {
      setDownloadingId(null);
    }
  };

  // ---------- DETAIL VIEW (table + pagination) ----------
  if (selectedReport) {
    const fields = selectedReport.fields;
    const isServerPaginated = apiConfig.serverPaginated;

    const rows = isServerPaginated ? apiContent : clientPagedRows;
    const totalPages = isServerPaginated ? apiTotalPages : clientTotalPages;
    const totalCount = isServerPaginated ? apiTotalElements : apiAllRows.length;
    const currentPageDisplay = apiPageIndex + 1;

    const goToPage = (p) => setApiPageIndex(p - 1);

    return (
      <div className="reports-page">
        <button className="reports-back-btn" onClick={handleBack}>
          ← Back to Reports
        </button>

        <div className="reports-header">
          <div>
            <h1 className="reports-heading">{selectedReport.title}</h1>
            <p className="reports-subheading">{selectedReport.tagline}</p>
          </div>
          <button
            className="reports-btn reports-btn-download reports-btn-download-wide"
            onClick={() => handleDownload(selectedReport)}
            disabled={downloadingId === selectedReport.id}
          >
            {downloadingId === selectedReport.id ? "Preparing..." : "Download"}
          </button>
        </div>

        {apiLoading && <p>Loading data...</p>}
        {apiError && (
          <p style={{ color: "#b00020" }}>
            Couldn't load data from the server ({apiError}). Check that the backend is running
            and the database has records.
          </p>
        )}

        {!apiLoading && (
          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  {fields.map((f) => (
                    <th key={f.key}>{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id || idx}>
                    {fields.map((f) => (
                      <td key={f.key}>{formatValue(row[f.key])}</td>
                    ))}
                  </tr>
                ))}
                {rows.length === 0 && !apiLoading && (
                  <tr>
                    <td colSpan={fields.length} style={{ textAlign: "center", padding: "20px" }}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="reports-pagination">
          <span className="reports-pagination-info">
            Showing {(currentPageDisplay - 1) * ROWS_PER_PAGE + 1}
            –{Math.min(currentPageDisplay * ROWS_PER_PAGE, totalCount)} of {totalCount}
          </span>
          <div className="reports-pagination-controls">
            <button
              className="reports-page-btn"
              onClick={() => goToPage(Math.max(1, currentPageDisplay - 1))}
              disabled={currentPageDisplay === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`reports-page-btn ${p === currentPageDisplay ? "reports-page-btn-active" : ""}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="reports-page-btn"
              onClick={() => goToPage(Math.min(totalPages, currentPageDisplay + 1))}
              disabled={currentPageDisplay === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CARD GRID VIEW 
  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1 className="reports-heading">Reports</h1>
        </div>
        <input
          className="reports-search"
          name="reportSearch"
          id="reportSearch"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reports..."
        />
      </div>

      <div className="reports-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`reports-tab ${activeCategory === cat ? "reports-tab-active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="reports-grid">
        {filtered.map((report) => (
          <div key={report.id} className="reports-card">
            <div className="reports-card-top">
              <span className="reports-category-pill">{report.category}</span>
            </div>

            <h3 className="reports-card-title">{report.title}</h3>
            <p className="reports-card-tagline">{report.tagline}</p>

            <ul className="reports-field-list">
              {report.fields.map((f) => (
                <li key={f.key} className="reports-field-item">{f.label}</li>
              ))}
            </ul>

            <div className="reports-card-actions">
              <button className="reports-btn reports-btn-view" onClick={() => handleView(report)}>
                View
              </button>
              <button
                className="reports-btn reports-btn-download"
                onClick={() => handleDownload(report)}
                disabled={downloadingId === report.id}
              >
                {downloadingId === report.id ? "Preparing..." : "Download"}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="reports-empty">
            <p className="reports-empty-title">No reports match your search.</p>
            <p className="reports-empty-text">Try a different keyword or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}