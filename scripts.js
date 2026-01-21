/* =========================
   CONFIGURATION (REQUIRED)
========================= */
const CONFIG = {
    owner: "athergb",           // Your username from the link
    repo: "discountsheet",      // Your repo name
    filePath: "data.json",      // The file we just created
    adminPassword: "admin123"   // Whatever password you want
};

/* =========================
   STATE
========================= */
let data = [];
let sha = ""; // Required for GitHub updates
let isEditor = false;

/* =========================
   LOAD DATA FROM GITHUB
========================= */
async function loadData() {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    
    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `token ${CONFIG.githubToken}` }
        });
        
        if (!res.ok) throw new Error("Failed to load");
        
        const json = await res.json();
        sha = json.sha;
        // Decode Base64 content from GitHub
        const content = atob(json.content);
        data = JSON.parse(content);
        
        render();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Could not load data. Check your Config (Token/Repo/FilePath).");
    }
}

/* =========================
   SAVE DATA TO GITHUB
========================= */
async function saveToGitHub() {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    const contentBase64 = btoa(JSON.stringify(data, null, 2)); // Encode to Base64

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${CONFIG.githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Update discount sheet",
                content: contentBase64,
                sha: sha // Must send SHA to update existing file
            })
        });

        if (!res.ok) throw new Error("Failed to save");
        
        const json = await res.json();
        sha = json.content.sha; // Update SHA for next save
        alert("Saved Successfully!");
        render();
    } catch (error) {
        console.error("Error saving:", error);
        alert("Error saving. Did you configure your Token correctly?");
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

        // Build the Delete Button HTML (Only if Editor)
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
   CRUD ACTIONS
========================= */
function deleteEntry(index) {
    if(!confirm("Are you sure you want to delete this?")) return;
    data.splice(index, 1);
    saveToGitHub(); // Auto-save after delete
}

function saveData() {
    // Gather inputs
    const category = document.getElementById("inpCategory").value;
    const airline = document.getElementById("inpAirline").value;
    const discount = document.getElementById("inpDiscount").value;
    const logo = document.getElementById("inpLogo").value;
    const note = document.getElementById("inpNote").value;
    const notification = document.getElementById("inpNotice").value;
    const validity = document.getElementById("inpValidity").value;
    const editIndex = document.getElementById("editIndex").value;

    if (!airline || !validity) return alert("Airline and Validity are required");

    const entry = {
        category, airline, discount, logo, note, notification, validity
    };

    if (editIndex !== "") {
        // Update existing
        data[parseInt(editIndex)] = entry;
    } else {
        // Add new
        data.push(entry);
    }

    saveToGitHub();
    closeModals();
}

/* =========================
   AUTHENTICATION & UI
========================= */
function showLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

function checkPassword() {
    const input = document.getElementById("adminPassword").value;
    if (input === CONFIG.adminPassword) {
        isEditor = true;
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
        document.getElementById("addBtn").style.display = "inline-block";
        closeModals();
        render(); // Re-render to show delete buttons
    } else {
        alert("Incorrect Password");
    }
}

function logout() {
    isEditor = false;
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("addBtn").style.display = "none";
    render(); // Re-render to hide delete buttons
}

function showAddModal() {
    // Clear inputs
    document.getElementById("inpCategory").value = "cash";
    document.getElementById("inpAirline").value = "";
    document.getElementById("inpDiscount").value = "";
    document.getElementById("inpLogo").value = "";
    document.getElementById("inpNote").value = "";
    document.getElementById("inpNotice").value = "";
    document.getElementById("inpValidity").value = "";
    document.getElementById("editIndex").value = ""; // Empty means add mode
    
    document.getElementById("formModal").style.display = "block";
}

function closeModals() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("formModal").style.display = "none";
}

/* =========================
   JPG EXPORT (YOUR ORIGINAL LOGIC)
========================= */
async function saveAsJPG() {
  const sheet = document.getElementById("sheet");
  // Temporarily hide Admin buttons for clean screenshot
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
  if(adminBtns) adminBtns.style.display = "block"; // Show buttons again

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
