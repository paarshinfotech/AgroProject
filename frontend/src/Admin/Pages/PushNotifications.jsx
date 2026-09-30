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

/* =========================
   ICONS
   ========================= */

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7L12 13L21 7" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11.5C20 15.64 16.64 19 12.5 19H8L4 21V16.5C2.7 15.1 2 13.4 2 11.5C2 7.36 5.36 4 9.5 4H12.5C16.64 4 20 7.36 20 11.5Z" />
      <path d="M8 11.5H8.01" />
      <path d="M12 11.5H12.01" />
      <path d="M16 11.5H16.01" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21V19C16 16.79 14.21 15 12 15H7C4.79 15 3 16.79 3 19V21" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M17 3.5C18.7 4.2 19.5 5.4 19.5 7C19.5 8.6 18.7 9.8 17 10.5" />
      <path d="M21 21V19C21 17.2 19.85 15.7 18.25 15.2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8C18 4.7 15.8 2 12 2C8.2 2 6 4.7 6 8C6 14 3 15 3 17H21C21 15 18 14 18 8Z" />
      <path d="M10 21H14" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12C2.5 12 6 6 12 6C18 6 21.5 12 21.5 12C21.5 12 18 18 12 18C6 18 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7H20" />
      <path d="M10 11V17" />
      <path d="M14 11V17" />
      <path d="M6 7L7 21H17L18 7" />
      <path d="M9 7V4H15V7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

/* =========================
   REUSABLE COMPONENTS
   ========================= */

