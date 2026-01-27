/* =========================
   CONFIGURATION
========================= */
const CONFIG = {
    owner: "athergb",
    repo: "discountsheet",
    filePath: "data.json",
    adminPassword: "admin123"
};

/* =========================
   STATE
========================= */
let data = [];
let sha = "";
let isEditor = false;
let resourcesFolder = "resources"; // Folder name on GitHub

/* =========================
   LOAD DATA (Read-Only Public)
========================= */
async function loadData() {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load data");
        
        const json = await res.json();
        sha = json.sha; 
        const content = atob(json.content);
        data = JSON.parse(content);
        
        render();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading data. Please check your Internet connection.");
    }
}

/* =========================
   SAVE DATA (Requires Token)
========================= */
async function saveToGitHub() {
    const token = prompt("Enter your GitHub Token to Save:");
    if (!token) return;

    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    const contentBase64 = btoa(JSON.stringify(data, null, 2));

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Update discount sheet",
                content: contentBase64,
                sha: sha
            })
        });

        if (!res.ok) throw new Error("Failed to save");
        
        const json = await res.json();
        sha = json.content.sha; // UPDATE: Ensures we keep the latest SHA so next save doesn't fail
        alert("Saved Successfully!");
        render();
    } catch (error) {
        console.error("Error saving:", error);
        alert("Error saving. Please check your Token permissions.");
    }
}

/* =========================
   RENDER UI
========================= */
function render() {
    const cashGrid = document.getElementById("cashGrid");
    const creditGrid = document.getElementById("creditGrid");
    if(!cashGrid || !creditGrid) return;

    cashGrid.innerHTML = "";
    creditGrid.innerHTML = "";

    const today = new Date();
    today.setHours(0,0,0,0);

    data.forEach((item, index) => {
        const d = new Date(item.validity);
        const expired = d < today ? "expired" : "";
        const categoryGrid = item.category === "cash" ? cashGrid : creditGrid;

        const actionHtml = isEditor 
            ? `<div class="actions">
                 <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
                 <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
               </div>` 
            : "";

        const card = document.createElement("div");
        card.className = "card";

        card.setAttribute("data-note", item.instructions || "");
       
        card.innerHTML = `
           <div class="discount">${item.discount}</div>
            ${item.logo ? `<img src="${item.logo}">` : ""}
            <p><b>${item.airline}</b></p>
            <p class="note-text">${item.note}</p>
            ${item.notification ? `<div class="alert-box">${item.notification}</div>` : ""}
            <p class="validity ${expired}">Valid till: ${d.toLocaleDateString('en-GB')}</p>
            ${actionHtml}
        `;
        categoryGrid.appendChild(card);
    });

    // Load Resources List
    loadResources();
}

/* =========================
   AUTHENTICATION & MODALS
========================= */
function showLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error("Login Modal not found in HTML.");
        alert("Error: The Login Modal code is missing from your HTML file.");
    }
}

function showAddModal() {
    const modal = document.getElementById("formModal");
    if (modal) {
        document.getElementById("inpCategory").value = "cash";
        document.getElementById("inpAirline").value = "";
        document.getElementById("inpDiscount").value = "";
        document.getElementById("inpLogo").value = "";
        document.getElementById("inpNote").value = "";
        document.getElementById("inpNotice").value = "";
        document.getElementById("inpValidity").value = "";
        document.getElementById("inpInstructions").value = "";
        document.getElementById("editIndex").value = ""; 
        
        document.getElementById("modalTitle").innerText = "Add Airline";
        
        modal.style.display = "block";
    }
}

function editEntry(index) {
    const item = data[index]; 
    
    // Fill the form with existing data
    document.getElementById("inpCategory").value = item.category;
    document.getElementById("inpAirline").value = item.airline;
    document.getElementById("inpDiscount").value = item.discount;
    document.getElementById("inpLogo").value = item.logo || "";
    document.getElementById("inpNote").value = item.note || "";
    document.getElementById("inpNotice").value = item.notification || "";
    document.getElementById("inpValidity").value = item.validity;
    document.getElementById("inpInstructions").value = item.instructions || "";
    
    // Set the hidden index so saveData knows to UPDATE, not ADD
    document.getElementById("editIndex").value = index;
    
    document.getElementById("modalTitle").innerText = "Edit Airline";
    
    // Show the modal
    document.getElementById("formModal").style.display = "block";
}

function closeModals() {
    const loginModal = document.getElementById("loginModal");
    const formModal = document.getElementById("formModal");
    const calcModal = document.getElementById("calcModal");
    
    if (loginModal) loginModal.style.display = "none";
    if (formModal) formModal.style.display = "none";
    if (calcModal) calcModal.style.display = "none";
}

function checkPassword() {
    const input = document.getElementById("adminPassword");
    if(!input) return alert("Input field not found");
    
    const pass = input.value;
    
    if (pass === CONFIG.adminPassword) {
        isEditor = true;
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
        document.getElementById("addBtn").style.display = "inline-block";
        
        closeModals();
        render(); // Refresh to show delete/upload options
        alert("Welcome Admin!");
    } else {
        alert("Incorrect Password");
    }
}

function logout() {
    isEditor = false;
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("addBtn").style.display = "none";
    render();
}

/* =========================
   CRUD ACTIONS
========================= */
function deleteEntry(index) {
    if(!confirm("Are you sure you want to delete this entry?")) return;
    data.splice(index, 1);
    saveToGitHub();
}

function saveData() {
    const category = document.getElementById("inpCategory").value;
    const airline = document.getElementById("inpAirline").value;
    const discount = document.getElementById("inpDiscount").value;
    const logo = document.getElementById("inpLogo").value;
    const note = document.getElementById("inpNote").value;
    const notification = document.getElementById("inpNotice").value;
    const validity = document.getElementById("inpValidity").value;
    const instructions = document.getElementById("inpInstructions").value;
    const editIndex = document.getElementById("editIndex").value;

    if (!airline || !validity) return alert("Airline Name and Validity Date are required");

    const entry = { category, airline, discount, logo, note, notification, validity, instructions };

    if (editIndex !== "") {
        data[parseInt(editIndex)] = entry;
    } else {
        data.push(entry);
    }

    saveToGitHub();
    closeModals();
}

