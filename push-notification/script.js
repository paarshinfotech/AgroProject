let notifications = [];

    let totalSent = 0;
    let smsSent = 0;
    let emailSent = 0;


    // Open modal
    function openModal() {

        document.getElementById("modal").style.display = "flex";

    }


    // Close modal
    function closeModal() {

        document.getElementById("modal").style.display = "none";

    }


    // Show/hide schedule fields
    function toggleSchedule() {

        const option =
            document.getElementById("sendOption").value;

        const scheduleBox =
            document.getElementById("scheduleBox");

        if (option === "schedule") {

            scheduleBox.style.display = "block";

        } else {

            scheduleBox.style.display = "none";

        }

    }


    // Form submit
    document
        .getElementById("notificationForm")
        .addEventListener("submit", function(event) {

            event.preventDefault();


            const title =
                document.getElementById("title").value;

            const message =
                document.getElementById("message").value;

            const category =
                document.getElementById("category").value;

            const state =
                document.getElementById("state").value;

            const district =
                document.getElementById("district").value;

            const sendOption =
                document.getElementById("sendOption").value;


            const channel =
                document.querySelector(
                    'input[name="channel"]:checked'
                ).value;


            const target =
                document.querySelector(
                    'input[name="target"]:checked'
                ).value;


            let date = new Date();

            let status = "Sent";


            if (sendOption === "schedule") {

                const scheduleDate =
                    document.getElementById("scheduleDate").value;

                const scheduleTime =
                    document.getElementById("scheduleTime").value;

                if (!scheduleDate || !scheduleTime) {

                    alert("Please select schedule date and time.");

                    return;

                }

                date = new Date(
                    `${scheduleDate}T${scheduleTime}`
                );

                status = "Scheduled";

            }


            const location =
                district && state
                    ? `${district}, ${state}`
                    : state || district || "All Locations";


            const notification = {

                id: Date.now(),

                title: title,

                message: message,

                type: channel,

                category: category,

                target: target,

                location: location,

                date: date,

                status: status

            };


            notifications.push(notification);


            // Update counters only when sent
            if (status === "Sent") {

                totalSent++;

                if (channel === "SMS") {
                    smsSent++;
                }

                if (channel === "Email") {
                    emailSent++;
                }

            }


            updateCards();

            renderNotifications();

            closeModal();


            document
                .getElementById("notificationForm")
                .reset();


            document.getElementById("scheduleBox")
                .style.display = "none";


            alert(
                status === "Sent"
                    ? "Notification sent successfully!"
                    : "Notification scheduled successfully!"
            );

        });


    // Update summary cards
    function updateCards() {

        document.getElementById("totalSent")
            .textContent = totalSent;

        document.getElementById("smsSent")
            .textContent = smsSent;

        document.getElementById("emailSent")
            .textContent = emailSent;


        const targets = {};

        notifications.forEach(function(notification) {

            targets[notification.target] =
                (targets[notification.target] || 0) + 1;

        });


        let mostTargeted = "All Users";
        let highest = 0;


        Object.keys(targets).forEach(function(target) {

            if (targets[target] > highest) {

                highest = targets[target];

                mostTargeted = target;

            }

        });


        document.getElementById("mostTargeted")
            .textContent = mostTargeted;

    }


    // Render history
    function renderNotifications() {

        const table =
            document.getElementById("notificationTable");

        table.innerHTML = "";


        if (notifications.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6">

                        <div class="empty-state">

                            <div class="empty-icon">
                                🔔
                            </div>

                            No notifications created yet.

                        </div>

                    </td>
                </tr>
            `;

            return;

        }


        notifications
            .slice()
            .reverse()
            .forEach(function(notification) {


                const row =
                    document.createElement("tr");


                let badgeClass =
                    notification.type.toLowerCase();


                let statusClass =
                    notification.status.toLowerCase();


                row.innerHTML = `

                    <td>

                        <div class="notification-title">
                            ${escapeHTML(notification.title)}
                        </div>

                        <div class="notification-description">
                            ${escapeHTML(notification.category)}
                            •
                            ${escapeHTML(notification.location)}
                        </div>

                    </td>


                    <td>
                        <span class="badge ${badgeClass}">
                            ${notification.type}
                        </span>
                    </td>


                    <td>
                        ${escapeHTML(notification.target)}
                    </td>


                    <td>
                        ${formatDate(notification.date)}
                    </td>


                    <td>
                        <span class="badge ${statusClass}">
                            ${notification.status}
                        </span>
                    </td>


                    <td>

                        <button
                            class="action-btn"
                            onclick="viewNotification(${notification.id})"
                            title="View"
                        >
                            👁️
                        </button>

                        <button
                            class="action-btn"
                            onclick="deleteNotification(${notification.id})"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </td>

                `;


                table.appendChild(row);

            });

    }


    // View notification
    function viewNotification(id) {

        const notification =
            notifications.find(
                n => n.id === id
            );


        if (!notification) return;


        alert(

            `Title: ${notification.title}\n\n` +

            `Message: ${notification.message}\n\n` +

            `Channel: ${notification.type}\n` +

            `Target: ${notification.target}\n` +

            `Category: ${notification.category}\n` +

            `Location: ${notification.location}\n` +

            `Status: ${notification.status}`

        );

    }


    // Delete notification
    function deleteNotification(id) {

        const notification =
            notifications.find(
                n => n.id === id
            );


        if (!notification) return;


        if (
            !confirm(
                "Are you sure you want to delete this notification?"
            )
        ) {
            return;
        }


        notifications =
            notifications.filter(
                n => n.id !== id
            );


        updateCards();

        renderNotifications();

    }


    // Format date
    function formatDate(date) {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        ).format(new Date(date));

    }


    // Prevent HTML injection
    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }
