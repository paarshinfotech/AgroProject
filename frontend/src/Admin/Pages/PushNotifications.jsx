import React, { useMemo, useState } from "react";
import "../CSS/PushNotifications.css";

const initialForm = {
  title: "",
  message: "",
  channel: "Push",
  target: "All Users",
  category: "Weather Alert",
  state: "",
  district: "",
  sendOption: "now",
  scheduleDate: "",
  scheduleTime: "",
};

export default function PushNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalSent = notifications.filter(
    (notification) => notification.status === "Sent"
  ).length;

  const smsSent = notifications.filter(
    (notification) =>
      notification.status === "Sent" && notification.type === "SMS"
  ).length;

  const emailSent = notifications.filter(
    (notification) =>
      notification.status === "Sent" && notification.type === "Email"
  ).length;

  const mostTargeted = useMemo(() => {
    if (!notifications.length) {
      return "All Users";
    }

    const counts = notifications.reduce((accumulator, item) => {
      accumulator[item.target] = (accumulator[item.target] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts).sort(
      (first, second) => second[1] - first[1]
    )[0][0];
  }, [notifications]);

  // Open notification modal
  const openCreateModal = () => {
    console.log("Create New Notification clicked");
    setIsModalOpen(true);
  };

  // Close notification modal
  const closeCreateModal = () => {
    setIsModalOpen(false);
  };

  // Update form values
  const updateForm = (key, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [key]: value,
    }));
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  // Submit notification form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      window.alert("Please enter notification title and message.");
      return;
    }

    if (
      form.sendOption === "schedule" &&
      (!form.scheduleDate || !form.scheduleTime)
    ) {
      window.alert("Please select schedule date and time.");
      return;
    }

    const date =
      form.sendOption === "schedule"
        ? new Date(`${form.scheduleDate}T${form.scheduleTime}`)
        : new Date();

    if (Number.isNaN(date.getTime())) {
      window.alert("Please select a valid date and time.");
      return;
    }

    const notification = {
      id: Date.now(),
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.channel,
      category: form.category,
      target: form.target,
      location:
        form.district && form.state
          ? `${form.district}, ${form.state}`
          : form.state || form.district || "All Locations",
      date: date,
      status: form.sendOption === "schedule" ? "Scheduled" : "Sent",
    };

    setNotifications((previousNotifications) => [
      ...previousNotifications,
      notification,
    ]);

    setForm(initialForm);
    closeCreateModal();

    window.alert(
      notification.status === "Sent"
        ? "Notification sent successfully!"
        : "Notification scheduled successfully!"
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (shouldDelete) {
      setNotifications((previousNotifications) =>
        previousNotifications.filter((item) => item.id !== id)
      );
    }
  };

  // View notification details
  const viewNotification = (notification) => {
    window.alert(
      `Title: ${notification.title}\n\n` +
        `Message: ${notification.message}\n\n` +
        `Channel: ${notification.type}\n` +
        `Target: ${notification.target}\n` +
        `Category: ${notification.category}\n` +
        `Location: ${notification.location}\n` +
        `Status: ${notification.status}`
    );
  };

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Push Notifications</h1>
          <p>
            Manage AgroProject notifications across different channels.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="cards">
        <SummaryCard
          title="Total Sent"
          value={totalSent}
          description="Across all channels"
          icon="📨"
        />

        <SummaryCard
          title="SMS Sent"
          value={smsSent}
          description="Total SMS notifications"
          icon="💬"
        />

        <SummaryCard
          title="Emails Sent"
          value={emailSent}
          description="Total email notifications"
          icon="✉️"
        />

        <SummaryCard
          title="Most Targeted"
          value={mostTargeted}
          description="Most common audience"
          icon="👥"
        />
      </div>

      {/* Notification History */}
      <div className="section">
        <div className="section-header">
          <div>
            <h2>Notification History</h2>
            <p>
              A log of all sent and scheduled AgroProject notifications.
            </p>
          </div>

          {/* Create Notification Button */}
          <button
            type="button"
            className="create-btn"
            onClick={openCreateModal}
          >
            + Create New Notification
          </button>
        </div>

        {/* Notification Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Target</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!notifications.length ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">🔔</div>

                      <div>No notifications created yet.</div>

                      <div className="empty-description">
                        Create a notification to communicate with your users.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                [...notifications].reverse().map((notification) => (
                  <tr key={notification.id}>
                    <td>
                      <div className="notification-title">
                        {notification.title}
                      </div>

                      <div className="notification-description">
                        {notification.category} • {notification.location}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${notification.type.toLowerCase()}`}
                      >
                        {notification.type}
                      </span>
                    </td>

                    <td>{notification.target}</td>

                    <td>{formatDate(notification.date)}</td>

                    <td>
                      <span
                        className={`badge ${notification.status.toLowerCase()}`}
                      >
                        {notification.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="action-btn"
                        title="View"
                        onClick={() => viewNotification(notification)}
                      >
                        👁️
                      </button>

                      <button
                        type="button"
                        className="action-btn"
                        title="Delete"
                        onClick={() =>
                          deleteNotification(notification.id)
                        }
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Notification Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeCreateModal}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h2>Create New Notification</h2>

              <button
                type="button"
                className="close-btn"
                onClick={closeCreateModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Notification Form */}
            <form onSubmit={handleSubmit}>
              {/* Notification Title */}
              <FormField label="Notification Title">
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateForm("title", event.target.value)
                  }
                  placeholder="e.g. Heavy Rain Alert for Farmers"
                  required
                />
              </FormField>

              {/* Notification Message */}
              <FormField label="Notification Message">
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    updateForm("message", event.target.value)
                  }
                  placeholder="Enter notification message..."
                  required
                />
              </FormField>

              {/* Notification Channel */}
              <FormField label="Notification Channel">
                <div className="channels">
                  {["Push", "SMS", "Email"].map((channel) => (
                    <label
                      className="channel-option"
                      key={channel}
                    >
                      <input
                        type="radio"
                        name="channel"
                        value={channel}
                        checked={form.channel === channel}
                        onChange={(event) =>
                          updateForm("channel", event.target.value)
                        }
                      />

                      <span>
                        {channel === "Push"
                          ? "Push Notification"
                          : channel}
                      </span>
                    </label>
                  ))}
                </div>
              </FormField>

              {/* Target Audience */}
              <FormField label="Target Audience">
                <div className="target-grid">
                  {["All Users", "Farmers", "Dealers", "FPOs"].map(
                    (target) => (
                      <label
                        className="target-option"
                        key={target}
                      >
                        <input
                          type="radio"
                          name="target"
                          value={target}
                          checked={form.target === target}
                          onChange={(event) =>
                            updateForm("target", event.target.value)
                          }
                        />

                        {target === "FPOs"
                          ? "FPOs / Organizations"
                          : target}
                      </label>
                    )
                  )}
                </div>
              </FormField>

              {/* Notification Category */}
              <FormField label="Notification Category">
                <select
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                >
                  {[
                    "Weather Alert",
                    "Crop Advisory",
                    "Market Price",
                    "Government Scheme",
                    "Pest & Disease",
                    "Farming Tips",
                    "General",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Target Location */}
              <FormField label="Target Location">
                <div className="form-row">
                  <input
                    type="text"
                    value={form.state}
                    onChange={(event) =>
                      updateForm("state", event.target.value)
                    }
                    placeholder="State e.g. Maharashtra"
                  />

                  <input
                    type="text"
                    value={form.district}
                    onChange={(event) =>
                      updateForm("district", event.target.value)
                    }
                    placeholder="District e.g. Akola"
                  />
                </div>
              </FormField>

              {/* Send Option */}
              <FormField label="Send Option">
                <select
                  value={form.sendOption}
                  onChange={(event) =>
                    updateForm("sendOption", event.target.value)
                  }
                >
                  <option value="now">Send Now</option>
                  <option value="schedule">
                    Schedule for Later
                  </option>
                </select>

                {/* Schedule Fields */}
                {form.sendOption === "schedule" && (
                  <div className="schedule-box">
                    <div className="form-row">
                      <input
                        type="date"
                        value={form.scheduleDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(event) =>
                          updateForm(
                            "scheduleDate",
                            event.target.value
                          )
                        }
                        required
                      />

                      <input
                        type="time"
                        value={form.scheduleTime}
                        onChange={(event) =>
                          updateForm(
                            "scheduleTime",
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </FormField>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="send-btn"
                >
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="card">
      <div className="card-top">
        <span className="card-title">{title}</span>

        <span className="card-icon">{icon}</span>
      </div>

      <div className="card-value">{value}</div>

      <div className="card-description">{description}</div>
    </div>
  );
}

// Form Field Component
function FormField({ label, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>

      {children}
    </div>
  );
}