/* =========================
   JPG EXPORT
========================= */
async function saveAsJPG() {
  const sheet = document.getElementById("sheet");
  const headerBtns = document.querySelector(".header-controls");
  const bottomBtns = document.querySelector(".bottom-actions");
  if(headerBtns) headerBtns.style.display = "none";
  if(bottomBtns) bottomBtns.style.display = "none";

  const clone = sheet.cloneNode(true);
  clone.style.width = "1100px";
  clone.style.margin = "0 auto";
  clone.style.background = "#ffffff";

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  const canvas = await html2canvas(clone, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  document.body.removeChild(wrapper);
  if(headerBtns) headerBtns.style.display = "flex";
  if(bottomBtns) bottomBtns.style.display = "block";

  const img = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "QFC-Discount-Sheet.jpg";
  link.href = img;
  link.click();
}

async function saveForWhatsApp() {
  const sheet = document.getElementById("sheet");
  const headerBtns = document.querySelector(".header-controls");
  const bottomBtns = document.querySelector(".bottom-actions");
  if(headerBtns) headerBtns.style.display = "none";
  if(bottomBtns) bottomBtns.style.display = "none";

  const clone = sheet.cloneNode(true);
  clone.style.width = "900px";
  clone.style.background = "#ffffff";

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  const canvas = await html2canvas(clone, {
    scale: 1.5,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  document.body.removeChild(wrapper);
  if(headerBtns) headerBtns.style.display = "flex";
  if(bottomBtns) bottomBtns.style.display = "block";

  const img = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "QFC-WhatsApp.jpg";
  link.href = img;
  link.click();
}

/* =========================
   CALCULATOR LOGIC (FIXED TYPO)
========================= */

function openCalculator() {
    const select = document.getElementById("calcAirline");
    select.innerHTML = '<option value="">-- Select Airline --</option>';
    
    // Populate unique airlines from data
    data.forEach(item => {
        const option = document.createElement("option");
        let discValue = item.discount || "0";
        option.value = discValue;
        
        let label = item.airline;
        if (item.notification) {
            label += ` (${item.notification})`; 
        }
        
        option.text = label;
        select.appendChild(option);
    });

    document.getElementById("calcModal").style.display = "block";
}

function calculatePSF() {
    const airlineSelect = document.getElementById("calcAirline");
    const discountStr = airlineSelect.options[airlineSelect.selectedIndex].value;
    
    const adultBaseInput = parseFloat(document.getElementById("calcBasic").value) || 0;
    const tax = parseFloat(document.getElementById("calcTax").value) || 0;

    if(!discountStr || discountStr === "0") {
        updateRow(adultBaseInput, tax, "dispDiscAdult", "dispTotalAdult");
        updateRow(adultBaseInput * 0.75, tax, "dispDiscChild", "dispTotalChild");
        updateRow(adultBaseInput * 0.10, tax, "dispDiscInfant", "dispTotalInfant");
        return;
    }

    // --- CALCULATE FOR ADULT (100%) ---
    calculateSingleRow(adultBaseInput, discountStr, tax, "dispDiscAdult", "dispTotalAdult");

    // --- CALCULATE FOR CHILD (75%) ---
    const childBase = adultBaseInput * 0.75;
    calculateSingleRow(childBase, discountStr, tax, "dispDiscChild", "dispTotalChild");

    // --- CALCULATE FOR INFANT (10%) ---
    const infantBase = adultBaseInput * 0.10;
    calculateSingleRow(infantBase, discountStr, tax, "dispDiscInfant", "dispTotalInfant");
}

function updateRow(baseFare, tax, discId, totalId) {
    const discEl = document.getElementById(discId);
    const totalEl = document.getElementById(totalId);
    
    if(discEl && totalEl) {
        discEl.innerText = "No Discount";
        totalEl.innerText = (baseFare + tax).toLocaleString('en-GB', { minimumFractionDigits: 0 }) + " PKR";
    }
}

function calculateSingleRow(baseFare, discountStr, tax, discId, totalId) {
    let discountAmt = 0;
    let displayText = "";

    // PARSE DISCOUNT STRING
    if (discountStr.includes("%")) {
        let num = parseFloat(discountStr.replace(/[^0-9.-]/g, ''));
        if(!isNaN(num)) {
            discountAmt = (baseFare * num) / 100;
            displayText = `${discountStr} (${discountAmt.toFixed(2)})`;
        }
    } else if (discountStr.includes("PKR")) {
        let num = parseFloat(discountStr.replace(/[^0-9.-]/g, ''));
        if(!isNaN(num)) {
            discountAmt = num;
            displayText = discountStr;
        }
    } else {
        let num = parseFloat(discountStr);
        if(!isNaN(num)) {
            discountAmt = num;
            displayText = discountStr;
        }
    }

    const netAmount = baseFare + discountAmt + tax;

    // Update specific IDs
    const discEl = document.getElementById(discId);
    const totalEl = document.getElementById(totalId);

    if(discEl && totalEl) {
        discEl.innerText = displayText;
        totalEl.innerText = netAmount.toLocaleString('en-GB', { minimumFractionDigits: 0 }) + " PKR";
    }
}

function resetCalcDisplays() {
    const ids = ["dispDiscAdult", "dispTotalAdult", "dispDiscChild", "dispTotalChild", "dispDiscInfant", "dispTotalInfant"];
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerText = (id.includes("Total") ? "0.00 PKR" : "-");
    });
}

/* =========================
   RESOURCES MANAGER
========================= */

// Helper: Get Icon HTML (With Colors)
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    // Word (.docx)
    if (ext === 'docx') {
        return `<div class="file-icon"><svg class="icon-word" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 00-2 2H4a2 2 0 00-2-2V4a2 2 0 00-2 2V4a2 2 0 00-2zM4a2 2 0 00-2 2zM4a2 2 0 00-2 2V4a2 2 0 00-2zMz" fill="none"/></svg></div>`;
    }
    // Excel (.xls)
    else if (ext === 'xls') {
        return `<div class="file-icon"><svg class="icon-excel" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6v2a2 2 0 002 2v6a2 2 0 002 2H6a2 2 0 002-2V4a2 2 0 002-2h-8V6h-2a2 0 002 2H6V2a2 0 002-2H6V4a2 2 0 002-2H6a2 2 0 002-2H6V2a2 0 002-2zm0 0h-8V2a2 0 002-2h8V2a2 0 002-2H6V6a2 0 002-2zm-4h10a2 2 0 002-2v2a2 0 002-2H6V6a2 0 002-2H6v2a2 0 002-2H6v2a2 0 002-2zm-4h10a2 2 0 002-2v2a2 0 002-2H6V6a2 0 002-2zm-4-4h10a2 2 0 002-2v2a2 0 002-2H6V6a2 0 002-2H6v2a2 0 002-2H6v6a2 0 002-2z" fill="none"/></svg></div>`;
    }
    // PDF
    else if (ext === 'pdf') {
        return `<div class="file-icon"><svg class="icon-pdf" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.79 2 4.2 2s4 2.21 2.4 2.16.21 2 4 2.24 5.11 0 5.32 0 0 9.68 0 2-4.68 16.64-2.34 9.68 0 5.32 0-9.68-2.5.32 14.32 9.68-2-4.68 19.32-9.68 12.02-14.32 9.68 0 4.68 14.32 9.68 0-4.68 19.32-9.68 0 9.68 12.02-14.32-9.68 0-4.68 14.32-9.68 0-9.68 12.02-7.34-4.68 9.68 0 4.68 14.32-9.68 0-9.68 9.68-4.68 14.32-9.68 0-9.68 9.68-5.32 14.32-9.68 0-5.32 14.32-9.68 0-9.68 9.68-5.32 14.32-9.68 0-5.32 14.32-9.68 0-9.68 9.68-5.32 14.32-9.68 0-9.68 9.68-5.32 14.32-9.68 0-9.68 9.68-5.32 14.32-9.68 0-9.68 9.68-5.32 14.32-9.68 0-9.68 9.68-9.68z" fill="none"/></svg></div>`;
    }
    // Default
    else {
        return `<div class="file-icon"><svg class="icon-default" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 00-2 2H6a2 2 0 00-2 2V4a2 2 0 00-2 2V4a2 2 0 00-2 2H4v14a2 2 0 00-2 2H6a2 2 0 00-2 2V4a2 2 0 00-2 2V4a2 2 0 00-2 2z" fill="none"/></svg></div>`;
    }
}

