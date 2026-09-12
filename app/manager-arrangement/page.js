"use client";

import { useEffect, useState } from "react";

function labelFor(item, index) {
  const airline = String(item?.airline || "Unnamed Airline").trim() || "Unnamed Airline";
  const type = String(item?.notification || item?.category || "Offer").trim();
  const discount = String(item?.discount || "").trim();
  return `${airline}${type ? ` — ${type}` : ""}${discount ? ` — ${discount}` : ""} (#${index + 1})`;
}

export default function ManagerArrangementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  async function loadData() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const sessionResponse = await fetch("/api/admin/session", {
        cache: "no-store",
      });
      const session = await sessionResponse.json();

      if (!session.authenticated) {
        setError("Manager login is required. Please log in from the main discount sheet first.");
        return;
      }

      const response = await fetch("/api/admin/data", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.success || !Array.isArray(result.data)) {
        throw new Error(result.error || "Unable to load airline data.");
      }

      setItems(result.data);
    } catch (err) {
      setError(err.message || "Unable to load airline data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function moveItem(from, to) {
    if (to < 0 || to >= items.length || from === to) return;

    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function handleDrop(targetIndex) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    moveItem(dragIndex, targetIndex);
    setDragIndex(null);
  }

  async function saveArrangement() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: items }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save arrangement.");
      }

      setMessage("Arrangement saved successfully. The public discount sheet will use this order.");
    } catch (err) {
      setError(err.message || "Unable to save arrangement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Arrange Airline Offers</h1>
            <p style={styles.subtitle}>
              Arrange every card individually. Duplicate airlines remain separate items.
            </p>
          </div>
          <a href="/" style={styles.backButton}>← Back to Discount Sheet</a>
        </div>

        <div style={styles.notice}>
          <strong>How it works:</strong> Drag any card to a new position, or use ↑ / ↓. Nothing is grouped.
          Etihad offer 1 and Etihad offer 2 stay as two separate cards, but you can place them anywhere you want.
        </div>

        {loading && <div style={styles.status}>Loading current airline order…</div>}

        {!loading && error && (
          <div style={styles.error}>{error}</div>
        )}

        {!loading && !error && (
          <>
            <div style={styles.toolbar}>
              <span style={styles.count}>{items.length} individual offer cards</span>
              <button type="button" onClick={loadData} disabled={saving} style={styles.secondaryButton}>
                ↻ Reload
              </button>
              <button type="button" onClick={saveArrangement} disabled={saving} style={styles.saveButton}>
                {saving ? "Saving…" : "Save Arrangement"}
              </button>
            </div>

            <div style={styles.list}>
              {items.map((item, index) => (
                <div
                  key={`${index}-${item?.airline || "offer"}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => setDragIndex(null)}
                  style={{
                    ...styles.card,
                    ...(dragIndex === index ? styles.dragging : {}),
                  }}
                >
                  <div style={styles.handle}>☷</div>
                  <div style={styles.number}>{index + 1}</div>
                  <div style={styles.info}>
                    <div style={styles.airline}>{String(item?.airline || "Unnamed Airline")}</div>
                    <div style={styles.details}>{labelFor(item, index).replace(/^.*? — /, "")}</div>
                    {item?.note ? <div style={styles.note}>{String(item.note)}</div> : null}
                  </div>
                  <div style={styles.actions}>
                    <button
                      type="button"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      style={styles.arrowButton}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === items.length - 1}
                      style={styles.arrowButton}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.bottomBar}>
              <button type="button" onClick={saveArrangement} disabled={saving} style={styles.saveButton}>
                {saving ? "Saving…" : "Save Arrangement"}
              </button>
              {message ? <span style={styles.success}>{message}</span> : null}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px 18px 60px",
    background: "#f3f6f8",
    color: "#17212b",
    fontFamily: "Arial, sans-serif",
  },
  panel: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 8px 30px rgba(0,0,0,.10)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  title: { margin: 0, fontSize: "28px" },
  subtitle: { margin: "8px 0 0", color: "#66727d" },
  backButton: {
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "9px",
    background: "#eef3f6",
    color: "#17212b",
    fontWeight: 700,
  },
  notice: {
    padding: "14px 16px",
    borderRadius: "10px",
    background: "#fff8d9",
    border: "1px solid #eadb82",
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  status: { padding: "30px", textAlign: "center" },
  error: {
    padding: "15px",
    borderRadius: "10px",
    background: "#ffe8e8",
    color: "#a30000",
    fontWeight: 700,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  count: { marginRight: "auto", fontWeight: 700, color: "#53616c" },
  secondaryButton: {
    border: 0,
    borderRadius: "9px",
    padding: "10px 15px",
    cursor: "pointer",
    background: "#e9eef2",
    fontWeight: 700,
  },
  saveButton: {
    border: 0,
    borderRadius: "9px",
    padding: "11px 18px",
    cursor: "pointer",
    background: "#0aa6c0",
    color: "white",
    fontWeight: 800,
  },
  list: { display: "flex", flexDirection: "column", gap: "8px" },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    border: "1px solid #dfe5e9",
    borderRadius: "12px",
    background: "#fff",
    cursor: "grab",
    transition: "opacity .15s, transform .15s",
  },
  dragging: { opacity: 0.45, transform: "scale(.99)" },
  handle: { fontSize: "24px", color: "#8a969f", width: "28px", textAlign: "center" },
  number: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#eef5f7",
    fontWeight: 800,
  },
  info: { flex: 1, minWidth: 0 },
  airline: { fontWeight: 800, fontSize: "16px" },
  details: { marginTop: "3px", color: "#596771", fontSize: "13px" },
  note: { marginTop: "4px", color: "#7b8790", fontSize: "12px" },
  actions: { display: "flex", gap: "5px" },
  arrowButton: {
    width: "38px",
    height: "38px",
    border: "1px solid #d4dce1",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "19px",
    fontWeight: 800,
    cursor: "pointer",
  },
  bottomBar: {
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #e5eaed",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  success: { color: "#147a42", fontWeight: 700 },
};
