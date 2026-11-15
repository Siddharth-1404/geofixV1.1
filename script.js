/* =========================================
   1. GLOBAL FUNCTIONS (Toast & Transitions)
   ========================================= */
function showToast(message) {
    const toastBox = document.getElementById('toast-box');
    const toastMessage = document.getElementById('toast-message');
    if (toastBox && toastMessage) {
        toastMessage.innerText = message;
        toastBox.classList.remove('hidden');
        setTimeout(() => toastBox.classList.add('hidden'), 3000);
    }
}

function goToPage(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

/* Back Button Blank Page Fix (BFCache) */
window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.body.classList.contains('page-fade-out')) {
        document.body.classList.remove('page-fade-out');
    }
});


/* =========================================
   2. SMART WORKFLOW LOGIC (AI & Location)
   ========================================= */
let finalCategory = "Plumbing"; 
let finalLocation = "Block 34, 2nd Floor"; 

function startAIFlow() {
    const uploadBox = document.getElementById('upload-box');
    const uploadContent = document.getElementById('upload-content');
    const aiProcessing = document.getElementById('ai-processing');
    const aiReviewBox = document.getElementById('ai-review-box');
    
    if(!uploadBox) return; 
    
    uploadContent.classList.add('hidden');
    aiProcessing.classList.remove('hidden');
    uploadBox.style.borderColor = "var(--amber-solid)";
    
    setTimeout(() => {
        uploadBox.classList.add('hidden'); 
        aiReviewBox.classList.remove('hidden'); 
    }, 2500);
}

function confirmAI() {
    const actions = document.getElementById('ai-actions');
    if(actions) {
        actions.innerHTML = `<span style="color: #10B981; font-weight: 600; font-size: 13px;">✓ Category Confirmed by User</span>`;
        showToast("Category locked successfully.");
    }
}

function editManual() {
    document.getElementById('ai-review-box').classList.add('hidden');
    document.getElementById('manual-category-box').classList.remove('hidden');
}

function setLoc(type) {
    const btnQR = document.getElementById('btn-qr');
    const btnGPS = document.getElementById('btn-gps');
    const qrResult = document.getElementById('qr-result');
    const gpsResult = document.getElementById('gps-result');

    if (!btnQR) return; 

    if (type === 'QR') {
        btnQR.classList.add('active');
        btnGPS.classList.remove('active');
        qrResult.classList.remove('hidden');
        gpsResult.classList.add('hidden');
        finalLocation = "Block 34, 2nd Floor";
    } else {
        btnGPS.classList.add('active');
        btnQR.classList.remove('active');
        qrResult.classList.add('hidden');
        
        gpsResult.innerHTML = "Fetching Satellites... ⏳";
        gpsResult.classList.remove('hidden');
        
        setTimeout(() => {
            gpsResult.innerHTML = `<span style="margin-right: 8px;">🛰️</span> GPS Locked: Near Main Library (Lat: 28.53, Lng: 77.39)`;
            finalLocation = "Near Main Library";
        }, 1500);
    }
}

function submitSmartTicket() {
    const submitBtn = document.getElementById('final-submit-btn');
    if(!submitBtn) return;
    
    submitBtn.innerHTML = 'Routing Ticket... ⏳';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        showToast(`✅ Submitted at: ${finalLocation}. Points pending verification.`);
        submitBtn.innerHTML = '✓ Ticket Submitted';
        submitBtn.style.background = '#10B981';
        submitBtn.style.color = '#fff';
    }, 1500);
}


/* =========================================
   3. PAGE LOAD LOGIC (Login, Theme, Pills)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Logic
    const themeBtn = document.getElementById('theme-btn');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if(themeBtn) themeBtn.innerHTML = '☾';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                themeBtn.innerHTML = '☾';
                localStorage.setItem('theme', 'dark');
            } else {
                themeBtn.innerHTML = '☼';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Smart Login Form Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const submitBtn = loginForm.querySelector('.btn-submit'); 
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const usernameInput = document.getElementById('username').value.trim().toLowerCase();
            
            showToast("Verifying your details...");
            submitBtn.innerHTML = 'Verifying... ⏳';
            submitBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                sessionStorage.setItem('loggedInUser', usernameInput);
                document.body.classList.add('page-fade-out');
                
                setTimeout(() => {
                    if (usernameInput.includes('warden') || usernameInput.includes('incharge') || usernameInput.includes('admin') || usernameInput.includes('welfare')) {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 500); 
            }, 1500);
        });
    }

    // Welcome Text Logic
    const welcomeText = document.getElementById('welcome-text');
    if (welcomeText) {
        const savedUser = sessionStorage.getItem('loggedInUser');
        if (savedUser) {
            const formattedName = savedUser.charAt(0).toUpperCase() + savedUser.slice(1);
            welcomeText.innerText = "Welcome, " + formattedName;
            welcomeText.style.display = "inline-block";
        }
    }

    // Category Pills Logic
    const catPills = document.querySelectorAll('.cat-pill');
    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            catPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            finalCategory = pill.innerText;
        });
    });
});


/* =========================================
   4. ADMIN PANEL & SMART ROUTING LOGIC 
   ========================================= */
let ticketData = [
    { id: "TKT-101", issue: "Water Cooler Pipe Leakage", category: "Plumbing", location: "Block 34, 2nd Fl", reporter: "Siddharth (RK2P26BZB51)", status: "Pending" },
    { id: "TKT-102", issue: "Broken Corridor Light", category: "Electrical", location: "Hostel B7, Ground Fl", reporter: "Snigdha (RK2P26B123)", status: "Resolved" },
    { id: "TKT-103", issue: "AC Not Cooling", category: "Electrical", location: "Lab 4, Block 28", reporter: "Roshan (RK2P26B456)", status: "Pending" },
    { id: "TKT-104", issue: "Projector Cable Missing", category: "IT", location: "Room 102, Block 34", reporter: "Aman (RK2P26B789)", status: "Pending" }
];

