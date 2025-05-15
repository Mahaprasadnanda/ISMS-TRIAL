const grievanceList = [
    {
        id: "G1001",
        from: "Student - S2001",
        to: "Director",
        dateTime: "2024-03-15 14:30",
        subject: "Request for Additional Study Materials",
        description: "I would like to request additional study materials for the Advanced Algorithms course. The current materials are not sufficient for understanding complex topics.",
        status: "Pending",
        forwardingChain: []
    },
    {
        id: "G1002",
        from: "Faculty - F1001",
        to: "Admin",
        dateTime: "2024-03-14 10:15",
        subject: "Classroom Equipment Issue",
        description: "The projector in Room 302 is not working properly. It needs immediate attention as it affects the teaching process.",
        status: "In Progress",
        forwardingChain: [
            {
                from: "Faculty - F1001",
                to: "Admin",
                reason: "Issue could not be resolved at faculty level, needs admin intervention.",
                timestamp: "2024-03-14T10:20:00"
            },
            {
                from: "Admin",
                to: "Director",
                reason: "Admin approval required for equipment replacement.",
                timestamp: "2024-03-14T11:00:00"
            }
        ]
    },
    {
        id: "G1003",
        from: "Student - S2002",
        to: "Faculty - F1002",
        dateTime: "2024-03-13 16:45",
        subject: "Assignment Deadline Extension",
        description: "Due to technical issues with my laptop, I request an extension for the Data Structures assignment deadline.",
        status: "Resolved",
        forwardingChain: [
            {
                from: "Student - S2002",
                to: "Faculty - F1002",
                reason: "Initial request for extension.",
                timestamp: "2024-03-13T16:45:00"
            },
            {
                from: "Faculty - F1002",
                to: "Dean",
                reason: "Faculty recommends extension due to valid reason.",
                timestamp: "2024-03-13T17:00:00"
            }
        ]
    }
];

const searchGrievance = () => {
    const id = document.getElementById("searchGrievanceID").value.toLowerCase();
    const from = document.getElementById("searchFrom").value.toLowerCase();
    const status = document.getElementById("searchStatus").value;

    const listEl = document.getElementById("grievanceList");
    const noMsg = document.getElementById("noGrievanceMessage");
    listEl.innerHTML = "";

    const result = grievanceList.filter(g =>
        g.id.toLowerCase().includes(id) &&
        g.from.toLowerCase().includes(from) &&
        (status === "" || g.status === status)
    );

    if (result.length === 0) {
        noMsg.style.display = "block";
    } else {
        noMsg.style.display = "none";
        result.forEach(grievance => {
            const div = document.createElement("div");
            div.className = "grievance-item";
            div.innerHTML = `
                <span class="grievance-id">${grievance.id}</span>
                <div class="grievance-content">
                    <div class="grievance-subject">${grievance.subject}</div>
                    <div class="grievance-meta">
                        <span>${grievance.from}</span>
                        ${grievance.forwardedFrom ? `<span class="forwarded-from">Forwarded from: ${grievance.forwardedFrom}</span>` : ''}
                        <span>${grievance.dateTime}</span>
                    </div>
                </div>
                <span class="status-badge status-${grievance.status.toLowerCase().replace(' ', '-')}">${grievance.status}</span>
            `;
            div.onclick = () => showGrievanceDetails(grievance);
            listEl.appendChild(div);
        });
    }
};

