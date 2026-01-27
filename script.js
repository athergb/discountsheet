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
let resourcesFolder = "resources";

/* =========================
   LOAD DATA
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
        sha = json.content.sha; 
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

        // Hover Instructions Logic (Integrated from resources)
        card.setAttribute("data-note", item.instructions || "");
       
        card.innerHTML = `
           <div class="discount">${item.discount}</div>
            ${item.logo ? `<img src="${item.logo}">` : ""}
            <p><b>${item.airline}</b></p>
            ${item.note ? `<p class="note-text">${item.note}</p>` : ""}
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
        document.getElementById("editIndex").value = ""; // Empty means ADD MODE
        document.getElementById("modalTitle").innerText = "Add Airline";
        
        modal.style.display = "block";
    }
}

function editEntry(index) {
    const item = data[index]; 
    
    document.getElementById("inpCategory").value = item.category;
    document.getElementById("inpAirline").value = item.airline;
    document.getElementById("inpDiscount").value = item.discount;
    document.getElementById("inpLogo").value = item.logo || "";
    document.getElementById("inpNote").value = item.note || "";
    document.getElementById("inpNotice").value = item.notification || "";
    document.getElementById("inpValidity").value = item.validity;
    document.getElementById("inpInstructions").value = item.instructions || "";
    
    document.getElementById("editIndex").value = index;
    
    // Change Title
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
        render(); 
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
   CALCULATOR LOGIC
========================= */