const tableBody = document.getElementById('ticket-table-body');
const statusFilter = document.getElementById('status-filter');

if (tableBody) {
    renderTable(ticketData);
    
    if(statusFilter) {
        statusFilter.addEventListener('change', function() {
            let selectedStatus = this.value;
            if (selectedStatus === 'All') {
                renderTable(ticketData); 
            } else {
                renderTable(ticketData.filter(t => t.status === selectedStatus));
            }
        });
    }
}

function renderTable(dataArray) {
    if (!tableBody) return;
    tableBody.innerHTML = ""; 
    
    let currentUser = sessionStorage.getItem('loggedInUser') || 'admin';
    let filteredData = dataArray;
    let pageTitle = document.querySelector('h2'); 
    let ideasSection = document.getElementById('welfare-ideas-section'); 
    let maintenanceWrapper = document.getElementById('maintenance-only'); 
    
    // Flexible Smart Routing
    if (currentUser.includes('warden')) { 
        filteredData = dataArray.filter(t => t.location.includes('Hostel B7') || t.location.includes('BH'));
        if(pageTitle) pageTitle.innerText = "Hostel BH7 - Warden Dashboard";
        if(ideasSection) ideasSection.style.display = "none"; 
        if(maintenanceWrapper) maintenanceWrapper.style.display = "block";
        
    } else if (currentUser.includes('incharge')) {
        filteredData = dataArray.filter(t => t.location.includes('Block 34'));
        if(pageTitle) pageTitle.innerText = "Block 34 - Admin Dashboard";
        if(ideasSection) ideasSection.style.display = "none";
        if(maintenanceWrapper) maintenanceWrapper.style.display = "block";
        
    } else if (currentUser.includes('welfare')) {
        filteredData = []; // Welfare Wing sees no complaints
        if(pageTitle) pageTitle.innerText = "Student Welfare Wing Dashboard";
        if(maintenanceWrapper) maintenanceWrapper.style.display = "none"; 
        if(ideasSection) ideasSection.style.display = "block"; 
        
    } else {
        // Super Admin (Default Master Dashboard)
        if(pageTitle) pageTitle.innerText = "University Master Dashboard";
        if(ideasSection) ideasSection.style.display = "none"; 
        if(maintenanceWrapper) maintenanceWrapper.style.display = "block";
    }

    // Render Rows
    filteredData.forEach((ticket) => {
        let originalIndex = ticketData.indexOf(ticket); 
        let statusBadge = ticket.status === 'Pending' 
            ? `<span class="step-status text-amber">Pending</span>` 
            : `<span class="step-status text-green">Resolved</span>`;
            
        let actionButton = ticket.status === 'Pending'
            ? `<button class="btn-resolve no-print" onclick="resolveTicket(${originalIndex})">✓ Resolve</button>`
            : `<span class="text-gray no-print" style="font-size:12px;">Resolved</span>`;

        let rowHTML = `
            <tr>
                <td class="text-bold">${ticket.id}</td>
                <td>${ticket.issue}</td>
                <td><span class="badge-outline" style="font-size:10px;">${ticket.category}</span></td>
                <td>${ticket.location}</td>
                <td><span class="light-text" style="font-size:12px;">${ticket.reporter}</span></td>
                <td>${statusBadge}</td>
                <td class="no-print">${actionButton}</td>
            </tr>
        `;
        tableBody.innerHTML += rowHTML;
    });

    // KPI numbers ko bhi filtered data ke hisab se set karo
    updateKPIs(filteredData);
}

function updateKPIs(currentData) {
    if(!document.getElementById('kpi-total')) return;
    let total = currentData.length;
    let resolved = currentData.filter(t => t.status === "Resolved").length;
    document.getElementById('kpi-total').innerText = total;
    document.getElementById('kpi-pending').innerText = total - resolved;
    document.getElementById('kpi-resolved').innerText = resolved;
}

function resolveTicket(index) {
    ticketData[index].status = "Resolved";
    showToast(`${ticketData[index].id} resolved!`);
    
    let currentFilter = statusFilter.value;
    if (currentFilter === 'All') {
        renderTable(ticketData);
    } else {
        renderTable(ticketData.filter(t => t.status === currentFilter));
    }
}


/* =========================================
   5. TUTORIAL MODAL LOGIC
   ========================================= */
const tutorialBtn = document.getElementById('tutorial-btn');
const tutorialModal = document.getElementById('tutorial-modal');
const closeTutorial = document.getElementById('close-tutorial');

if (tutorialBtn && tutorialModal && closeTutorial) {
    tutorialBtn.addEventListener('click', () => {
        tutorialModal.classList.add('active');
    });
    closeTutorial.addEventListener('click', () => {
        tutorialModal.classList.remove('active');
    });
    tutorialModal.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.classList.remove('active');
        }
    });
}


/* =========================================
   6. FEED PAGE LOGIC (Proposal & Upvotes)
   ========================================= */
function toggleProposalForm() {
    let form = document.getElementById("proposal-form");
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

function simpleUpvote(cardNumber) {
    let countElement = document.getElementById("vote-count-" + cardNumber);
    if (!countElement) return;

    let currentVotes = parseInt(countElement.innerText);
    
    if (currentVotes < 50) {
        currentVotes = currentVotes + 1; 
        countElement.innerText = currentVotes; 
        
        if (currentVotes === 50) {
            alert("Success! Initiative is ready for Official Review.");
            countElement.style.color = "#3B82F6"; 
        }
    }
}