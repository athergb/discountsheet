/* =========================
   CONFIGURATION
========================= */
const CONFIG = {
    owner: "athergb", 
    repo: "discountsheet", 
    filePath: "data.json", 
    adminPassword: "admin123" // Change this if you want a different password
};

/* =========================
   STATE
========================= */
let data = [];
let sha = "";
let isEditor = false;
let githubToken = ""; 

/* =========================
   LOAD DATA
========================= */
async function loadData() {
    if (!githubToken) {
        // Ask user for token to read data
        githubToken = prompt("Enter your GitHub Token to view the sheet:");
    }
    
    if (!githubToken) return; // User cancelled

    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    
    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `token ${githubToken}` }
        });
        
        if (!res.ok) throw new Error("Failed to load");
        
        const json = await res.json();
        sha = json.sha; // Save SHA for future updates
        const content = atob(json.content);
        data = JSON.parse(content);
        
        render();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading data. Please check your Token and Internet connection.");
    }
}

/* =========================
   SAVE DATA
========================= */
async function saveToGitHub() {
    // Ask for token again for security on save
    const tokenInput = prompt("Enter Token to Save Changes:");
    if (!tokenInput) return;

    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    const contentBase64 = btoa(JSON.stringify(data, null, 2));

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${tokenInput}`,
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
        sha = json.content.sha; // Update SHA
        alert("Saved Successfully!");
        render();
    } catch (error) {
        console.error("Error saving:", error);
        alert("Error saving. Check Token.");
    }
}

/* =========================
   RENDER
========================= */
function render() {
    const cashGrid = document.getElementById("cashGrid");
    const creditGrid = document.getElementById("creditGrid");
    cashGrid.innerHTML = "";
    creditGrid.innerHTML = "";

    const today = new Date();
    today.setHours(0,0,0,0);

    data.forEach((item, index) => {
        const d = new Date(item.validity);
        const expired = d < today ? "expired" : "";
        const categoryGrid = item.category === "cash" ? cashGrid : creditGrid;

        // Delete button only if logged in
        const actionHtml = isEditor 
            ? `<div class="actions"><span class="delete-btn" onclick="deleteEntry(${index})">DELETE</span></div>` 
            : "";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="discount">${item.discount}</div>
            ${item.logo ? `<img src="${item.logo}">` : ""}
            <p><b>${item.airline}</b></p>
            <p>${item.note} ${item.notification ? `<span class="notice">${item.notification}</span>` : ""}</p>
            <p class="validity ${expired}">Valid till: ${d.toDateString()}</p>
            ${actionHtml}
        `;
        categoryGrid.appendChild(card);
    });
}

/* =========================
   ACTIONS
========================= */
function deleteEntry(index) {
    if(!confirm("Delete this entry?")) return;
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
    const editIndex = document.getElementById("editIndex").value;

    if (!airline || !validity) return alert("Airline and Validity required");

    const entry = { category, airline, discount, logo, note, notification, validity };

    if (editIndex !== "") {
        data[parseInt(editIndex)] = entry;
    } else {
        data.push(entry);
    }

    saveToGitHub();
    closeModals();
}

/* =========================
   AUTHENTICATION (THE MISSING PARTS)
========================= */
function showLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

function closeModals() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("formModal").style.display = "none";
}

function checkPassword() {
    const input = document.getElementById("adminPassword").value;
    if (input === CONFIG.adminPassword) {
        isEditor = true;
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
        document.getElementById("addBtn").style.display = "inline-block";
        closeModals();
        render();
    } else {
        alert("Wrong Password");
    }
}

function logout() {
    isEditor = false;
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("addBtn").style.display = "none";
    render();
}

function showAddModal() {
    document.getElementById("inpCategory").value = "cash";
    document.getElementById("inpAirline").value = "";
    document.getElementById("inpDiscount").value = "";
    document.getElementById("inpLogo").value = "";
    document.getElementById("inpNote").value = "";
    document.getElementById("inpNotice").value = "";
    document.getElementById("inpValidity").value = "";
    document.getElementById("editIndex").value = "";
    document.getElementById("formModal").style.display = "block";
}

/* =========================
   JPG EXPORT
========================= */
async function saveAsJPG() {
  const sheet = document.getElementById("sheet");
  const adminBtns = document.querySelector("div[style*='text-align: center']");
  if(adminBtns) adminBtns.style.display = "none";

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
  if(adminBtns) adminBtns.style.display = "block";

  const img = canvas.toDataURL("image/jpeg", 0.92);
  const link = document.createElement("a");
  link.download = "QFC-Airline-Discount-A4.jpg";
  link.href = img;
  link.click();
}

async function saveForWhatsApp() {
  const sheet = document.getElementById("sheet");
  const adminBtns = document.querySelector("div[style*='text-align: center']");
  if(adminBtns) adminBtns.style.display = "none";

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
  if(adminBtns) adminBtns.style.display = "block";

  const img = canvas.toDataURL("image/jpeg", 0.9);
  const link = document.createElement("a");
  link.download = "QFC-Airline-Discount-WhatsApp.jpg";
  link.href = img;
  link.click();
}

window.onload = loadData;
