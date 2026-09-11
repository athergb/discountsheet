"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

function todayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isActiveOffer(item) {
  if (!item?.validity) return true;
  return item.validity >= todayString();
}

export default function BulkValidityUpdate() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [validity, setValidity] = useState("");
  const [scope, setScope] = useState("all");
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
      setAuthenticated(false);
      return;
    }

    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });

        const result = response.ok ? await response.json() : null;

        if (!cancelled) {
          setAuthenticated(result?.authenticated === true);
        }
      } catch {
        if (!cancelled) {
          setAuthenticated(false);
        }
      }
    }

    checkSession();

    const timer = setInterval(checkSession, 15000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!authenticated) {
      setOpen(false);
    }
  }, [authenticated]);

  const activeCount = useMemo(
    () => data.filter(isActiveOffer).length,
    [data]
  );

  const targetCount = scope === "all" ? data.length : activeCount;

  async function openManager() {
    setOpen(true);
    setError("");
    setSuccess("");
    setValidity("");
    setScope("all");

    setLoadingData(true);

    try {
      const response = await fetch("/api/admin/data", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || result?.success !== true || !Array.isArray(result.data)) {
        throw new Error(result?.error || "Unable to load airline data.");
      }

      setData(result.data);
    } catch (loadError) {
      setData([]);
      setError(loadError.message || "Unable to load airline data.");
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validity) {
      setError("Please select a new Valid Until date.");
      return;
    }

    if (targetCount === 0) {
      setError("There are no offers available for the selected scope.");
      return;
    }

    const scopeText = scope === "all" ? "all" : "active";
    const confirmed = window.confirm(
      `You are about to update the Valid Until date to ${validity} for ${targetCount} ${scopeText} airline offer${targetCount === 1 ? "" : "s"}.\n\nDo you want to continue?`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedData = data.map((item) => {
        if (scope === "all" || isActiveOffer(item)) {
          return {
            ...item,
            validity,
          };
        }

        return item;
      });

      const response = await fetch("/api/admin/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: updatedData }),
      });

      const result = await response.json();

      if (!response.ok || result?.success !== true) {
        throw new Error(result?.error || "Unable to save airline data.");
      }

      setData(updatedData);
      setSuccess(
        `Validity updated successfully for ${targetCount} airline offer${targetCount === 1 ? "" : "s"}.`
      );
    } catch (saveError) {
      setError(saveError.message || "Unable to save airline data.");
    } finally {
      setSaving(false);
    }
  }

  if (pathname !== "/" || !authenticated) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={openManager}
        style={styles.launcher}
      >
        Bulk Validity Update
      </button>

      {open && (
        <div style={styles.overlay}>
          <div style={styles.modal} role="dialog" aria-modal="true">
            <div style={styles.header}>
              <div>
                <div style={styles.kicker}>QFC MANAGER</div>
                <h2 style={styles.title}>Bulk Validity Date Update</h2>
                <p style={styles.subtitle}>
                  Update Valid Until dates for multiple airline offers at once.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                style={styles.close}
                aria-label="Close bulk validity update"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.body}>
              <div style={styles.summary}>
                <strong>{data.length}</strong>
                <span>Total airline offers loaded</span>
                <strong>{activeCount}</strong>
                <span>Currently active offers</span>
              </div>

              <label style={styles.label} htmlFor="bulk-validity-date">
                New Valid Until
              </label>
              <input
                id="bulk-validity-date"
                type="date"
                value={validity}
                onChange={(event) => {
                  setValidity(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                style={styles.input}
                disabled={saving || loadingData}
              />

              <div style={styles.sectionTitle}>Apply To</div>

              <label style={styles.radioRow}>
                <input
                  type="radio"
                  name="bulk-validity-scope"
                  value="all"
                  checked={scope === "all"}
                  onChange={() => setScope("all")}
                  disabled={saving || loadingData}
                />
                <span>
                  <strong>All Airlines</strong>
                  <small>Update every airline offer in the data.</small>
                </span>
              </label>

              <label style={styles.radioRow}>
                <input
                  type="radio"
                  name="bulk-validity-scope"
                  value="active"
                  checked={scope === "active"}
                  onChange={() => setScope("active")}
                  disabled={saving || loadingData}
                />
                <span>
                  <strong>Active Airlines Only</strong>
                  <small>Leave already-expired offers unchanged.</small>
                </span>
              </label>

              {loadingData && (
                <div style={styles.info}>Loading current airline data…</div>
              )}

              {error && <div style={styles.error}>{error}</div>}
              {success && <div style={styles.success}>{success}</div>}

              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={styles.cancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.primary}
                  disabled={saving || loadingData || data.length === 0}
                >
                  {saving ? "Updating…" : "Update Validity Dates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  launcher: {
    position: "fixed",
    right: "22px",
    bottom: "22px",
    zIndex: 9990,
    border: "0",
    borderRadius: "10px",
    padding: "11px 16px",
    background: "#0aa6c0",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    background: "rgba(10, 20, 30, 0.68)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    overflowY: "auto",
  },
  modal: {
    width: "100%",
    maxWidth: "620px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 24px 70px rgba(0,0,0,0.30)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    padding: "22px 24px",
    borderBottom: "1px solid #e4eaed",
    background: "linear-gradient(135deg, #f5fbfc, #fff)",
  },
  kicker: {
    marginBottom: "5px",
    color: "#0a879b",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  title: {
    margin: 0,
    color: "#17232d",
    fontSize: "22px",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#69757d",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  close: {
    width: "36px",
    height: "36px",
    border: "0",
    borderRadius: "50%",
    background: "#edf2f4",
    color: "#17232d",
    fontSize: "24px",
    lineHeight: 1,
    cursor: "pointer",
    flexShrink: 0,
  },
  body: {
    padding: "22px 24px 24px",
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: "10px",
    rowGap: "3px",
    marginBottom: "20px",
    padding: "14px 16px",
    borderRadius: "11px",
    background: "#f6f9fa",
    color: "#65727a",
    fontSize: "13px",
  },
  label: {
    display: "block",
    marginBottom: "7px",
    color: "#34424c",
    fontSize: "13px",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    minHeight: "44px",
    boxSizing: "border-box",
    border: "1px solid #cfd8de",
    borderRadius: "9px",
    padding: "10px 12px",
    color: "#17232d",
    background: "#fff",
    fontSize: "14px",
    marginBottom: "20px",
  },
  sectionTitle: {
    marginBottom: "10px",
    color: "#34424c",
    fontSize: "13px",
    fontWeight: 700,
  },
  radioRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "11px 12px",
    marginBottom: "9px",
    border: "1px solid #e0e7ea",
    borderRadius: "10px",
    cursor: "pointer",
  },
  info: {
    marginTop: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#f1f7f8",
    color: "#49646c",
    fontSize: "12px",
  },
  error: {
    marginTop: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#fff2f2",
    color: "#a33b3b",
    fontSize: "12px",
  },
  success: {
    marginTop: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#eefaf4",
    color: "#26754a",
    fontSize: "12px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  cancel: {
    minHeight: "42px",
    border: "0",
    borderRadius: "9px",
    padding: "10px 18px",
    background: "#edf1f3",
    color: "#34424c",
    fontWeight: 700,
    cursor: "pointer",
  },
  primary: {
    minHeight: "42px",
    border: "0",
    borderRadius: "9px",
    padding: "10px 18px",
    background: "#0aa6c0",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
