import React, { useEffect, useState } from "react";
import "./ApprovalManagement.css";

function ApprovalManagement() {

  const [requests, setRequests] = useState([]);
  useEffect(() => {
  fetch("http://192.168.1.10:8080/api/approvals")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch approvals");
      }
      return response.json();
    })
    .then((data) => {
      setRequests(data);
    })
    .catch((error) => {
      console.error("Error fetching approvals:", error);
    });
}, []);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = requests.filter((request) => {
    const statusMatch =
      filter === "All" || request.status === filter;

    const searchMatch =
      request.name.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase()) ||
      request.type.toLowerCase().includes(search.toLowerCase()) ||
      request.location.toLowerCase().includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(
    filteredRequests.length / itemsPerPage
  );

  const currentRequests = filteredRequests.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const total = requests.length;
  const pending = requests.filter(
    (r) => r.status === "Pending"
  ).length;
  const approved = requests.filter(
    (r) => r.status === "Approved"
  ).length;
  const rejected = requests.filter(
    (r) => r.status === "Rejected"
  ).length;

  const changeStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    );

    setSelectedRequest(null);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div className="approval-page">

      {/* HEADER */}
      <div className="approval-header">
        <div>
          <h1>Approval Management</h1>
          <p>Manage and review approval requests</p>
        </div>

        <div className="approval-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* SUMMARY BOXES */}
      <div className="approval-cards">

        <button
          className={`summary-card ${
            filter === "All" ? "selected-card" : ""
          }`}
          onClick={() => selectFilter("All")}
        >
          <span>Total Requests</span>
          <strong>{total}</strong>
          <small>View all requests</small>
        </button>

        <button
          className={`summary-card ${
            filter === "Pending" ? "selected-card" : ""
          }`}
          onClick={() => selectFilter("Pending")}
        >
          <span>Pending Approvals</span>
          <strong>{pending}</strong>
          <small>Needs approval</small>
        </button>

        <button
          className={`summary-card ${
            filter === "Approved" ? "selected-card" : ""
          }`}
          onClick={() => selectFilter("Approved")}
        >
          <span>Approved</span>
          <strong>{approved}</strong>
          <small>Approved requests</small>
        </button>

        <button
          className={`summary-card ${
            filter === "Rejected" ? "selected-card" : ""
          }`}
          onClick={() => selectFilter("Rejected")}
        >
          <span>Rejected</span>
          <strong>{rejected}</strong>
          <small>Rejected requests</small>
        </button>

      </div>

      {/* FILTER TABS */}
      <div className="approval-tabs">

        <button
          className={filter === "All" ? "active-tab" : ""}
          onClick={() => selectFilter("All")}
        >
          Total Requests
        </button>

        <button
          className={filter === "Pending" ? "active-tab" : ""}
          onClick={() => selectFilter("Pending")}
        >
          Pending
        </button>

        <button
          className={filter === "Approved" ? "active-tab" : ""}
          onClick={() => selectFilter("Approved")}
        >
          Approved
        </button>

        <button
          className={filter === "Rejected" ? "active-tab" : ""}
          onClick={() => selectFilter("Rejected")}
        >
          Rejected
        </button>

      </div>

      {/* REQUEST LIST */}
      <div className="request-list">

        {currentRequests.map((request) => (
          <div className="request-card" key={request.id}>

            <div className="request-image">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=500&q=80"
                alt="Agriculture"
              />
            </div>

            <div className="request-content">

              <div className="request-top">
                <span>REQUEST ID: {request.id}</span>
                <span>{request.date}</span>
              </div>

              <h2>{request.name}</h2>

              <div className="request-info">

                <div>
                  <small>REQUEST TYPE</small>
                  <p>{request.type}</p>
                </div>

                <div>
                  <small>LOCATION</small>
                  <p>{request.location}</p>
                </div>

                <div>
                  <small>EXPERIENCE</small>
                  <p>{request.experience}</p>
                </div>

              </div>

              <div className="request-bottom">

                <span className="status">
                  {request.status}
                </span>

                <div className="request-actions">

                  <button
                    className="view-btn"
                    onClick={() => setSelectedRequest(request)}
                  >
                    View Profile
                  </button>

                  {request.status === "Pending" && (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() =>
                          changeStatus(request.id, "Approved")
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          changeStatus(request.id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                </div>

              </div>

            </div>
          </div>
        ))}

        {currentRequests.length === 0 && (
          <div className="no-data">
            No requests found
          </div>
        )}

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ‹
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => (
              <button
                key={index}
                className={
                  page === index + 1
                    ? "page-active"
                    : ""
                }
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>

        </div>
      )}

      {/* PROFILE MODAL */}
      {selectedRequest && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-modal"
              onClick={() => setSelectedRequest(null)}
            >
              ×
            </button>

            <div className="profile-image">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=500&q=80"
                alt="Agriculture"
              />
            </div>

            <h2>{selectedRequest.name}</h2>

            <p className="profile-id">
              {selectedRequest.id}
            </p>

            <div className="profile-details">

              <div>
                <span>Request Type</span>
                <strong>{selectedRequest.type}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedRequest.location}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedRequest.email}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{selectedRequest.phone}</strong>
              </div>

              <div>
                <span>Experience</span>
                <strong>{selectedRequest.experience}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedRequest.status}</strong>
              </div>

            </div>

            {selectedRequest.status === "Pending" && (
              <div className="modal-actions">

                <button
                  onClick={() =>
                    changeStatus(
                      selectedRequest.id,
                      "Approved"
                    )
                  }
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    changeStatus(
                      selectedRequest.id,
                      "Rejected"
                    )
                  }
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default ApprovalManagement;