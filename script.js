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
        
        // Use 'item.instructions' for the Hover Data
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
    document.getElementById("inpCategory").value = item.category;
    document.getElementById("inpAirline").value = item.airline;
    document.getElementById("inpDiscount").value = item.discount;
    document.getElementById("inpLogo").value = item.logo || "";
    document.getElementById("inpNote").value = item.note || "";
    document.getElementById("inpNotice").value = item.notification || "";
    document.getElementById("inpValidity").value = item.validity;
    document.getElementById("inpInstructions").value = item.instructions || "";
    document.getElementById("editIndex").value = index;
    document.getElementById("modalTitle").innerText = "Edit Airline";
    document.getElementById("formModal").style.display = "block";
}

function closeModals() {
    const loginModal = document.getElementById("loginModal");
    const formModal = document.getElementById("formModal");
    if (loginModal) loginModal.style.display = "none";
    if (formModal) formModal.style.display = "none";
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

window.onload = loadData;

/* =========================
   CALCULATOR LOGIC (CORRECTED)
========================= */

// 1. Open Modal and Populate Airlines
function openCalculator() {
    const select = document.getElementById("calcAirline");
    select.innerHTML = '<option value="">-- Select Airline --</option>';
    
    // Populate unique airlines from data
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.discount; 
        option.text = item.airline;
        select.appendChild(option);
    });

    document.getElementById("calcModal").style.display = "block";
}

// 2. Perform Calculation
function calculatePSF() {
    const airlineSelect = document.getElementById("calcAirline");
    const discountStr = airlineSelect.options[airlineSelect.selectedIndex].value;
    
    const adultBaseInput = parseFloat(document.getElementById("calcBasic").value) || 0;
    const tax = parseFloat(document.getElementById("calcTax").value) || 0;

    if(!discountStr) {
        resetCalcDisplays();
        return;
    }

    // --- CALCULATE FOR ADULT (100%) ---
    function calculateSingleRow(baseFare, discountStr, tax, discId, totalId) {
    // SAFETY CHECK: Verify IDs exist
    const discEl = document.getElementById(discId);
    const totalEl = document.getElementById(totalId);

    if (!discEl || !totalEl) {
        console.error("Calculator Error: Could not find element ID:", discId, "or", totalId);
        return; 
    }

    let discountAmt = 0;
    let displayText = "";

    // PARSE DISCOUNT STRING
    if (discountStr.includes("%")) {
        let num = parseFloat(discountStr.replace(/[^0-9.-]/g, ''));
        discountAmt = (baseFare * num) / 100;
        displayText = `${discountStr} (${discountAmt.toFixed(2)})`;
    } else if (discountStr.includes("PKR")) {
        let num = parseFloat(discountStr.replace(/[^0-9.-]/g, ''));
        discountAmt = num;
        displayText = discountStr;
    } else {
        let num = parseFloat(discountStr);
        if(!isNaN(num)) {
            discountAmt = num;
            displayText = discountStr;
        }
    }

    const netAmount = baseFare + discountAmt + tax;

    // Update specific IDs
    discEl.innerText = displayText;
    totalEl.innerText = netAmount.toLocaleString('en-PK', { minimumFractionDigits: 0 }) + " PKR";
}
   
// Helper to clear displays (Fixed Case Sensitivity)
function resetCalcDisplays() {
    // Hardcoded IDs to prevent case mismatch errors
    document.getElementById("dispDiscAdult").innerText = "-";
    document.getElementById("dispTotalAdult").innerText = "0.00 PKR";
    
    document.getElementById("dispDiscChild").innerText = "-";
    document.getElementById("dispTotalChild").innerText = "0.00 PKR";
    
    document.getElementById("dispDiscInfant").innerText = "-";
    document.getElementById("dispTotalInfant").innerText = "0.00 PKR";
}
