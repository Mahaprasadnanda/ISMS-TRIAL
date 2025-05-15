const noticeList = [
    {
        id: "N1001",
        title: "Welcome to the New Academic Year",
        content: "We are excited to welcome all students to the new academic year. Please ensure you have completed your registration process.",
        dateTime: "2024-03-15 14:30",
        attention: "All Students",
        from: "Director"
    },
    {
        id: "N1002",
        title: "Holiday Notice",
        content: "The institute will remain closed on March 20, 2024, due to a public holiday.",
        dateTime: "2024-03-14 10:15",
        attention: "All Students & Faculty",
        from: "Administration"
    },
    {
        id: "N1003",
        title: "Upcoming Workshop",
        content: "A workshop on 'Advanced Programming Techniques' will be held on March 25, 2024. All interested students are encouraged to attend.",
        dateTime: "2024-03-13 16:45",
        attention: "B.Tech CSE",
        from: "CSE Department"
    },
    {
        id: "N1004",
        title: "Sports Meet Registration",
        content: "Annual Sports Meet registration is now open. All students are encouraged to participate in various events.",
        dateTime: "2024-03-12 09:30",
        attention: "All Students",
        from: "Sports Department"
    },
    {
        id: "N1005",
        title: "Library Maintenance",
        content: "The central library will be closed for maintenance from March 18-20, 2024. Please plan your studies accordingly.",
        dateTime: "2024-03-11 15:20",
        attention: "All Students & Faculty",
        from: "Library"
    },
    {
        id: "N1006",
        title: "Placement Drive",
        content: "Tech giants will be visiting campus for recruitment on March 28, 2024. Eligible students should register by March 25.",
        dateTime: "2024-03-10 11:45",
        attention: "Final Year Students",
        from: "Placement Cell"
    },
    {
        id: "N1007",
        title: "Hostel Fee Payment",
        content: "Last date for hostel fee payment is March 22, 2024. Late payment will incur additional charges.",
        dateTime: "2024-03-09 13:15",
        attention: "Hostel Residents",
        from: "Administration"
    },
    {
        id: "N1008",
        title: "Research Paper Submission",
        content: "Deadline for research paper submission for the annual technical symposium is extended to March 30, 2024.",
        dateTime: "2024-03-08 16:00",
        attention: "Research Scholars",
        from: "Research Department"
    },
    {
        id: "N1009",
        title: "Campus WiFi Maintenance",
        content: "Campus WiFi will be unavailable for maintenance on March 17, 2024, from 2 AM to 6 AM.",
        dateTime: "2024-03-07 14:30",
        attention: "All Users",
        from: "IT Department"
    },
    {
        id: "N1010",
        title: "Cultural Fest Registration",
        content: "Registration for the annual cultural fest 'TechnoVibes' is now open. Last date to register is March 23, 2024.",
        dateTime: "2024-03-06 10:00",
        attention: "All Students",
        from: "Cultural Committee"
    }
];

function renderNotices() {
    const listEl = document.getElementById("noticeList");
    const noMsg = document.getElementById("noNoticeMessage");
    listEl.innerHTML = "";

    if (noticeList.length === 0) {
        noMsg.style.display = "block";
    } else {
        noMsg.style.display = "none";
        noticeList.forEach(notice => {
            const div = document.createElement("div");
            div.className = "notice-item";
            div.innerHTML = `
                <div class="notice-content">
                    <div class="notice-title">${notice.title}</div>
                    <div class="notice-meta">
                        <span><i class="fas fa-clock"></i> ${notice.dateTime}</span>
                    </div>
                </div>
                <div class="notice-sender">
                    <span><i class="fas fa-user"></i> By: ${notice.from}</span>
                </div>
            `;
            div.onclick = () => showNoticeDetails(notice);
            listEl.appendChild(div);
        });
    }
}

function showNoticeDetails(notice) {
    document.getElementById("noticePopupID").innerText = notice.id;
    document.getElementById("noticePopupTitle").innerText = notice.title;
    document.getElementById("noticePopupDateTime").innerText = notice.dateTime;
    document.getElementById("noticePopupAttention").innerText = notice.attention;
    document.getElementById("noticePopupContent").innerText = notice.content;
    
    const documentRow = document.getElementById("noticeDocumentRow");
    if (notice.document) {
        documentRow.style.display = "grid";
        document.getElementById("noticePopupDocument").innerText = notice.document;
    } else {
        documentRow.style.display = "none";
    }

    document.getElementById("noticeDetailsPopup").style.display = "flex";
    document.getElementById("noticePopupOverlay").style.display = "block";
}

function closeNoticeDetailsPopup() {
    document.getElementById("noticeDetailsPopup").style.display = "none";
    document.getElementById("noticePopupOverlay").style.display = "none";
}

function openNoticePopup() {
    document.getElementById("noticePopupOverlay").style.display = "block";
    document.getElementById("noticePopup").style.display = "flex";
}

function closeNoticePopup() {
    document.getElementById("noticePopupOverlay").style.display = "none";
    document.getElementById("noticePopup").style.display = "none";
}

document.getElementById("postNoticeBtn").addEventListener("click", openNoticePopup);

document.getElementById("noticeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("noticeTitle").value;
    const content = document.getElementById("noticeContent").value;
    const newNotice = {
        id: "N" + (noticeList.length + 1001),
        title: title,
        content: content,
        dateTime: new Date().toLocaleString()
    };
    noticeList.push(newNotice);
    renderNotices();
    closeNoticePopup();
    document.getElementById("noticeTitle").value = "";
    document.getElementById("noticeContent").value = "";
});

// Add event listener for closing the notice details popup
document.getElementById("closeNoticeDetailsBtn").addEventListener("click", closeNoticeDetailsPopup);

// Add event listener for closing the notice popup
document.getElementById("closeNoticePopupBtn").addEventListener("click", closeNoticePopup);

// Initial render
renderNotices(); 