const showGrievanceDetails = (grievance) => {
    document.getElementById("popupTitle").innerText = grievance.subject;
    document.getElementById("popupID").innerText = grievance.id;
    document.getElementById("popupFrom").innerText = grievance.from;
    document.getElementById("popupTo").innerText = grievance.to;
    
    // Handle forwarded from display
    const forwardedFromRow = document.getElementById("forwardedFromRow");
    const popupForwardedFrom = document.getElementById("popupForwardedFrom");
    const forwardingChainRow = document.getElementById("forwardingChainRow");
    const forwardingChain = document.getElementById("forwardingChain");
    
    if (grievance.forwardedFrom) {
        forwardedFromRow.style.display = "grid";
        popupForwardedFrom.innerText = grievance.forwardedFrom;
    } else {
        forwardedFromRow.style.display = "none";
    }

    // Display forwarding chain
    if (grievance.forwardingChain && grievance.forwardingChain.length > 0) {
        forwardingChainRow.style.display = "grid";
        forwardingChain.innerHTML = grievance.forwardingChain.map(forward => `
            <div class="forwarding-chain-item">
                <div class="forward-details">
                    <div>
                        <span class="forward-from">${forward.from}</span>
                        <span class="forward-arrow">→</span>
                        <span class="forward-to">${forward.to}</span>
                    </div>
                    <div class="forward-time">${new Date(forward.timestamp).toLocaleString()}</div>
                    <div class="forward-reason">${forward.reason}</div>
                </div>
            </div>
        `).join('');
    } else {
        forwardingChainRow.style.display = "grid";
        forwardingChain.innerHTML = '';
    }

    // Setup new forward chain UI
    setupForwardChainUI(grievance);
    
    document.getElementById("popupDateTime").innerText = grievance.dateTime;
    document.getElementById("popupSubject").innerText = grievance.subject;
    document.getElementById("popupDescription").innerText = grievance.description;
    document.getElementById("popupStatus").innerText = grievance.status;
    document.getElementById("popupStatus").className = `status-badge status-${grievance.status.toLowerCase().replace(' ', '-')}`;
    
    const resolutionRow = document.getElementById("resolutionRow");
    const resolutionText = document.getElementById("resolutionText");
    const resolveBtn = document.querySelector(".resolve-btn");
    const forwardChainBtn = document.getElementById("forwardChainBtn");
    if (grievance.status === "Resolved") {
        resolutionRow.style.display = "grid";
        resolutionText.value = grievance.resolution || "";
        resolutionText.disabled = true;
        resolveBtn.style.display = "none";
        forwardChainBtn.style.display = "none";
    } else {
        resolutionRow.style.display = "grid";
        resolutionText.value = "";
        resolutionText.disabled = false;
        resolveBtn.style.display = "block";
        forwardChainBtn.style.display = "inline-flex";
    }

    document.getElementById("grievancePopup").style.display = "flex";
    document.getElementById("popupOverlay").style.display = "block";
};

const resolveGrievance = () => {
    const resolution = document.getElementById("resolutionText").value.trim();
    if (!resolution) {
        alert("Please enter resolution details before resolving the grievance.");
        return;
    }

    const id = document.getElementById("popupID").innerText;
    const grievance = grievanceList.find(g => g.id === id);
    if (grievance) {
        grievance.status = "Resolved";
        grievance.resolution = resolution;
        closePopup();
        searchGrievance(); // Refresh the list
    }
};

const closePopup = () => {
    document.getElementById("grievancePopup").style.display = "none";
    document.getElementById("popupOverlay").style.display = "none";
};

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("show");
});

document.addEventListener("click", (e) => {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("menuToggle");
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove("show");
    }
});

// Initial load
searchGrievance();