function openCalculator() {
    const select = document.getElementById("calcAirline");
    select.innerHTML = '<option value="">-- Select Airline --</option>';
    
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
        // Even if discount is 0, we calculate Basic + Tax
        updateRow(adultBaseInput, tax, "dispDiscAdult", "dispTotalAdult");
        updateRow(adultBaseInput * 0.75, tax, "dispDiscChild", "dispTotalChild");
        updateRow(adultBaseInput * 0.10, tax, "dispDiscInfant", "dispTotalInfant");
        return;
    }

    // --- CALCULATE FOR ADULT (100%) ---
    calculateSingleRow(adultBaseInput, discountStr, tax, discId, totalId) {
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

    const discEl = document.getElementById(discId);
    const totalEl = document.getElementById(totalId);

    if(discEl && totalEl) {
        discEl.innerText = displayText;
        totalEl.innerText = netAmount.toLocaleString('en-GB', { minimumFractionDigits: 0 }) + " PKR";
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

// Helper: Get Icon HTML
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    // Word (.docx)
    if (ext === 'docx') {
        return `<div class="file-icon"><svg class="icon-word" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 00-2 2H6a2 2 0 00-2 2V4a2 2 0 00-2 2H6a2 2 0 00-2 2V4a2 2 0 00-2 2H4v14a2 2 0 00-2 2H6a2 2 0 00-2 2z" fill="#2b579a"/></svg></div>`;
    }
    // Excel (.xls)
    else if (ext === 'xls') {
        return `<div class="file-icon"><svg class="icon-excel" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 00-2 2H6a2 2 0 00-2 2V4a2 2 0 00-2 2zm0 0h-8v2a2 2 0 00-2 2h8V2a2 2 0 00-2 2H6V6a2 2 0 00-2 2H6V2a2 0 00-2 2h8V6a2 2 0 00-2 2H6V6a2 0 00-2 2zm-4h10a2 2 0 002 2v6a2 0 00-2 2H6V4a2 2 0 00-2 2zm0-4h8a2 2 0 002 2h8V2a2 0 00-2 2H6V6a2 2 0 00-2-2H6V6a2 0 00-2-2zm-4-4h10a2 2 0 002 2v6a2 0 00-2 2H6V4a2 0 00-2 2H6V6a2 0 00-2 2zm-4-4h10a2 0 002 2v6a2 0 00-2 2H6V4a2 0 00-2 2zm-4-4h10a2 0 002 2v6a2 0 00-2 2H6V4a2 0 00-2 2H6V6a2 0 00-2 2z" fill="none"/></svg></div>`;
    }
    // PDF
    else if (ext === 'pdf') {
        return `<div class="file-icon"><svg class="icon-pdf" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.79 2 4 2.2s4 2.21 2 4 2.16.21 2.4 2.24 5.11 0 5.32 0 0 9.68 0 2-4.68 2-5.32 0 9.68 0 2-9.68 0-4.68 16.64-2.34 9.68 0 4.68 19.32 9.68 0 5.32 0 9.68 12.02-14.32 9.68 0-4.68 14.32 9.68 0-4.68 14.32-9.68 0 0 0 9.68 0 4.68 14.32-9.68 0-9.68 4.68-16.64-2.34-9.68 0-4.68 19.32-9.68 0 0 9.68 12.02-14.32-9.68 0-4.68 14.32-9.68 0-9.68 9.68 4.68 19.32-9.68 0 9.68 9.68 0.9.68 0 12.02-14.32-9.68 0 4.68 14.32-9.68 0 9.68 9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 4.68 14.32-9.68 0 9.68 9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-9.68-7.34-9.68 0-4.68 19.32-9.68 0 9.68 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-9.68 7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-9.68 7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-9.68 7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-9.68 7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-9.68 7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9. 68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9. 68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9. 68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9. 68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9. 68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 68 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68.4.19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68.4.19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68.4.19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68.4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68. 19.32-9.68 0.9.68 12.02-7.34-9.68 0 9. 68 4.19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68.4. 19.32-9. 68 0 9.68.12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68. 4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9. 68.4. 19.32-9.68 0.9.68 12.02-7.34-9.68 0 9. 68.4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4.19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9.68 12.02-7.34-9.68.0 9.68.4. 19.32-9.68.0 9.68 12.02-7.34-9.68 0 9.68.4. 19.32-9.68 0 9.68. 12.02-7.34-9.68.0 9.68 4.19.32-9.68.0 9.68 12.02-7.34-9.68. 0.9.68.4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68. 4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68 4. 19.32-9.68 0 9. 68.12.02-7.34-9.68.0 9.68. 4. 19.32-9.68 0 9. 68.12.02-7.34-9.68 0 9.68.4.19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68.0 9.68 12.02-7.34-9.68.0 9.68. 4.19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68. 4. 19.32-9.68.0 9.68.12.02-7.34-9.68. 0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4.19.32-9.68 0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68. 0 9.68.4. 19.32-9.68 0 9.68 12.02-7.34-9.68 0 9.68.4.19.32-9.68.0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68.0.9. 68. 19.32-9.68 0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68 0.9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68 0 9.68.12.02-7.34-9.68.0 9.68. 4. 19.32-9.68. 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9. 68.0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68. 0 9.68. 4. 19.32-9.68.0 9.68.12.02-7.34-9.68.0.  9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0 9.68.4.19.32-9.68. 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68. 0 9.68.12.02-7.34-9.68 0 9. 68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9. 68.4. 19. 32-9. 68.0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9. 68.0 9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0 9.68. 4. 19.32-9.68. 0 9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9. 68.0.9.68.12.02-7.34-9.68.0.9.68. 4. 19.32-9.68.0 9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68 0 9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68 0 9.68.4. 19.32-9.68. 0.9.68 12.02-7.34-9.68 0 9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9. 9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0 9.68.12.02-7.34-9.68.0 9.68.4. 19.32-9.68. 0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68 0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68. 9.68.12.02-7.34-9.68.0. 9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68. 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68.12.02-7.34-9.68 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9.68. 4. 19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0. 9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9. 68.4. 19.32-9.68.0.9. 68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9. 68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.68.0.9.68.12.02-7.34-9.68. 0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9. 68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68. 0.9.68.4. 19.32-9.68.0.9.68. 12.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9. 68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 9.68.4.19.32-9.68.0. 9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9.68.4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68. 0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68. 4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68. 0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68. 0.9.68. 12.02-7.34-9.68.0.9.68.4. 19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.68.4.19.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4. 19. 32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19. 9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68.4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68. 4.19.32-9.68.0.9.68. 12.02-7.34-9.68.0.9.68. 4. 19.32-9.68.0.9.68.12.02-7.34-9.68.0.9.68.4.19.18px; /* Small font size for readability */
}

/* =========================
   SHEET FOOTER
========================= */
.sheet-footer {
  margin-top: 50px;
  text-align: center;
  border-top: 2px solid #0f2e5a;
  padding-top: 20px;
}

.sheet-footer h4 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #0f2e5a; /* Matches Header Color */
}

.sheet-footer p {
  font-size: 13px;
  color: #555;
  font-weight: 500;
  border-radius: 50px;
}

.credits {
  margin-top: 15px;
  font-size: 12px;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: blink 1s infinite steps(1, end);
}

/* =========================
   WELCOME SCREEN ANIMATION
========================= */
#welcome-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0f2e5a;
    z-index: 99999; /* SITS ON TOP */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: opacity: 0.8s ease-in-out;
    opacity: 1 !important; /* FORCE VISIBLE */
    padding-bottom: 50px; /* Adds space below title */
}

.welcome-logo {
    width: 150px;
    height: 150px;
    animation: zoomIn 1.5s ease-out;
}

.welcome-text {
    color: white;
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 600;
    margin-top: 20px;
    opacity: 0;
    animation: slideUp 1s ease-out 0.5s forwards; /* Slides text from below logo */
}

/* Animation Keyframes */
@keyframes zoomIn {
    0% { transform: scale(0); opacity: 0; }
 100% { transform: scale(1); opacity: 1; }
}

@keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
 100% { transform: translateY(0); opacity: 1; }
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
            setTimeout(() => {
                screen.style.display = "none";
            }, 800); 
        }
    }, 5000); 
};
