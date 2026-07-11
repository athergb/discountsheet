const CONFIG = {
    owner: "athergb",
    repo: "discountsheet",
    filePath: "data.json",
    adminPassword: "admin123",
    readOnlyToken: "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" // Replace this with your GitHub Read-Only token
};

let data = [];
let sha = "";
let isEditor = false;
let resourcesFolder = "resources";

function toggleDropdown() {
    const dropdown = document.getElementById('documentsDropdown');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdown) {
        dropdown.classList.toggle('show');
        if (dropdownBtn) dropdownBtn.classList.toggle('active');
    }
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('documentsDropdown');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdown && dropdownBtn && !dropdown.contains(event.target) && !dropdownBtn.contains(event.target)) {
        dropdown.classList.remove('show');
        dropdownBtn.classList.remove('active');
    }
});

async function loadData() {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `token ${CONFIG.readOnlyToken}`
            }
        });
        if (!res.ok) throw new Error("Failed to load data");
        const json = await res.json();
        sha = json.sha;
        data = JSON.parse(atob(json.content));
        render();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading data. Please check your Internet connection.");
    }
}

async function saveToGitHub() {
    const token = prompt("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");
    if (!token) return;
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`;
    const contentBase64 = btoa(JSON.stringify(data, null, 2));
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Update discount sheet", content: contentBase64, sha: sha })
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

function render() {
    const cashGrid = document.getElementById("cashGrid");
    const creditGrid = document.getElementById("creditGrid");
    if (!cashGrid || !creditGrid) return;
    cashGrid.innerHTML = "";
    creditGrid.innerHTML = "";
    const today = new Date();
    today.setHours(0,0,0,0);

    data.forEach((item, index) => {
        const d = new Date(item.validity);
        const expired = d < today ? "expired" : "";
        const categoryGrid = item.category === "cash" ? cashGrid : creditGrid;
        const actionHtml = isEditor ? `<div class="actions"><button class="edit-btn" onclick="editEntry(${index})">Edit</button><button class="delete-btn" onclick="deleteEntry(${index})">Delete</button></div>` : "";
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-note", item.instructions || "");
        card.innerHTML = `<div class="discount">${item.discount}</div>${item.logo ? `<img src="${item.logo}">` : ""}<p><b>${item.airline}</b></p><p class="note-text">${item.note}</p>${item.notification ? `<div class="alert-box">${item.notification}</div>` : ""}<p class="validity ${expired}">Valid till: ${d.toLocaleDateString('en-GB')}</p>${actionHtml}`;
        categoryGrid.appendChild(card);
    });
    loadResources();
}

async function loadResources() {
    const listContainer = document.getElementById("resourceList");
    const uploadSection = document.getElementById("uploadSection");
    if (!listContainer) return;
    try {
        const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${resourcesFolder}`;
        const res = await fetch(url, {
            headers: {
                'Authorization': `token ${CONFIG.readOnlyToken}`
            }
        });
        if (!res.ok) {
            listContainer.innerHTML = "<div style='text-align:center;padding:10px;color:#777'>No documents available.</div>";
            if (uploadSection) uploadSection.style.display = "none";
            return;
        }
        const files = await res.json();
        listContainer.innerHTML = "";
        if (isEditor && uploadSection) uploadSection.style.display = "block";
        else if (uploadSection) uploadSection.style.display = "none";
        if (!Array.isArray(files) || files.length === 0) {
            listContainer.innerHTML = "<div style='text-align:center;padding:10px;color:#777'>No documents available.</div>";
            return;
        }
        let hasFiles = false;
        files.forEach(file => {
            if (file.name === ".gitkeep" || file.type !== "file") return;
            hasFiles = true;
            const item = document.createElement("div");
            item.className = "resource-item";
            const linkUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/main/${resourcesFolder}/${file.name}`;
            const fileIcon = getFileIconHTML(file.name);
            const fileExt = file.name.split('.').pop().toLowerCase();
            const isImageFile = ['jpg','jpeg','png','gif','bmp','webp','svg'].includes(fileExt);
            let html = isImageFile ? `<a href="${linkUrl}" class="resource-link" target="_blank" title="View image in new tab">${fileIcon}<span class="file-name">${file.name}</span><span class="view-label">(View)</span></a>` : `<a href="${linkUrl}" class="resource-link" download="${file.name}">${fileIcon}<span class="file-name">${file.name}</span></a>`;
            if (isEditor) html += `<button class="delete-res-btn" onclick="deleteResource('${file.name}', '${file.sha}')">×</button>`;
            item.innerHTML = html;
            listContainer.appendChild(item);
        });
        if (!hasFiles) listContainer.innerHTML = "<div style='text-align:center;padding:10px;color:#777'>No documents available.</div>";
    } catch (error) {
        console.error("Error loading resources:", error);
        if (listContainer) listContainer.innerHTML = "<div style='text-align:center;padding:10px;color:red'>Unable to load documents.</div>";
    }
}

function getFileIconHTML(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'docx') return `<div class="file-icon" style="color:#2b579a;">📝</div>`;
    if (['jpg','jpeg','png','gif','bmp','webp','svg'].includes(ext)) return `<div class="file-icon" style="color:#e74c3c;">🖼️</div>`;
    if (ext === 'pdf') return `<div class="file-icon" style="color:#f40f02;">📄</div>`;
    if (ext === 'xls' || ext === 'xlsx') return `<div class="file-icon" style="color:#1d6f42;">📊</div>`;
    if (ext === 'txt') return `<div class="file-icon" style="color:#555;">📃</div>`;
    return `<div class="file-icon" style="color:#95a5a6;">📎</div>`;
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const token = prompt("Enter GitHub Token to Upload:");
    if (!token) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
        const content = e.target.result.split(',')[1];
        const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${resourcesFolder}/${file.name}`;
        try {
            const res = await fetch(url, { method: 'PUT', headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Upload ${file.name}`, content: content, branch: "main" }) });
            if (!res.ok) throw new Error("Failed to upload");
            alert("File Uploaded Successfully!");
            loadResources();
        } catch (error) { console.error(error); alert("Error uploading file. Check Token/Permissions."); }
    };
    reader.readAsDataURL(file);
}

async function deleteResource(filename, sha) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;
    const token = prompt("Enter GitHub Token to Delete:");
    if (!token) return;
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${resourcesFolder}/${filename}`;
    try {
        const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Delete ${filename}`, sha: sha, branch: "main" }) });
        if (!res.ok) throw new Error("Failed to delete");
        alert("File Deleted Successfully!");
        loadResources();
    } catch (error) { console.error("Error deleting file. Check Token/Permissions."); }
}

function showLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "block";
    else { alert("Error: The Login Modal code is missing from your HTML file."); }
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
    const calcModal = document.getElementById("calcModal");
    if (loginModal) loginModal.style.display = "none";
    if (formModal) formModal.style.display = "none";
    if (calcModal) calcModal.style.display = "none";
}

function checkPassword() {
    const input = document.getElementById("adminPassword");
    if (!input) return alert("Input field not found");
    if (input.value === CONFIG.adminPassword) {
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

function deleteEntry(index) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
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
    if (editIndex !== "") data[parseInt(editIndex)] = entry;
    else data.push(entry);
    saveToGitHub();
    closeModals();
}

async function saveAsJPG() {
    const sheet = document.getElementById("sheet");
    const headerBtns = document.querySelector(".header-controls");
    const bottomBtns = document.querySelector(".bottom-actions");
    if (headerBtns) headerBtns.style.display = "none";
    if (bottomBtns) bottomBtns.style.display = "none";
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
    const canvas = await html2canvas(clone, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    document.body.removeChild(wrapper);
    if (headerBtns) headerBtns.style.display = "flex";
    if (bottomBtns) bottomBtns.style.display = "block";
    const link = document.createElement("a");
    link.download = "QFC-Discount-Sheet.jpg";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

async function saveForWhatsApp() {
    const sheet = document.getElementById("sheet");
    const headerBtns = document.querySelector(".header-controls");
    const bottomBtns = document.querySelector(".bottom-actions");
    if (headerBtns) headerBtns.style.display = "none";
    if (bottomBtns) bottomBtns.style.display = "none";
    const clone = sheet.cloneNode(true);
    clone.style.width = "900px";
    clone.style.background = "#ffffff";
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    const canvas = await html2canvas(clone, { scale: 1.5, backgroundColor: "#ffffff", useCORS: true });
    document.body.removeChild(wrapper);
    if (headerBtns) headerBtns.style.display = "flex";
    if (bottomBtns) bottomBtns.style.display = "block";
    const link = document.createElement("a");
    link.download = "QFC-WhatsApp.jpg";
    link.href = canvas.toDataURL("image/png");
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
        option.value = item.discount || "0";
        option.text = item.airline + (item.notification ? ` (${item.notification})` : "");
        select.appendChild(option);
    });

    document.getElementById("calcBasic").value = "";
    document.getElementById("calcTax").value = "";
    document.getElementById("calcSegments").value = "";
    document.getElementById("calcBookingType").value = "GDS";
    document.getElementById("calcSegments").disabled = false;
    document.getElementById("calcAdults").value = 1;
    document.getElementById("calcChildren").value = 0;
    document.getElementById("calcInfants").value = 0;

    resetCalcDisplays();
    document.getElementById("calcModal").style.display = "block";
}

function calculatePSF() {
    const airlineSelect = document.getElementById("calcAirline");
    const discountStr = airlineSelect.options[airlineSelect.selectedIndex].value;
    const adultBaseInput = parseFloat(document.getElementById("calcBasic").value) || 0;
    const tax = parseFloat(document.getElementById("calcTax").value) || 0;
    const bookingType = document.getElementById("calcBookingType").value;
    const adultCount = parseInt(document.getElementById("calcAdults").value) || 0;
    const childCount = parseInt(document.getElementById("calcChildren").value) || 0;
    const infantCount = parseInt(document.getElementById("calcInfants").value) || 0;

    const isGDS = (bookingType === "GDS");
    const segInput = document.getElementById("calcSegments");
    if (isGDS) { segInput.disabled = false; }
    else { segInput.disabled = true; segInput.value = ""; }

    const segments = parseInt(document.getElementById("calcSegments").value) || 0;
    const segDiscAmount = segments * 400;

    let adultPerPerson = 0, childPerPerson = 0, infantPerPerson = 0;

    if (!discountStr || discountStr === "0") {
        adultPerPerson = updateRow(adultBaseInput, tax, segDiscAmount, "dispDiscAdult", "dispSegDiscAdult", "dispTotalAdult", isGDS);
        childPerPerson = updateRow(adultBaseInput * 0.75, tax, segDiscAmount, "dispDiscChild", "dispSegDiscChild", "dispTotalChild", isGDS);
        infantPerPerson = updateRow(adultBaseInput * 0.10, tax, 0, "dispDiscInfant", "dispSegDiscInfant", "dispTotalInfant", false);
    } else {
        adultPerPerson = calculateSingleRow(adultBaseInput, discountStr, tax, segDiscAmount, "dispDiscAdult", "dispSegDiscAdult", "dispTotalAdult", isGDS);
        childPerPerson = calculateSingleRow(adultBaseInput * 0.75, discountStr, tax, segDiscAmount, "dispDiscChild", "dispSegDiscChild", "dispTotalChild", isGDS);
        infantPerPerson = calculateSingleRow(adultBaseInput * 0.10, discountStr, tax, 0, "dispDiscInfant", "dispSegDiscInfant", "dispTotalInfant", false);
    }

    const adultSub = adultPerPerson * adultCount;
    const childSub = childPerPerson * childCount;
    const infantSub = infantPerPerson * infantCount;
    const grandTotal = adultSub + childSub + infantSub;

    const fmt = (n) => n.toLocaleString('en-GB', { minimumFractionDigits: 0 }) + " PKR";

    document.getElementById("dispSubAdult").innerText = adultCount > 0 ? fmt(adultSub) : "-";
    document.getElementById("dispSubChild").innerText = childCount > 0 ? fmt(childSub) : "-";
    document.getElementById("dispSubInfant").innerText = infantCount > 0 ? fmt(infantSub) : "-";

    let parts = [];
    if (adultCount > 0) parts.push(adultCount + " Adult" + (adultCount > 1 ? "s" : ""));
    if (childCount > 0) parts.push(childCount + " Child" + (childCount > 1 ? "ren" : ""));
    if (infantCount > 0) parts.push(infantCount + " Infant" + (infantCount > 1 ? "s" : ""));

    document.getElementById("dispPassengerBreakdown").innerText = parts.length > 0 ? parts.join(" + ") : "No passengers";
    document.getElementById("dispGrandTotal").innerText = fmt(grandTotal);
}

function updateRow(baseFare, tax, segDisc, discId, segDiscId, totalId, hasSegDisc) {
    const total = baseFare + tax - segDisc;
    const discEl = document.getElementById(discId);
    const segEl = document.getElementById(segDiscId);
    const totalEl = document.getElementById(totalId);
    if (discEl && totalEl) {
        discEl.innerText = "No Discount";
        if (segEl) segEl.innerText = hasSegDisc ? ("PKR " + segDisc.toLocaleString()) : "N/A";
        totalEl.innerText = total.toLocaleString('en-GB', { minimumFractionDigits: 0 }) + " PKR";
    }
    return total;
}

function calculateSingleRow(baseFare, discountStr, tax, segDisc, discId, segDiscId, totalId, hasSegDisc) {
    let discountAmt = 0;
    let displayText = "";
    if (discountStr.includes("%")) {
        let num = parseFloat(discountStr.replace(/[^0-9.-]/g, ''));
        if (!isNaN(num)) { discountAmt = (baseFare * num) / 100; displayText = `${discountStr} (${discountAmt.toFixed(2)})`; }
    } else if (discountStr.includes("PKR")) {
        let num = parseFloat(discountStr.replace(/[^0-9.-]/g, ''));
        if (!isNaN(num)) { discountAmt = num; displayText = discountStr; }
    } else {
        let num = parseFloat(discountStr);
        if (!isNaN(num)) { discountAmt = num; displayText = discountStr; }
    }
    const netAmount = baseFare + discountAmt + tax - segDisc;
    const discEl = document.getElementById(discId);
    const segEl = document.getElementById(segDiscId);
    const totalEl = document.getElementById(totalId);
    if (discEl && totalEl) {
        discEl.innerText = displayText;
        if (segEl) segEl.innerText = hasSegDisc ? ("PKR " + segDisc.toLocaleString()) : "N/A";
        totalEl.innerText = netAmount.toLocaleString('en-GB', { minimumFractionDigits: 0 }) + " PKR";
    }
    return netAmount;
}

function resetCalcDisplays() {
    ["dispDiscAdult", "dispTotalAdult", "dispDiscChild", "dispTotalChild", "dispDiscInfant", "dispTotalInfant"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = id.includes("Total") ? "0 PKR" : "-";
    });
    ["dispSegDiscAdult", "dispSegDiscChild", "dispSegDiscInfant"].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.innerText = (i < 2) ? "PKR 0" : "N/A";
    });
    document.getElementById("dispSubAdult").innerText = "-";
    document.getElementById("dispSubChild").innerText = "-";
    document.getElementById("dispSubInfant").innerText = "-";
    document.getElementById("dispPassengerBreakdown").innerText = "1 Adult";
    document.getElementById("dispGrandTotal").innerText = "0 PKR";
}

/* =========================
   WELCOME SCREEN
========================= */
window.onload = function() {
    loadData();
    loadResources();
    setTimeout(() => {
        const screen = document.getElementById("welcome-screen");
        if (screen) {
            screen.style.opacity = "0";
            setTimeout(() => { screen.style.display = "none"; }, 800);
        }
    }, 5000);
};

let marqueeMessages = [
    {icon: "✨", title: "SPECIAL OFFER", text: "Get additional discount up to PKR 1600 per ticket"},
    {icon: "📅", title: "VALIDITY", text: "All offers valid until further notice"},
    {icon: "📞", title: "CONTACT", text: "For bookings call +92-308-8296519"},
    {icon: "⚡", title: "SAME DAY CASH", text: "Instant discount on spot payment"},
    {icon: "💳", title: "CREDIT OPTIONS", text: "Flexible payment plans available"},
    {icon: "📢", title: "NEW", text: "Additional PSF calculator tool available"},
    {icon: "📄", title: "DOCUMENTS", text: "Check documents section for latest policies"},
    {icon: "🔄", title: "REISSUE/REFUND/VOID", text: "Service charges apply PKR 500/-"}
];

function initMarquee() {
    const marqueeText = document.getElementById('marqueeText');
    const marqueeContainer = document.getElementById('marqueeContainer');
    if (!marqueeText) return;
    marqueeText.innerHTML = '';
    let totalWidth = 0;
    for (let set = 0; set < 2; set++) {
        marqueeMessages.forEach(msg => {
            const span = document.createElement('span');
            span.innerHTML = `${msg.icon} <span class="highlight">${msg.title}:</span> ${msg.text}`;
            const tempSpan = document.createElement('span');
            tempSpan.innerHTML = span.innerHTML;
            tempSpan.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:14px Poppins;padding:0 30px;';
            document.body.appendChild(tempSpan);
            totalWidth += tempSpan.offsetWidth;
            document.body.removeChild(tempSpan);
            marqueeText.appendChild(span);
        });
    }
    const singleSetWidth = totalWidth / 2;
    marqueeContainer.style.width = `${totalWidth}px`;
    marqueeContainer.style.animationDuration = `${(totalWidth / (singleSetWidth / 60))}s`;
}

document.addEventListener('DOMContentLoaded', function() { setTimeout(initMarquee, 100); });
window.addEventListener('resize', function() { setTimeout(initMarquee, 100); });
