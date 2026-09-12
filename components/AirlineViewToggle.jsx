"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

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

export default function AirlineViewToggle() {
  const pathname = usePathname();
  const [view, setView] = useState("card");
  const [mounted, setMounted] = useState(false);
  const [mountNode, setMountNode] = useState(null);
  const [tableNode, setTableNode] = useState(null);
  const [airlineData, setAirlineData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (pathname !== "/") return undefined;

    const findNodes = () => {
      setMountNode(
        document.querySelector(".airline-section .section-heading")
      );
      setTableNode(document.querySelector(".airline-section"));
    };

    findNodes();
    const timer = setTimeout(findNodes, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!mounted || pathname !== "/") return undefined;

    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch("/api/data", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (!cancelled && Array.isArray(data)) setAirlineData(data);
      } catch (error) {
        console.error("Airline view data error:", error);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted || pathname !== "/") return undefined;

    const updateControls = () => {
      const searchInput = document.querySelector(".search-box");
      setSearch(searchInput?.value || "");

      const activeButton = document.querySelector(".filter.active");
      const activeText = activeButton?.textContent || "";
      const foundFilter = FILTERS.find((filter) => activeText.includes(filter));
      setActiveFilter(foundFilter || "All");
    };

    const handleInput = (event) => {
      if (event.target?.classList?.contains("search-box")) updateControls();
    };

    const handleClick = (event) => {
      if (event.target?.closest?.(".filter")) setTimeout(updateControls, 0);
    };

    updateControls();
    document.addEventListener("input", handleInput);
    document.addEventListener("click", handleClick);

    const observer = new MutationObserver(updateControls);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      document.removeEventListener("input", handleInput);
      document.removeEventListener("click", handleClick);
      observer.disconnect();
    };
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted || pathname !== "/") return undefined;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });
        const result = response.ok ? await response.json() : null;
        setIsEditor(result?.authenticated === true);
      } catch {
        setIsEditor(false);
      }
    }

    checkSession();
    const timer = setInterval(checkSession, 15000);
    return () => clearInterval(timer);
  }, [mounted, pathname]);

  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return airlineData.filter((item) => {
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
  }, [airlineData, search, activeFilter]);

  useEffect(() => {
    const grid = document.querySelector(".airline-grid");
    if (grid) grid.style.display = view === "table" ? "none" : "";

    return () => {
      if (grid) grid.style.display = "";
    };
  }, [view, filteredData]);

  const runExistingCardAction = (rowIndex, actionIndex) => {
    const cards = document.querySelectorAll(".airline-grid .airline-card");
    const card = cards[rowIndex];
    if (!card) return;

    const buttons = card.querySelectorAll(".manager-card-actions button");
    buttons[actionIndex]?.click();
  };

  if (!mounted || pathname !== "/" || !mountNode || !tableNode) return null;

  const toggle = (
    <div style={styles.wrapper}>
      <button
        type="button"
        onClick={() => setView("card")}
        style={{
          ...styles.button,
          ...(view === "card" ? styles.activeButton : {}),
          borderRadius: "8px 0 0 8px",
        }}
      >
        ▦ Card View
      </button>

      <button
        type="button"
        onClick={() => setView("table")}
        style={{
          ...styles.button,
          ...(view === "table" ? styles.activeButton : {}),
          borderRadius: "0 8px 8px 0",
          borderLeft: "0",
        }}
      >
        ☷ Table View
      </button>
    </div>
  );

  const table =
    view === "table" && filteredData.length > 0
      ? (
        <div style={styles.tableWrap}>
          <div style={styles.tableScroll}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Airline</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Discount / Benefit</th>
                  <th style={styles.th}>Offer</th>
                  <th style={styles.th}>Note</th>
                  <th style={styles.th}>Valid Until</th>
                  <th style={styles.th}>Instructions</th>
                  {isEditor && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const expired = item.validity
                    ? new Date(`${item.validity}T23:59:59`) < new Date()
                    : false;

                  return (
                    <tr key={`${item.airline}-${item.notification}-${index}`}>
                      <td style={styles.td}>
                        <div style={styles.airlineCell}>
                          <div style={styles.logoBox}>
                            <img
                              src={`/${item.logo}`}
                              alt={`${item.airline} logo`}
                              style={styles.logo}
                            />
                          </div>
                          <div>
                            <strong style={styles.airlineName}>
                              {item.airline || "-"}
                            </strong>
                            <span style={styles.typeBadge}>
                              {getOfferType(item.notification)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>{item.category || "-"}</td>
                      <td style={{ ...styles.td, ...styles.discountCell }}>
                        {item.discount || "-"}
                      </td>
                      <td style={styles.td}>{item.notification || "Standard Offer"}</td>
                      <td style={styles.td}>{item.note || "-"}</td>
                      <td style={{ ...styles.td, ...(expired ? styles.expired : {}) }}>
                        {item.validity || "-"}
                        {expired ? " • Expired" : ""}
                      </td>
                      <td style={styles.td}>{item.instructions || "-"}</td>
                      {isEditor && (
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            <button
                              type="button"
                              style={styles.editButton}
                              onClick={() => runExistingCardAction(index, 0)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              style={styles.deleteButton}
                              onClick={() => runExistingCardAction(index, 1)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )
      : null;

  return (
    <>
      {createPortal(toggle, mountNode)}
      {createPortal(table, tableNode)}
    </>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: "auto",
  },
  button: {
    minHeight: "38px",
    padding: "8px 13px",
    border: "1px solid #cfdde2",
    background: "#ffffff",
    color: "#49636d",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeButton: {
    background: "#0aa6c0",
    borderColor: "#0aa6c0",
    color: "#ffffff",
  },
  tableWrap: {
    width: "100%",
    marginBottom: "20px",
    border: "1px solid #dfe7ea",
    borderRadius: "12px",
    background: "#ffffff",
    overflow: "hidden",
    boxShadow: "0 4px 14px rgba(0,0,0,0.035)",
  },
  tableScroll: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "1100px",
    borderCollapse: "collapse",
    fontSize: "12px",
  },
  th: {
    textAlign: "left",
    padding: "12px 11px",
    background: "#f3f7f8",
    color: "#405761",
    borderBottom: "1px solid #dfe7ea",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "11px",
    borderBottom: "1px solid #e8edef",
    color: "#4c6068",
    verticalAlign: "top",
    lineHeight: 1.45,
  },
  airlineCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    minWidth: "150px",
  },
  logoBox: {
    width: "40px",
    height: "40px",
    borderRadius: "7px",
    background: "#f5f9fa",
    border: "1px solid #e1eaed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  logo: {
    width: "34px",
    height: "34px",
    objectFit: "contain",
  },
  airlineName: {
    display: "block",
    color: "#203944",
    fontSize: "12px",
    marginBottom: "4px",
  },
  typeBadge: {
    display: "inline-block",
    background: "#eaf8fa",
    color: "#0a8498",
    borderRadius: "4px",
    padding: "3px 5px",
    fontSize: "9px",
    fontWeight: 700,
  },
  discountCell: {
    color: "#087e93",
    fontWeight: 800,
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  expired: {
    color: "#b14c4c",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: "6px",
    whiteSpace: "nowrap",
  },
  editButton: {
    border: "1px solid #b7dfe7",
    background: "#eef9fb",
    color: "#087e93",
    borderRadius: "6px",
    padding: "6px 9px",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },
  deleteButton: {
    border: "1px solid #f0caca",
    background: "#fff3f3",
    color: "#a33b3b",
    borderRadius: "6px",
    padding: "6px 9px",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