// Add event listeners for the new forward chain button and dropdown
function setupForwardChainUI(grievance) {
    const forwardChainBtn = document.getElementById('forwardChainBtn');
    const forwardChainDropdown = document.getElementById('forwardChainDropdown');
    const forwardReasonSection = document.getElementById('forwardReasonSection');
    const forwardChainReason = document.getElementById('forwardChainReason');
    const forwardChainConfirmBtn = document.getElementById('forwardChainConfirmBtn');

    // Hide dropdown and reason section initially
    forwardChainDropdown.classList.remove('active');
    forwardReasonSection.style.display = 'none';
    forwardChainReason.value = '';

    let selectedAuthority = '';

    // Toggle dropdown
    forwardChainBtn.onclick = function(e) {
        e.stopPropagation();
        forwardChainDropdown.classList.toggle('active');
        forwardChainBtn.classList.toggle('open');
        forwardReasonSection.style.display = 'none';
    };

    // Hide dropdown if clicking outside
    document.addEventListener('click', function hideDropdown(e) {
        if (!forwardChainBtn.contains(e.target) && !forwardChainDropdown.contains(e.target)) {
            forwardChainDropdown.classList.remove('active');
            forwardChainBtn.classList.remove('open');
            forwardReasonSection.style.display = 'none';
        }
    }, { once: true });

    // Handle dropdown option click
    Array.from(forwardChainDropdown.getElementsByClassName('dropdown-option')).forEach(option => {
        option.onclick = function(e) {
            selectedAuthority = option.getAttribute('data-value');
            forwardChainDropdown.classList.remove('active');
            forwardReasonSection.style.display = 'flex';
            forwardChainReason.value = '';
        };
    });

    // Handle confirm forward
    forwardChainConfirmBtn.onclick = function() {
        const reason = forwardChainReason.value.trim();
        if (!selectedAuthority) {
            alert('Please select an authority to forward to.');
            return;
        }
        if (!reason) {
            alert('Please provide a reason for forwarding.');
            return;
        }
        // Add to forwarding chain
        grievance.forwardingChain.push({
            from: grievance.to,
            to: selectedAuthority.charAt(0).toUpperCase() + selectedAuthority.slice(1),
            reason: reason,
            timestamp: new Date().toISOString()
        });
        grievance.forwardedFrom = grievance.to;
        grievance.to = selectedAuthority.charAt(0).toUpperCase() + selectedAuthority.slice(1);
        grievance.status = 'Forwarded';
        // Refresh popup
        showGrievanceDetails(grievance);
        // Hide reason section
        forwardReasonSection.style.display = 'none';
        // Refresh list
        searchGrievance();
    };
}

function addToForwardingHistory(forwardEntry) {
    const historyContainer = document.getElementById('forwardingHistory');
    const entryElement = document.createElement('div');
    entryElement.className = 'forward-entry';
    entryElement.innerHTML = `
        <strong>From:</strong> ${forwardEntry.from}<br>
        <strong>To:</strong> ${forwardEntry.to}<br>
        <strong>Reason:</strong> ${forwardEntry.reason}<br>
        <strong>Time:</strong> ${new Date(forwardEntry.timestamp).toLocaleString()}
    `;
    historyContainer.appendChild(entryElement);
}

function updateGrievanceStatus(grievanceId, newStatus) {
    // Update the status in the UI
    document.getElementById('popupStatus').textContent = newStatus;
    
    // Update the status in the grievance list
    const grievanceItems = document.querySelectorAll('.grievance-item');
    grievanceItems.forEach(item => {
        if (item.dataset.id === grievanceId) {
            const statusBadge = item.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = newStatus;
                statusBadge.className = `status-badge ${newStatus.toLowerCase().replace(' ', '-')}`;
            }
        }
    });
}

// Modify the existing openPopup function to show forwarding history
function openPopup(grievance) {
    // ... existing popup opening code ...
    
    // Show forwarding section if grievance is not resolved
    const forwardSection = document.getElementById('forwardSection');
    if (grievance.status !== 'Resolved') {
        forwardSection.classList.add('active');
    } else {
        forwardSection.classList.remove('active');
    }
    
    // Display forwarding history if it exists
    const historyContainer = document.getElementById('forwardingHistory');
    historyContainer.innerHTML = ''; // Clear existing history
    
    if (grievance.forwardingHistory && grievance.forwardingHistory.length > 0) {
        grievance.forwardingHistory.forEach(entry => {
            addToForwardingHistory(entry);
        });
    }
}

// Utility function to remove the last forward chain entry for a grievance
function removeLastForwardChain(grievance) {
    if (grievance.forwardingChain && grievance.forwardingChain.length > 0) {
        grievance.forwardingChain.pop();
        // Optionally update forwardedFrom and to fields
        if (grievance.forwardingChain.length > 0) {
            const last = grievance.forwardingChain[grievance.forwardingChain.length - 1];
            grievance.forwardedFrom = last.from;
            grievance.to = last.to;
        } else {
            grievance.forwardedFrom = undefined;
            // Optionally reset 'to' to original
        }
    }
}

// Remove last forward chain from G1002 as an example
const g1002 = grievanceList.find(g => g.id === "G1002");
if (g1002) {
    removeLastForwardChain(g1002);
} 