// Load files from 'resources' folder
async function loadResources() {
    const listContainer = document.getElementById("resourceList");
    const uploadSection = document.getElementById("uploadSection");
    
    if(!listContainer) return;

    try {
        // No token needed for public read
        const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${resourcesFolder}`;
        
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Failed to load folder. Did you create a 'resources' folder?");

        const files = await res.json();
        
        listContainer.innerHTML = ""; // Clear loading text

        // --- 1. HANDLE UPLOAD BUTTON (Admin Only) ---
        if (isEditor) {
            uploadSection.style.display = "block";
        } else {
            uploadSection.style.display = "none"; // HIDE Upload Button
        }

        // --- 2. POPULATE DOWNLOAD LIST (Visible to Everyone) ---
        if(files.length === 0) {
            listContainer.innerHTML = "<div style='text-align:center;padding:10px;color:#777'>Folder is empty or not found.</div>";
            return;
        }

        files.forEach(file => {
            if (file.name === ".gitkeep") return;

            const item = document.createElement("div");
            item.className = "resource-item";

            // Use raw.githubusercontent.com for direct download
            const linkUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/main/${resourcesFolder}/${file.name}`;
            
            let html = `
                <a href="${linkUrl}" class="resource-link" download="${file.name}">${file.name}</a>
            `;

            // Delete Button (Admin Only)
            if (isEditor) {
                html += `
                        <button class="delete-res-btn" onclick="deleteResource('${file.name}', '${file.sha}')">×</button>
                `;
            }

            item.innerHTML = html;
            listContainer.appendChild(item);
        });

    } catch (error) {
        console.error("Error loading resources:", error);
        const listContainer = document.getElementById("resourceList");
        if(listContainer) listContainer.innerHTML = "<div style='text-align:center;padding:10px;color:red'>Folder 'resources' folder not found in GitHub.</div>";
    }
}

// Handle Upload (Admin Only)
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const token = prompt("Enter GitHub Token to Upload:");
    if (!token) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const content = e.target.result.split(',')[1]; // Base64 part

        const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${resourcesFolder}/${file.name}`;

        try {
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Upload ${file.name}`,
                    content: content,
                    branch: "main"
                })
            });

            if (!res.ok) throw new Error("Failed to upload");

            alert("File Uploaded Successfully!");
            loadResources(); // Refresh list
        } catch (error) {
            console.error(error);
            alert("Error uploading file. Check Token/Permissions.");
        }
    };
    reader.readAsDataURL(file);
}

// Handle Delete (Admin Only)
async function deleteResource(filename, sha) {
    if(!confirm(`Are you sure you want to delete ${filename}?`)) return;

    const token = prompt("Enter GitHub Token to Delete:");
    if (!token) return;

    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${resourcesFolder}/${filename}`;

    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!res.ok) throw new Error("Failed to delete");

        alert("File Deleted Successfully!");
        loadResources(); // Refresh list
    } catch (error) {
        console.error("Error deleting file. Check Token/Permissions.");
    }
}

/* =========================
   WELCOME SCREEN LOGIC
========================= */
window.onload = function() {
    loadData(); // Load Airline Data
    setTimeout(() => {
        const screen = document.getElementById("welcome-screen");
        if (screen) {
            screen.style.opacity = "0"; 
            
            // Remove from DOM completely after fade finishes
            setTimeout(() => {
                screen.style.display = "none";
            }, 800); 
        }
    }, 5000); // Wait 5 seconds before fading
};

/* =========================
   CHATWAY WIDGET LOGIC
========================= */
function openChatWay() {
    const script = document.createElement("script");
    script.src = "https://cdn.chatway.app/widget.js?id=Ogb5Fio";
    
    // This ensures the widget loads even if internet is slow.
    script.async = true; 
    
    document.body.appendChild(script);
}