function FormField({ label, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

function SummaryCard({ title, value, description, icon }) {
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

/* =========================
   MAIN PAGE
   ========================= */

export default function PushNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const totalSent = notifications.filter(function (item) {
    return item.status === "Sent";
  }).length;

  const smsSent = notifications.filter(function (item) {
    return item.status === "Sent" && item.type === "SMS";
  }).length;

  const emailSent = notifications.filter(function (item) {
    return item.status === "Sent" && item.type === "Email";
  }).length;

  const mostTargeted = useMemo(
    function () {
      if (notifications.length === 0) {
        return "All Users";
      }

      const counts = {};

      notifications.forEach(function (item) {
        if (!counts[item.target]) {
          counts[item.target] = 0;
        }

        counts[item.target] += 1;
      });

      let result = "All Users";
      let highest = 0;

      Object.keys(counts).forEach(function (target) {
        if (counts[target] > highest) {
          highest = counts[target];
          result = target;
        }
      });

      return result;
    },
    [notifications]
  );

  function openCreateModal() {
  setForm({
    ...initialForm,
    scheduleDate: "",
    scheduleTime: "",
  });

  setIsCategoryOpen(false);
  setIsModalOpen(true);
}

  function closeCreateModal() {
  setIsCategoryOpen(false);
  setIsModalOpen(false);
}

  function updateForm(key, value) {
    setForm(function (previous) {
      return {
        ...previous,
        [key]: value,
      };
    });
  }

  function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      window.alert("Please enter notification title.");
      return;
    }

    if (!form.message.trim()) {
      window.alert("Please enter notification message.");
      return;
    }

    if (
      form.sendOption === "schedule" &&
      (!form.scheduleDate || !form.scheduleTime)
    ) {
      window.alert("Please select schedule date and time.");
      return;
    }

    let notificationDate;

    if (form.sendOption === "schedule") {
      notificationDate = new Date(
        form.scheduleDate + "T" + form.scheduleTime
      );
    } else {
      notificationDate = new Date();
    }

    if (Number.isNaN(notificationDate.getTime())) {
      window.alert("Please select a valid date and time.");
      return;
    }

    const location =
      form.district && form.state
        ? form.district + ", " + form.state
        : form.state || form.district || "All Locations";

    const newNotification = {
      id: Date.now(),
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.channel,
      target: form.target,
      category: form.category,
      location: location,
      date: notificationDate,
      status:
        form.sendOption === "schedule"
          ? "Scheduled"
          : "Sent",
    };

    setNotifications(function (previous) {
      return [...previous, newNotification];
    });

    setForm(initialForm);
    setIsModalOpen(false);

    window.alert(
      newNotification.status === "Sent"
        ? "Notification sent successfully!"
        : "Notification scheduled successfully!"
    );
  }

  function deleteNotification(id) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!shouldDelete) {
      return;
    }

    setNotifications(function (previous) {
      return previous.filter(function (item) {
        return item.id !== id;
      });
    });
  }

  function viewNotification(item) {
    window.alert(
      "Title: " +
        item.title +
        "\n\nMessage: " +
        item.message +
        "\n\nChannel: " +
        item.type +
        "\nTarget: " +
        item.target +
        "\nCategory: " +
        item.category +
        "\nLocation: " +
        item.location +
        "\nStatus: " +
        item.status
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Push Notifications</h1>

          <p>
            Manage AgroProject notifications across different channels.
          </p>
        </div>
      </div>

      {/* =========================
          KPI CARDS
      ========================= */}

      <div className="cards">
        <SummaryCard
          title="Total Sent"
          value={totalSent}
          description="Across all channels"
          icon={<MailIcon />}
        />

        <SummaryCard
          title="SMS Sent"
          value={smsSent}
          description="Total SMS notifications"
          icon={<MessageIcon />}
        />

        <SummaryCard
          title="Emails Sent"
          value={emailSent}
          description="Total email notifications"
          icon={<MailIcon />}
        />

        <SummaryCard
          title="Most Targeted"
          value={mostTargeted}
          description="Most common audience"
          icon={<UsersIcon />}
        />
      </div>

      {/* =========================
          NOTIFICATION HISTORY
      ========================= */}

      <div className="section">
        <div className="section-header">
          <div>
            <h2>Notification History</h2>

            <p>
              A log of all sent and scheduled AgroProject notifications.
            </p>
          </div>

          <button
            type="button"
            className="create-btn"
            onClick={openCreateModal}
          >
            + Create New Notification
          </button>
        </div>

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
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <BellIcon />
                      </div>

                      <div>No notifications created yet.</div>

                      <div className="empty-description">
                        Create a notification to communicate with your users.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications
                  .slice()
                  .reverse()
                  .map(function (notification) {
                    return (
                      <tr key={notification.id}>
                        <td>
                          <div className="notification-title">
                            {notification.title}
                          </div>

                          <div className="notification-description">
                            {notification.category} {" • "}
                            {notification.location}
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              "badge " +
                              notification.type.toLowerCase()
                            }
                          >
                            {notification.type}
                          </span>
                        </td>

                        <td>{notification.target}</td>

                        <td>{formatDate(notification.date)}</td>

                        <td>
                          <span
                            className={
                              "badge " +
                              notification.status.toLowerCase()
                            }
                          >
                            {notification.status}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="action-btn"
                            title="View notification"
                            aria-label="View notification"
                            onClick={function () {
                              viewNotification(notification);
                            }}
                          >
                            <EyeIcon />
                          </button>

                          <button
                            type="button"
                            className="action-btn"
                            title="Delete notification"
                            aria-label="Delete notification"
                            onClick={function () {
                              deleteNotification(notification.id);
                            }}
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          CREATE NOTIFICATION MODAL
      ========================= */}

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeCreateModal}
        >
          <div
            className="modal"
            onClick={function (event) {
              event.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h2>Create New Notification</h2>

              <button
                type="button"
                className="close-btn"
                onClick={closeCreateModal}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* TITLE */}

              <FormField label="Notification Title">
                <input
                  type="text"
                  value={form.title}
                  onChange={function (event) {
                    updateForm("title", event.target.value);
                  }}
                  placeholder="e.g. Heavy Rain Alert for Farmers"
                  required
                />
              </FormField>

              {/* MESSAGE */}

              <FormField label="Notification Message">
                <textarea
                  value={form.message}
                  onChange={function (event) {
                    updateForm("message", event.target.value);
                  }}
                  placeholder="Enter notification message..."
                  required
                />
              </FormField>

              {/* CHANNEL */}

              <FormField label="Notification Channel">
                <div className="channels">
                  {["Push", "SMS", "Email"].map(function (channel) {
                    return (
                      <label
                        className="channel-option"
                        key={channel}
                      >
                        <input
                          type="radio"
                          name="channel"
                          value={channel}
                          checked={form.channel === channel}
                          onChange={function (event) {
                            updateForm(
                              "channel",
                              event.target.value
                            );
                          }}
                        />

                        <span>
                          {channel === "Push"
                            ? "Push Notification"
                            : channel}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </FormField>

              {/* TARGET */}

              <FormField label="Target Audience">
                <div className="target-grid">
                  {[
                    "All Users",
                    "Farmers",
                    "Dealers",
                    "FPOs",
                  ].map(function (target) {
                    return (
                      <label
                        className="target-option"
                        key={target}
                      >
                        <input
                          type="radio"
                          name="target"
                          value={target}
                          checked={form.target === target}
                          onChange={function (event) {
                            updateForm(
                              "target",
                              event.target.value
                            );
                          }}
                        />

                        {target === "FPOs"
                          ? "FPOs / Organizations"
                          : target}
                      </label>
                    );
                  })}
                </div>
              </FormField>

        

             {/* CATEGORY */}

<FormField label="Notification Category">
  <div className="custom-select">
    <button
      type="button"
      className="custom-select-button"
      onClick={function () {
        setIsCategoryOpen(function (previous) {
          return !previous;
        });
      }}
    >
      <span>{form.category}</span>

      <span
        className={
          "custom-select-arrow " +
          (isCategoryOpen ? "open" : "")
        }
      >
        ▾
      </span>
    </button>

    {isCategoryOpen && (
      <div className="custom-select-options">
        {[
          "Weather Alert",
          "Crop Advisory",
          "Market Price",
          "Government Scheme",
          "Pest & Disease",
          "Farming Tips",
          "General",
        ].map(function (category) {
          return (
            <button
              type="button"
              key={category}
              className={
                "custom-select-option " +
                (form.category === category
                  ? "selected"
                  : "")
              }
              onClick={function () {
                updateForm("category", category);
                setIsCategoryOpen(false);
              }}
            >
              {category}
            </button>
          );
        })}
      </div>
    )}
  </div>
</FormField>

              {/* LOCATION */}

              <FormField label="Target Location">
                <div className="form-row">
                  <input
                    type="text"
                    value={form.state}
                    onChange={function (event) {
                      updateForm(
                        "state",
                        event.target.value
                      );
                    }}
                    placeholder="State e.g. Maharashtra"
                  />

                  <input
                    type="text"
                    value={form.district}
                    onChange={function (event) {
                      updateForm(
                        "district",
                        event.target.value
                      );
                    }}
                    placeholder="District e.g. Akola"
                  />
                </div>
              </FormField>

              {/* SEND OPTION */}

              <FormField label="Send Option">
                <select
                  value={form.sendOption}
                  onChange={function (event) {
                    updateForm(
                      "sendOption",
                      event.target.value
                    );
                  }}
                >
                  <option value="now">Send Now</option>

                  <option value="schedule">
                    Schedule for Later
                  </option>
                </select>

                {form.sendOption === "schedule" && (
                  <div className="schedule-box">
                    <div className="form-row">
                      <input
                        type="date"
                        value={form.scheduleDate}
                        min={today}
                        onChange={function (event) {
                          updateForm(
                            "scheduleDate",
                            event.target.value
                          );
                        }}
                        required
                      />

                      <input
                        type="time"
                        value={form.scheduleTime}
                        onChange={function (event) {
                          updateForm(
                            "scheduleTime",
                            event.target.value
                          );
                        }}
                        required
                      />
                    </div>
                  </div>
                )}
              </FormField>

              {/* FOOTER */}

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