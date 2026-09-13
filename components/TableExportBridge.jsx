"use client";

import { useEffect, useState } from "react";

const FILTERS = [
  "All",
  "Same Day Cash",
  "Credit Airline",
  "GDS",
  "NDC",
  "Web Fare",
];

function getOfferType(notification) {
  const text = (notification || "").toLowerCase();

  if (text.includes("ndc")) return "NDC";
  if (text.includes("gds")) return "GDS";
  if (text.includes("web fare")) return "Web Fare";

  return "Credit Airline";
}

function formatDate(date) {
  if (!date) return "";

  const parts = date.split("-");
  if (parts.length !== 3) return date;

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function isExpired(date) {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(`${date}T23:59:59`);
  return expiry < today;
}

function getLogoSrc(logo) {
  if (!logo) return "";
  return logo.startsWith("/") ? logo : `/${logo}`;
}

function getCurrentFilter() {
  const activeButton = document.querySelector(".filter.active");
  const activeText = activeButton?.textContent || "";
  return FILTERS.find((filter) => activeText.includes(filter)) || "All";
}

function getCurrentSearch() {
  return document.querySelector(".search-box")?.value || "";
}

function getFilteredData(data) {
  const searchText = getCurrentSearch().toLowerCase().trim();
  const activeFilter = getCurrentFilter();

  return data.filter((item) => {
    const airline = item.airline || "";
    const notification = item.notification || "";
    const note = item.note || "";
    const category = item.category || "";
    const offerType = getOfferType(notification);

    const matchesSearch =
      !searchText ||
      airline.toLowerCase().includes(searchText) ||
      notification.toLowerCase().includes(searchText) ||
      note.toLowerCase().includes(searchText);

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Credit Airline" && category.toLowerCase() === "credit") ||
      offerType === activeFilter;

    return matchesSearch && matchesFilter;
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildTableHtml(data, title) {
  const rows = data
    .map((item) => {
      const expired = isExpired(item.validity);
      const logoSrc = getLogoSrc(item.logo);
      const logo = logoSrc
        ? `<img src="${escapeHtml(logoSrc)}" alt="${escapeHtml(item.airline)} logo" class="airline-logo" />`
        : "";

      return `
        <tr>
          <td>
            <div class="airline-cell">
              <div class="logo-box">${logo}</div>
              <div>
                <strong class="airline-name">${escapeHtml(item.airline || "-")}</strong>
                <span class="type-badge">${escapeHtml(getOfferType(item.notification))}</span>
              </div>
            </div>
          </td>
          <td>${escapeHtml(item.category || "-")}</td>
          <td class="discount-cell">${escapeHtml(item.discount || "-")}</td>
          <td>${escapeHtml(item.notification || "Standard Offer")}</td>
          <td>${escapeHtml(item.note || "-")}</td>
          <td class="${expired ? "expired" : ""}">${escapeHtml(item.validity || "-")}${expired ? " • Expired" : ""}</td>
          <td>${escapeHtml(item.instructions || "-")}</td>
        </tr>`;
    })
    .join("");

  return `
    <div class="qfc-export">
      <div class="export-header">
        <div class="brand">
          <img src="/QFClogo.png" alt="QFC Group Pvt Ltd" />
          <div>
            <h1>QFC Airline Discount Sheet</h1>
            <p>Airline Discounts, GDS Offers &amp; Travel Agent Resources</p>
          </div>
        </div>
        <div class="export-info">
          <strong>${escapeHtml(title)}</strong>
          <span>Generated: ${escapeHtml(new Date().toLocaleDateString("en-GB"))}</span>
        </div>
      </div>

      <div class="table-title">${escapeHtml(title)}</div>

      ${data.length > 0 ? `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Category</th>
                <th>Discount / Benefit</th>
                <th>Offer</th>
                <th>Note</th>
                <th>Valid Until</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      ` : `
        <div class="empty">No airline offers match the current search/filter.</div>
      `}

      <div class="export-footer">
        <strong>QFC GROUP PVT LTD</strong>
        <span>Rizwan Plaza, Main Jinnah Avenue, Blue Area, Islamabad</span>
      </div>
    </div>`;
}

function buildExportDocument(bodyHtml) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>QFC Airline Discount Sheet</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 20px; background: #ffffff; color: #334b55; font-family: Arial, Helvetica, sans-serif; }
  .qfc-export { width: 1200px; margin: 0 auto; background: #ffffff; }
  .export-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 20px; border: 1px solid #dfe7ea; border-radius: 12px; margin-bottom: 14px; }
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand img { width: 58px; height: 58px; object-fit: contain; }
  .brand h1 { margin: 0 0 4px; color: #203944; font-size: 22px; }
  .brand p { margin: 0; color: #6b7e85; font-size: 12px; }
  .export-info { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; white-space: nowrap; }
  .export-info strong { color: #087e93; font-size: 15px; }
  .export-info span { color: #71838a; font-size: 11px; }
  .table-title { margin: 14px 0 8px; color: #203944; font-size: 14px; font-weight: 800; }
  .table-wrap { border: 1px solid #dfe7ea; border-radius: 10px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 11px; }
  th { padding: 11px 9px; text-align: left; background: #f3f7f8; color: #405761; border-bottom: 1px solid #dfe7ea; font-size: 10px; text-transform: uppercase; letter-spacing: .35px; }
  td { padding: 10px 9px; border-bottom: 1px solid #e8edef; color: #4c6068; vertical-align: top; line-height: 1.4; word-break: break-word; }
  th:nth-child(1) { width: 16%; } th:nth-child(2) { width: 9%; } th:nth-child(3) { width: 12%; } th:nth-child(4) { width: 15%; } th:nth-child(5) { width: 15%; } th:nth-child(6) { width: 10%; } th:nth-child(7) { width: 23%; }
  tr:last-child td { border-bottom: 0; }
  .airline-cell { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .logo-box { width: 34px; height: 34px; flex: 0 0 34px; border-radius: 6px; background: #f5f9fa; border: 1px solid #e1eaed; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .airline-logo { width: 29px; height: 29px; object-fit: contain; }
  .airline-name { display: block; color: #203944; font-size: 11px; margin-bottom: 3px; }
  .type-badge { display: inline-block; background: #eaf8fa; color: #0a8498; border-radius: 4px; padding: 2px 4px; font-size: 8px; font-weight: 700; }
  .discount-cell { color: #087e93; font-weight: 800; white-space: nowrap; }
  .expired { color: #b14c4c; font-weight: 700; }
  .empty { padding: 35px; text-align: center; border: 1px solid #dfe7ea; border-radius: 10px; color: #71838a; }
  .export-footer { display: flex; justify-content: space-between; gap: 20px; margin-top: 14px; padding: 12px 4px; color: #71838a; font-size: 10px; }
  .export-footer strong { color: #203944; }
  @media print { body { padding: 0; } .qfc-export { width: 1200px; } @page { size: A4 landscape; margin: 8mm; } }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

async function loadData() {
  const response = await fetch("/api/data", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load airline data");

  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Invalid airline data received");

  return data;
}

function waitForImages(container) {
  const images = Array.from(container.querySelectorAll("img"));

  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }

          img.onload = resolve;
          img.onerror = resolve;
        })
    )
  );
}

export default function TableExportBridge() {
  const [tableView, setTableView] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    const syncView = () => {
      setTableView(document.body.dataset.qfcView === "table");
    };

    syncView();
    window.addEventListener("qfc-view-change", syncView);

    return () => window.removeEventListener("qfc-view-change", syncView);
  }, []);

  useEffect(() => {
    if (!tableView) {
      setMenuOpen(false);
      setAnchor(null);
      return undefined;
    }

    const handleExportClick = (event) => {
      const button = event.target?.closest?.(".export-button");
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const rect = button.getBoundingClientRect();
      setAnchor({
        top: rect.bottom + 8,
        left: Math.max(10, rect.right - 330),
      });
      setMenuOpen((open) => !open);
    };

    document.addEventListener("click", handleExportClick, true);

    const handleOutsideClick = (event) => {
      if (event.target?.closest?.("[data-table-export-menu]") || event.target?.closest?.(".export-button")) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleExportClick, true);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [tableView]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const reposition = () => {
      const button = document.querySelector(".export-button");
      if (!button) return;

      const rect = button.getBoundingClientRect();
      setAnchor({
        top: rect.bottom + 8,
        left: Math.max(10, rect.right - 330),
      });
    };

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [menuOpen]);

  if (!tableView || !menuOpen || !anchor) return null;

  const runExport = async (type, format) => {
    const key = `${type}-${format}`;
    setBusy(key);

    try {
      const data = await loadData();
      const exportData = type === "filtered" ? getFilteredData(data) : data;
      const title = type === "filtered" ? "Filtered Offers" : "Complete Sheet";
      const bodyHtml = buildTableHtml(exportData, title);
      const documentHtml = buildExportDocument(bodyHtml);

      if (format === "print") {
        const printWindow = window.open("", "_blank", "width=1200,height=900");

        if (!printWindow) {
          alert("Please allow pop-ups for this site to print the table.");
          return;
        }

        printWindow.document.open();
        printWindow.document.write(documentHtml);
        printWindow.document.close();
        printWindow.focus();

        await new Promise((resolve) => setTimeout(resolve, 400));
        printWindow.print();
        return;
      }

      const exportContainer = document.createElement("div");
      exportContainer.style.position = "fixed";
      exportContainer.style.left = "-20000px";
      exportContainer.style.top = "0";
      exportContainer.style.width = "1200px";
      exportContainer.style.background = "#ffffff";
      exportContainer.innerHTML = bodyHtml;
      document.body.appendChild(exportContainer);

      try {
        await waitForImages(exportContainer);

        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(exportContainer.firstElementChild, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        if (format === "jpg") {
          canvas.toBlob(
            (blob) => {
              if (!blob) return;

              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `QFC-Discount-Sheet-${type === "filtered" ? "Filtered" : "Complete"}-Table.jpg`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(url);
            },
            "image/jpeg",
            0.95
          );
          return;
        }

        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = 297;
        const pageHeight = 210;
        const margin = 7;
        const availableWidth = pageWidth - margin * 2;
        const imageHeight = (canvas.height * availableWidth) / canvas.width;
        const printableHeight = pageHeight - margin * 2;
        let heightLeft = imageHeight;
        let position = margin;

        pdf.addImage(imgData, "JPEG", margin, position, availableWidth, imageHeight);
        heightLeft -= printableHeight;

        while (heightLeft > 0) {
          position = margin - (imageHeight - heightLeft);
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", margin, position, availableWidth, imageHeight);
          heightLeft -= printableHeight;
        }

        pdf.save(`QFC-Discount-Sheet-${type === "filtered" ? "Filtered" : "Complete"}-Table.pdf`);
      } finally {
        exportContainer.remove();
      }
    } catch (error) {
      console.error("Table export error:", error);
      alert("Unable to export the table right now. Please try again.");
    } finally {
      setBusy("");
      setMenuOpen(false);
    }
  };

  const menuStyle = {
    position: "fixed",
    top: `${anchor.top}px`,
    left: `${anchor.left}px`,
    width: "330px",
    zIndex: 10000,
    padding: "14px",
    border: "1px solid #dfe7ea",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  };

  const groupStyle = {
    padding: "10px",
    border: "1px solid #e6edef",
    borderRadius: "9px",
    marginTop: "10px",
  };

  const actionRowStyle = {
    display: "flex",
    gap: "6px",
    marginTop: "8px",
  };

  const actionButtonStyle = {
    flex: 1,
    border: "1px solid #cfdde2",
    borderRadius: "7px",
    background: "#f8fbfc",
    color: "#3f5963",
    padding: "7px 5px",
    fontSize: "11px",
    fontWeight: 700,
    cursor: busy ? "wait" : "pointer",
  };

  return (
    <div
      data-table-export-menu
      style={menuStyle}
      onClick={(event) => event.stopPropagation()}
    >
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#203944" }}>
        Export Discount Sheet
      </div>
      <div style={{ marginTop: "3px", fontSize: "10px", color: "#71838a" }}>
        Table View is active — exports will use the table layout.
      </div>

      <div style={groupStyle}>
        <strong style={{ display: "block", fontSize: "12px", color: "#203944" }}>
          Filtered Offers
        </strong>
        <span style={{ display: "block", marginTop: "2px", fontSize: "10px", color: "#71838a" }}>
          Current search and filter results
        </span>
        <div style={actionRowStyle}>
          <button type="button" style={actionButtonStyle} disabled={!!busy} onClick={() => runExport("filtered", "print")}>🖨️ Print</button>
          <button type="button" style={actionButtonStyle} disabled={!!busy} onClick={() => runExport("filtered", "pdf")}>📄 PDF</button>
          <button type="button" style={actionButtonStyle} disabled={!!busy} onClick={() => runExport("filtered", "jpg")}>🖼️ JPG</button>
        </div>
      </div>

      <div style={groupStyle}>
        <strong style={{ display: "block", fontSize: "12px", color: "#203944" }}>
          Complete Sheet
        </strong>
        <span style={{ display: "block", marginTop: "2px", fontSize: "10px", color: "#71838a" }}>
          All airline offers in arranged order
        </span>
        <div style={actionRowStyle}>
          <button type="button" style={actionButtonStyle} disabled={!!busy} onClick={() => runExport("complete", "print")}>🖨️ Print</button>
          <button type="button" style={actionButtonStyle} disabled={!!busy} onClick={() => runExport("complete", "pdf")}>📄 PDF</button>
          <button type="button" style={actionButtonStyle} disabled={!!busy} onClick={() => runExport("complete", "jpg")}>🖼️ JPG</button>
        </div>
      </div>
    </div>
  );
}
