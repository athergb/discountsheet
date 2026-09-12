"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DiscountCalculator from "../components/DiscountCalculator";

const filters = [
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

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedOffer, setSelectedOffer] = useState(null);

  // =========================
  // WELCOME SCREEN
  // =========================

  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [welcomeClosing, setWelcomeClosing] = useState(false);

  const partnerLogos = [
    {
      file: "/QBlogo.png",
      alt: "QB Logo",
    },
    {
      file: "/FClogo.png",
      alt: "FC Logo",
    },
    {
      file: "/TDlogo.jpeg",
      alt: "TD Logo",
    },
    {
      file: "/TPlogo.png",
      alt: "TP Logo",
    },

    // =========================
    // ADD FUTURE LOGOS HERE
    // =========================
    // {
    //   file: "/NewLogo.png",
    //   alt: "New Logo",
    // },
  ];

  // =========================
  // MARKETING ALBUM
  // =========================
  const marketingImages = [
  { file: "/marketing/marketing-1.jpeg", title: "QFC Marketing 1" },
  { file: "/marketing/marketing-2.jpeg", title: "QFC Marketing 2" },
  { file: "/marketing/marketing-3.jpeg", title: "QFC Marketing 3" },
  { file: "/marketing/marketing-4.jpeg", title: "QFC Marketing 4" },
  { file: "/marketing/marketing-5.jpeg", title: "QFC Marketing 5" },
  { file: "/marketing/marketing-6.jpeg", title: "QFC Marketing 6" },
  { file: "/marketing/marketing-7.jpeg", title: "QFC Marketing 7" },
  { file: "/marketing/marketing-8.jpeg", title: "QFC Marketing 8" },
  { file: "/marketing/marketing-9.jpeg", title: "QFC Marketing 9" },
  { file: "/marketing/marketing-10.jpeg", title: "QFC Marketing 10" },
  { file: "/marketing/marketing-11.jpeg", title: "QFC Marketing 11" },
  { file: "/marketing/marketing-12.jpeg", title: "QFC Marketing 12" },
  { file: "/marketing/marketing-13.jpeg", title: "QFC Marketing 13" },
  ];

  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumIndex, setAlbumIndex] = useState(0);

  // =========================
  // EDIT
  // =========================

  const [editingOffer, setEditingOffer] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  // =========================
  // DELETE
  // =========================

  const [deleteOffer, setDeleteOffer] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // =========================
  // ADD NEW OFFER
  // =========================

  const [addOfferOpen, setAddOfferOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    category: "",
    airline: "",
    discount: "",
    logo: "",
    note: "",
    notification: "",
    validity: "",
    instructions: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // =========================
  // OTHER
  // =========================

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [printTarget, setPrintTarget] = useState(null);

  // =========================
  // DOCUMENTS
  // =========================

  const [documentsOpen, setDocumentsOpen] = useState(false);

  const [airlineData, setAirlineData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  // =========================
  // ADMIN
  // =========================

  const [isEditor, setIsEditor] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const exportRef = useRef(null);

  // =========================
  // WELCOME SCREEN TIMER
  // =========================

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setWelcomeClosing(true);
    }, 5000);

    const removeTimer = setTimeout(() => {
      setWelcomeVisible(false);
    }, 5800);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // =========================
  // ALBUM AUTO SLIDESHOW
  // =========================

  useEffect(() => {
    if (marketingImages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setAlbumIndex((current) => {
        return (current + 1) % marketingImages.length;
      });
    }, 4000);

    return () => {
      clearInterval(timer);
    };
  }, [marketingImages.length]);

  // =========================
  // ALBUM POPUP KEYBOARD
  // =========================

  useEffect(() => {
    if (!albumOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setAlbumOpen(false);
      }

      if (event.key === "ArrowRight") {
        setAlbumIndex((current) => {
          return (current + 1) % marketingImages.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setAlbumIndex((current) => {
          return (
            (current - 1 + marketingImages.length) %
            marketingImages.length
          );
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [albumOpen, marketingImages.length]);

  // =========================
  // AFTER PRINT
  // =========================

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintTarget(null);
    };

    window.addEventListener(
      "afterprint",
      handleAfterPrint
    );

    return () => {
      window.removeEventListener(
        "afterprint",
        handleAfterPrint
      );
    };
  }, []);

  // =========================
  // LOAD AIRLINE DATA
  // =========================

  useEffect(() => {
    async function loadAirlineData() {
      try {
        setDataLoading(true);
        setDataError("");

        const response = await fetch("/api/data", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "Failed to load airline data"
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid airline data received"
          );
        }

        setAirlineData(data);
      } catch (error) {
        console.error(
          "Error loading airline data:",
          error
        );

        setDataError(
          "Unable to load airline discount data."
        );
      } finally {
        setDataLoading(false);
      }
    }

    loadAirlineData();
  }, []);

  // =========================
  // CHECK ADMIN SESSION
  // =========================

  useEffect(() => {
    async function checkAdminSession() {
      try {
        const response = await fetch(
          "/api/admin/session",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setIsEditor(false);
          return;
        }

        const result =
          await response.json();

        setIsEditor(
          result.authenticated === true
        );
      } catch (error) {
        console.error(
          "Admin session check error:",
          error
        );

        setIsEditor(false);
      }
    }

    checkAdminSession();
  }, []);

  // =========================
  // FILTERED AIRLINES
  // =========================

  const filteredAirlines = useMemo(() => {
    return airlineData.filter((item) => {
      const searchText =
        search.toLowerCase().trim();

      const airline =
        item.airline || "";

      const notification =
        item.notification || "";

      const note =
        item.note || "";

      const category =
        item.category || "";

      const matchesSearch =
        !searchText ||
        airline
          .toLowerCase()
          .includes(searchText) ||
        notification
          .toLowerCase()
          .includes(searchText) ||
        note
          .toLowerCase()
          .includes(searchText);

      const offerType =
        getOfferType(notification);

      const matchesFilter =
        activeFilter === "All" ||
        (
          activeFilter === "Credit Airline" &&
          category.toLowerCase() === "credit"
        ) ||
        offerType === activeFilter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    airlineData,
    search,
    activeFilter,
  ]);

  // =========================
  // DOCUMENTS
  // =========================

  const documents = [
    {
      name: "OKTB Undertaking",
      file: "/documents/OKTB-undertaking.docx",
      type: "DOCX",
    },
    {
      name: "B2B White Label Service Agreement",
      file: "/documents/B2B-White-Label-Service-Agreement.docx",
      type: "DOCX",
    },
    {
      name: "Check List for Service Agreement",
      file: "/documents/Check-List-for-Service-Agreement.docx",
      type: "DOCX",
    },
    {
      name: "Service Agreement",
      file: "/documents/Service-Agreement.docx",
      type: "DOCX",
    },
    {
      name: "GDS ID Undertaking",
      file: "/documents/GDS-ID-Undertaking.docx",
      type: "DOCX",
    },
    {
      name: "QFC Bank Accounts",
      file: "/documents/QFC-Bank-Accounts.jpeg",
      type: "IMAGE",
    },
  ];

  // =========================
  // ALBUM FUNCTIONS
  // =========================

  const openAlbum = () => {
    if (marketingImages.length === 0) {
      return;
    }

    setAlbumOpen(true);
  };

  const nextAlbumImage = () => {
    setAlbumIndex((current) => {
      return (
        (current + 1) %
        marketingImages.length
      );
    });
  };

  const previousAlbumImage = () => {
    setAlbumIndex((current) => {
      return (
        (current - 1 + marketingImages.length) %
        marketingImages.length
      );
    });
  };

  // =========================
  // EXPORT FUNCTIONS
  // =========================

  const getExportOffers = (type) => {
    return type === "filtered"
      ? filteredAirlines
      : airlineData;
  };

  const downloadBlob = (
    blob,
    filename
  ) => {
    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  const waitForImages = async (
    container
  ) => {
    const images =
      Array.from(
        container.querySelectorAll("img")
      );

    await Promise.all(
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
  };

  const exportAsJPG = async (
    type
  ) => {
    if (!exportRef.current) return;

    setExportMenuOpen(false);

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 100)
    );

    await waitForImages(
      exportRef.current
    );

    const html2canvas =
      (
        await import("html2canvas")
      ).default;

    const canvas =
      await html2canvas(
        exportRef.current,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        }
      );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        downloadBlob(
          blob,
          `QFC-Discount-Sheet-${
            type === "filtered"
              ? "Filtered"
              : "Complete"
          }.jpg`
        );
      },
      "image/jpeg",
      0.95
    );
  };

  const exportAsPDF = async (
    type
  ) => {
    if (!exportRef.current) return;

    setExportMenuOpen(false);

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 100)
    );

    await waitForImages(
      exportRef.current
    );

    const html2canvas =
      (
        await import("html2canvas")
      ).default;

    const { jsPDF } =
      await import("jspdf");

    const canvas =
      await html2canvas(
        exportRef.current,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        }
      );

    const imgData =
      canvas.toDataURL(
        "image/jpeg",
        0.95
      );

    const pdf =
      new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 8;

    const availableWidth =
      pageWidth - margin * 2;

    const imageHeight =
      (canvas.height *
        availableWidth) /
      canvas.width;

    let heightLeft =
      imageHeight;

    let position = margin;

    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      position,
      availableWidth,
      imageHeight
    );

    heightLeft -=
      pageHeight - margin * 2;

    while (heightLeft > 0) {
      position =
        margin -
        (
          imageHeight -
          heightLeft
        );

      pdf.addPage();

      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        position,
        availableWidth,
        imageHeight
      );

      heightLeft -=
        pageHeight - margin * 2;
    }

    pdf.save(
      `QFC-Discount-Sheet-${
        type === "filtered"
          ? "Filtered"
          : "Complete"
      }.pdf`
    );
  };

  const printOffers = (
    type
  ) => {
    setExportMenuOpen(false);
    setPrintTarget(type);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <main className="qfc-page">

      {/* =========================
          WELCOME SCREEN
      ========================= */}

      {welcomeVisible && (

        <div
          id="welcome-screen"
          className={
            welcomeClosing
              ? "welcome-hidden"
              : ""
          }
        >

          <img
            src="/QFClogo.png"
            alt="QFC Group logo"
            className="qfc-main-logo"
          />

          <div className="partner-logos-container">

            <div className="partner-logos-grid">

              {partnerLogos.map(
                (logo, index) => (

                  <div
                    className="partner-logo-item"
                    key={`${logo.file}-${index}`}
                    style={{
                      animation:
                        "slideUpLogo 0.5s ease-out forwards",
                      animationDelay:
                        `${1.3 + index * 0.1}s`,
                    }}
                  >

                    <img
                      src={logo.file}
                      alt={logo.alt}
                      className="partner-logo-img"
                    />

                  </div>

                )
              )}

            </div>

          </div>

          <div className="welcome-text">
            Welcome to QFC Group Pvt Ltd
          </div>

        </div>

      )}

      {/* HEADER */}

      <header className="qfc-header">

        <div className="brand-area">

          <img
            src="/QFClogo.png"
            alt="QFC Group Pvt Ltd"
            className="qfc-logo"
          />

          <div className="brand-text">

            <h1>
              QFC Airline Discount Sheet
            </h1>

            <p>
              Airline Discounts, GDS Offers & Travel Agent Resources
            </p>

          </div>

        </div>

        <div className="header-actions">

          <button
            onClick={() =>
              setCalculatorOpen(true)
            }
          >
            🧮 Discount Calculator
          </button>

          <button
            className="export-button"
            onClick={() =>
              setExportMenuOpen(
                (value) => !value
              )
            }
          >
            📤 Export
          </button>

          <button
            onClick={() =>
              setDocumentsOpen(true)
            }
          >
            📁 Documents
          </button>

          {isEditor ? (

            <div className="admin-actions">

              <span className="admin-status">
                👤 Manager Mode
              </span>

              <button
                className="admin-button"
                onClick={() => {

                  setAddError("");

                  setAddForm({
                    category: "",
                    airline: "",
                    discount: "",
                    logo: "",
                    note: "",
                    notification: "",
                    validity: "",
                    instructions: "",
                  });

                  setAddOfferOpen(true);

                }}
              >
                ➕ Add Offer
              </button>

              <button
                className="admin-button"
                onClick={async () => {

                  try {

                    await fetch(
                      "/api/admin/logout",
                      {
                        method: "POST",
                      }
                    );

                  } catch (error) {

                    console.error(
                      "Admin logout error:",
                      error
                    );

                  } finally {

                    setIsEditor(false);

                  }

                }}
              >
                Logout
              </button>

            </div>

          ) : (

            <button
              className="admin-button"
              onClick={() => {

                setLoginError("");
                setAdminPassword("");
                setLoginOpen(true);

              }}
            >
              🔐 Admin Login
            </button>

          )}

        </div>

      </header>

      {/* =========================
          RUNNING TEXT MARQUEE
      ========================= */}

      <div className="marquee-bar">

        <div className="marquee-container">

          <div className="marquee-text">

            <span>
              ✨ <span className="highlight">SPECIAL OFFER:</span>{" "}
              Book from Travelpartner.pk and get an additional discount
              up to PKR 1600 per ticket (GDS Only SV QR NDC included only)
            </span>

            <span>
              📅 <span className="highlight">VALIDITY:</span>{" "}
              All offers valid until further notice
            </span>

            <span>
              📞 <span className="highlight">CONTACT:</span>{" "}
              For bookings call +92-308-8296519
            </span>

            <span>
              ⚡ <span className="highlight">SAME DAY CASH:</span>{" "}
              Instant discount on spot payment
            </span>

            <span>
              💳 <span className="highlight">CREDIT OPTIONS:</span>{" "}
              Flexible payment plans available
            </span>

            <span>
              📢 <span className="highlight">NEW:</span>{" "}
              Additional PSF calculator tool available
            </span>

            <span>
              📄 <span className="highlight">DOCUMENTS:</span>{" "}
              Check documents section for latest policies
            </span>

            <span>
              🔄 <span className="highlight">REISSUE/REFUND/VOID:</span>{" "}
              Service charges apply PKR 500/-
            </span>

            {/* DUPLICATE SET */}

            <span>
              ✨ <span className="highlight">SPECIAL OFFER:</span>{" "}
              Book from Travelpartner.pk and get an additional discount
              up to PKR 1600 per ticket (GDS Only SV QR NDC included only)
            </span>

            <span>
              📅 <span className="highlight">VALIDITY:</span>{" "}
              All offers valid until further notice
            </span>

            <span>
              📞 <span className="highlight">CONTACT:</span>{" "}
              For bookings call +92-308-8296519
            </span>

            <span>
              ⚡ <span className="highlight">SAME DAY CASH:</span>{" "}
              Instant discount on spot payment
            </span>

            <span>
              💳 <span className="highlight">CREDIT OPTIONS:</span>{" "}
              Flexible payment plans available
            </span>

            <span>
              📢 <span className="highlight">NEW:</span>{" "}
              Additional PSF calculator tool available
            </span>

            <span>
              📄 <span className="highlight">DOCUMENTS:</span>{" "}
              Check documents section for latest policies
            </span>

            <span>
              🔄 <span className="highlight">REISSUE/REFUND/VOID:</span>{" "}
              Service charges apply PKR 500/-
            </span>

          </div>

        </div>

      </div>

      {/* EXPORT MENU */}

      {exportMenuOpen && (

        <div className="export-menu-wrap">

          <div className="export-menu">

            <div className="export-menu-title">
              Export Discount Sheet
            </div>

            <div className="export-menu-group">

              <strong>
                Filtered Offers
              </strong>

              <span>
                Current search and filter results
              </span>

              <div className="export-menu-actions">

                <button
                  onClick={() =>
                    printOffers("filtered")
                  }
                >
                  🖨️ Print
                </button>

                <button
                  onClick={() =>
                    exportAsPDF("filtered")
                  }
                >
                  📄 PDF
                </button>

                <button
                  onClick={() =>
                    exportAsJPG("filtered")
                  }
                >
                  🖼️ JPG
                </button>

              </div>

            </div>

            <div className="export-menu-group">

              <strong>
                Complete Sheet
              </strong>

              <span>
                All airline offers
              </span>

              <div className="export-menu-actions">

                <button
                  onClick={() =>
                    printOffers("complete")
                  }
                >
                  🖨️ Print
                </button>

                <button
                  onClick={() =>
                    exportAsPDF("complete")
                  }
                >
                  📄 PDF
                </button>

                <button
                  onClick={() =>
                    exportAsJPG("complete")
                  }
                >
                  🖼️ JPG
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* OFFER BAR */}

      <section className="offer-bar">

        <div className="offer-item">

          <span className="offer-icon">
            ✨
          </span>

          <div>

            <strong>
              Special Offer
            </strong>

            <span>
              Additional discount up to PKR 1600/- per ticket
            </span>

          </div>

        </div>

        <div className="offer-item">

          <span className="offer-icon">
            💻
          </span>

          <div>

            <strong>
              GDS
            </strong>

            <span>
              Amadeus • Galileo • Sabre
            </span>

          </div>

        </div>

        <div className="offer-item">

          <span className="offer-icon">
            💰
          </span>

          <div>

            <strong>
              Service Charges
            </strong>

            <span>
              Reissue / Refund / Void PKR 500/-
            </span>

          </div>

        </div>

      </section>

      {/* HERO */}

      <section className="search-section">

        <div className="search-heading">

          <span className="page-label">
            QFC GROUP PVT LTD
          </span>

          <h2>
            Airline Discount Sheet Pakistan
          </h2>

          <p>
            Find airline discounts, GDS offers and booking information
            for travel agents.
          </p>

        </div>

      </section>

      {/* =========================
    FILTERS + SEARCH + ALBUM
========================= */}

<section className="filter-section">

  <div className="filter-search-row">

    {/* FILTERS */}

    <div className="filter-scroll">

      {filters.map(
        (filter) => (

          <button
            key={filter}
            className={`filter ${
              activeFilter === filter
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveFilter(filter)
            }
          >

            {filter === "All" &&
              "✈️ "}

            {filter === "Same Day Cash" &&
              "💵 "}

            {filter === "Credit Airline" &&
              "💳 "}

            {filter === "GDS" &&
              "💻 "}

            {filter === "NDC" &&
              "⚡ "}

            {filter === "Web Fare" &&
              "🌐 "}

            {filter}

          </button>

        )
      )}

    </div>


    {/* SEARCH + ALBUM */}

    <div className="filter-search-actions">

      {/* SEARCH */}

      <div className="search-wrapper">

        <span className="search-icon">
          🔎
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search airline, GDS, NDC or offer..."
          className="search-box"
        />

        {search && (

          <button
            className="clear-search"
            onClick={() =>
              setSearch("")
            }
            type="button"
            aria-label="Clear search"
          >
            ×
          </button>

        )}

      </div>


      {/* ALBUM */}

      <button
        className="album-button"
        onClick={openAlbum}
        type="button"
      >

        <span className="album-button-icon">
          📸
        </span>

        <span className="album-button-text">

          <strong>
            Album
          </strong>

          <small>
            Marketing
          </small>

        </span>

      </button>

    </div>

  </div>

</section>

      {/* RESULTS */}

      <section className="airline-section">

        {dataLoading && (

          <div className="data-status">
            Loading latest airline discount data...
          </div>

        )}

        {dataError && (

          <div className="data-status error">
            {dataError}
          </div>

        )}

        <div className="section-heading">

          <div>

            <h2>
              Available Airline Offers
            </h2>

            <p>
              Showing{" "}
              {filteredAirlines.length}{" "}
              available offer
              {filteredAirlines.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          <div className="result-badge">
            {filteredAirlines.length} Offers
          </div>

        </div>

        {filteredAirlines.length === 0 ? (

          <div className="no-results">

            <div className="no-results-icon">
              🔎
            </div>

            <h3>
              No offers found
            </h3>

            <p>
              Try another airline name or select a different filter.
            </p>

            <button
              onClick={() => {

                setSearch("");
                setActiveFilter("All");

              }}
            >
              Clear Search
            </button>

          </div>

        ) : (

          <div className="airline-grid">

            {filteredAirlines.map(
              (item, index) => {

                const expired =
                  isExpired(
                    item.validity
                  );

                const offerType =
                  getOfferType(
                    item.notification
                  );

                return (

                  <article
                    className={`airline-card ${
                      expired
                        ? "expired-card"
                        : ""
                    }`}
                    key={`${item.airline}-${item.notification}-${index}`}
                  >

                    <div className="airline-card-top">

                      <div className="airline-logo-box">

                        <img
                          src={`/${item.logo}`}
                          alt={`${item.airline} logo`}
                          className="airline-logo"
                          onError={(event) => {

                            event.currentTarget.style.display =
                              "none";

                            event.currentTarget.parentElement.classList.add(
                              "logo-fallback"
                            );

                          }}
                        />

                        <span className="logo-fallback-text">

                          {item.airline
                            .split(" ")
                            .map(
                              (word) =>
                                word[0]
                            )
                            .join("")
                            .slice(
                              0,
                              3
                            )
                            .toUpperCase()}

                        </span>

                      </div>

                      <div className="airline-title">

                        <h3>
                          {item.airline}
                        </h3>

                        <span>
                          {offerType}
                        </span>

                      </div>

                    </div>

                    <div className="discount-area">

                      <small>
                        DISCOUNT / BENEFIT
                      </small>

                      <strong>
                        {(item.discount || "").trim()}
                      </strong>

                    </div>

                    <div className="airline-details">

                      <div className="detail-row">

                        <span>
                          Offer
                        </span>

                        <strong>
                          {item.notification ||
                            "Standard Offer"}
                        </strong>

                      </div>

                      {item.note && (

                        <div className="detail-row">

                          <span>
                            Note
                          </span>

                          <strong>
                            {item.note}
                          </strong>

                        </div>

                      )}

                      <div className="detail-row">

                        <span>
                          Valid Until
                        </span>

                        <strong
                          className={
                            expired
                              ? "expired-text"
                              : ""
                          }
                        >

                          {formatDate(
                            item.validity
                          )}

                          {expired &&
                            " • Expired"}

                        </strong>

                      </div>

                    </div>

                    {item.instructions && (

                      <div className="instruction-box">

                        <span>
                          📌 Instructions
                        </span>

                        <p>
                          {item.instructions}
                        </p>

                      </div>

                    )}

                    {isEditor && (

                      <div
                        className="manager-card-actions"
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >

                        <button
                          className="view-details"
                          onClick={() => {

                            setSaveError("");

                            setEditingOffer(
                              item
                            );

                            setEditForm({
                              category:
                                item.category ||
                                "",
                              airline:
                                item.airline ||
                                "",
                              discount:
                                item.discount ||
                                "",
                              logo:
                                item.logo ||
                                "",
                              note:
                                item.note ||
                                "",
                              notification:
                                item.notification ||
                                "",
                              validity:
                                item.validity ||
                                "",
                              instructions:
                                item.instructions ||
                                "",
                            });

                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="view-details"
                          onClick={() => {

                            setDeleteError("");

                            setDeleteOffer(
                              item
                            );

                          }}
                        >
                          Delete
                        </button>

                      </div>

                    )}

                  </article>

                );

              }
            )}

          </div>

        )}

      </section>

      {/* SEO CONTENT */}

      <section className="seo-content">

        <span className="page-label">
          TRAVEL AGENT RESOURCES
        </span>

        <h2>
          QFC Group Pvt Ltd – Airline Discount Sheet for Travel Agents
        </h2>

        <p>
          QFC Group Pvt Ltd provides airline discount information,
          GDS offers and travel-agent resources for travel professionals
          in Pakistan. The QFC Airline Discount Sheet allows agents to
          quickly review available airline discounts, booking offers,
          Same Day Cash and Credit Airline information.
        </p>

        <div className="seo-columns">

          <div>

            <span className="seo-icon">
              ✈️
            </span>

            <h3>
              Airline Discounts
            </h3>

            <p>
              Review current airline discounts and booking offers
              for domestic and international airlines.
            </p>

          </div>

          <div>

            <span className="seo-icon">
              💻
            </span>

            <h3>
              GDS & NDC
            </h3>

            <p>
              Access information related to Amadeus, Galileo,
              Sabre, GDS bookings and NDC airline offers.
            </p>

          </div>

          <div>

            <span className="seo-icon">
              🧮
            </span>

            <h3>
              Travel Agent Tools
            </h3>

            <p>
              Use QFC travel-agent tools including the airline
              discount calculator and PSF calculations.
            </p>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="qfc-footer">

        <div>

          <strong>
            QFC GROUP PVT LTD
          </strong>

          <p>
            Rizwan Plaza, Main Jinnah Avenue,
            Blue Area, Islamabad
          </p>

        </div>

        <div>

          <strong>
            Travel Agent Support
          </strong>

          <p>
            Airline Discounts • GDS • NDC • Ticketing
          </p>

        </div>

      </footer>

      {/* EXPORT SHEET */}

      <div
        ref={exportRef}
        className="qfc-export-sheet"
      >

        <div className="qfc-export-header">

          <div className="qfc-export-brand">

            <img
              src="/QFClogo.png"
              alt="QFC Group Pvt Ltd"
            />

            <div>

              <h1>
                QFC Airline Discount Sheet
              </h1>

              <p>
                Airline Discounts, GDS Offers & Travel Agent Resources
              </p>

            </div>

          </div>

          <div className="qfc-export-info">

            <strong>
              {printTarget === "complete"
                ? "Complete Sheet"
                : "Airline Offers"}
            </strong>

            <span>
              Generated:{" "}
              {new Date().toLocaleDateString(
                "en-GB"
              )}
            </span>

          </div>

        </div>

        <div className="qfc-export-offers">

          {getExportOffers(
            printTarget === "complete"
              ? "complete"
              : "filtered"
          ).map(
            (item, index) => {

              const expired =
                isExpired(
                  item.validity
                );

              const offerType =
                getOfferType(
                  item.notification
                );

              return (

                <article
                  className={`airline-card ${
                    expired
                      ? "expired-card"
                      : ""
                  }`}
                  key={`export-${item.airline}-${item.notification}-${index}`}
                >

                  <div className="airline-card-top">

                    <div className="airline-logo-box">

                      <img
                        src={`/${item.logo}`}
                        alt={`${item.airline} logo`}
                        className="airline-logo"
                        onError={(event) => {

                          event.currentTarget.style.display =
                            "none";

                          event.currentTarget.parentElement.classList.add(
                            "logo-fallback"
                          );

                        }}
                      />

                      <span className="logo-fallback-text">

                        {item.airline
                          .split(" ")
                          .map(
                            (word) =>
                              word[0]
                          )
                          .join("")
                          .slice(
                            0,
                            3
                          )
                          .toUpperCase()}

                      </span>

                    </div>

                    <div className="airline-title">

                      <h3>
                        {item.airline}
                      </h3>

                      <span>
                        {offerType}
                      </span>

                    </div>

                  </div>

                  <div className="discount-area">

                    <small>
                      DISCOUNT / BENEFIT
                    </small>

                    <strong>
                      {(item.discount || "").trim()}
                    </strong>

                  </div>

                  <div className="airline-details">

                    <div className="detail-row">

                      <span>
                        Offer
                      </span>

                      <strong>
                        {item.notification ||
                          "Standard Offer"}
                      </strong>

                    </div>

                    {item.note && (

                      <div className="detail-row">

                        <span>
                          Note
                        </span>

                        <strong>
                          {item.note}
                        </strong>

                      </div>

                    )}

                    <div className="detail-row">

                      <span>
                        Valid Until
                      </span>

                      <strong
                        className={
                          expired
                            ? "expired-text"
                            : ""
                        }
                      >

                        {formatDate(
                          item.validity
                        )}

                        {expired &&
                          " • Expired"}

                      </strong>

                    </div>

                  </div>

                  {item.instructions && (

                    <div className="instruction-box">

                      <span>
                        📌 Instructions
                      </span>

                      <p>
                        {item.instructions}
                      </p>

                    </div>

                  )}

                </article>

              );

            }
          )}

        </div>

        <div className="qfc-export-footer">

          <strong>
            QFC GROUP PVT LTD
          </strong>

          <span>
            Rizwan Plaza, Main Jinnah Avenue, Blue Area, Islamabad
          </span>

        </div>

      </div>

      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedOffer && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedOffer(null)
          }
        >

          <div
            className="offer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedOffer(null)
              }
            >
              ×
            </button>

            <div className="modal-airline">

              <div className="modal-logo">

                <img
                  src={`/${selectedOffer.logo}`}
                  alt={selectedOffer.airline}
                />

              </div>

              <div>

                <h2>
                  {selectedOffer.airline}
                </h2>

                <span>
                  {getOfferType(
                    selectedOffer.notification
                  )}
                </span>

              </div>

            </div>

            <div className="modal-discount">

              <small>
                DISCOUNT / BENEFIT
              </small>

              <strong>
                {(selectedOffer.discount || "").trim()}
              </strong>

            </div>

            <div className="modal-information">

              <div>

                <span>
                  Offer Type
                </span>

                <strong>
                  {selectedOffer.notification}
                </strong>

              </div>

              <div>

                <span>
                  Validity
                </span>

                <strong>
                  {formatDate(
                    selectedOffer.validity
                  )}
                </strong>

              </div>

              {selectedOffer.note && (

                <div>

                  <span>
                    Note
                  </span>

                  <strong>
                    {selectedOffer.note}
                  </strong>

                </div>

              )}

              {selectedOffer.instructions && (

                <div>

                  <span>
                    Instructions
                  </span>

                  <strong>
                    {selectedOffer.instructions}
                  </strong>

                </div>

              )}

            </div>

            <button
              className="modal-done"
              onClick={() =>
                setSelectedOffer(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* =========================
          MARKETING ALBUM MODAL
      ========================= */}

      {albumOpen && marketingImages.length > 0 && (

        <div
          className="modal-overlay album-modal-overlay"
          onClick={() =>
            setAlbumOpen(false)
          }
        >

          <div
            className="album-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="album-close"
              onClick={() =>
                setAlbumOpen(false)
              }
              aria-label="Close album"
            >
              ×
            </button>

            <div className="album-header">

              <div>

                <span className="page-label">
                  QFC GROUP PVT LTD
                </span>

                <h2>
                  Available Packages
                </h2>

                <p>
                  Latest QFC marketing offers and announcements
                </p>

              </div>

              <div className="album-counter">
                {albumIndex + 1} / {marketingImages.length}
              </div>

            </div>

            <div className="album-viewer">

              <button
                className="album-nav album-prev"
                onClick={previousAlbumImage}
                aria-label="Previous image"
              >
                ‹
              </button>

              <div className="album-image-container">

                <img
                  src={marketingImages[albumIndex].file}
                  alt={
                    marketingImages[albumIndex].title
                  }
                  className="album-main-image"
                />

              </div>

              <button
                className="album-nav album-next"
                onClick={nextAlbumImage}
                aria-label="Next image"
              >
                ›
              </button>

            </div>

            <div className="album-thumbnails">

              {marketingImages.map(
                (image, index) => (

                  <button
                    key={image.file}
                    type="button"
                    className={`album-thumbnail ${
                      albumIndex === index
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setAlbumIndex(index)
                    }
                  >

                    <img
                      src={image.file}
                      alt={`Marketing ${index + 1}`}
                    />

                  </button>

                )
              )}

            </div>

            <div className="album-footer">

              <span>
                Use ← → keys to browse
              </span>

              <button
                className="modal-done"
                onClick={() =>
                  setAlbumOpen(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          DOCUMENTS MODAL
      ========================= */}

      {documentsOpen && (

        <div
          className="modal-overlay"
          onClick={() =>
            setDocumentsOpen(false)
          }
        >

          <div
            className="offer-modal documents-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setDocumentsOpen(false)
              }
            >
              ×
            </button>

            <div className="modal-airline">

              <div>

                <h2>
                  QFC Documents
                </h2>

                <span>
                  QFC Group documents and service agreements
                </span>

              </div>

            </div>

            <div className="documents-list">

              {documents.map(
                (document) => (

                  <div
                    className="document-item"
                    key={document.file}
                  >

                    <div className="document-info">

                      <span className="document-icon">
                        {document.type === "IMAGE"
                          ? "🖼️"
                          : "📄"}
                      </span>

                      <div>

                        <strong>
                          {document.name}
                        </strong>

                        <span>
                          {document.type === "IMAGE"
                            ? "Image Document"
                            : "Word Document"}
                        </span>

                      </div>

                    </div>

                    <div className="document-actions">

                      <a
                        href={document.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-button"
                      >
                        👁️ View
                      </a>

                      <a
                        href={document.file}
                        download
                        className="document-button"
                      >
                        ⬇️ Download
                      </a>

                    </div>

                  </div>

                )
              )}

            </div>

            <button
              className="modal-done"
              onClick={() =>
                setDocumentsOpen(false)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* =========================
          ADMIN LOGIN MODAL
      ========================= */}

      {loginOpen && (

        <div
          className="modal-overlay"
          onClick={() => {

            if (!loginLoading) {

              setLoginOpen(false);
              setLoginError("");
              setAdminPassword("");

            }

          }}
        >

          <div
            className="offer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() => {

                if (!loginLoading) {

                  setLoginOpen(false);
                  setLoginError("");
                  setAdminPassword("");

                }

              }}
            >
              ×
            </button>

            <div className="modal-airline">

              <div>

                <h2>
                  Manager Login
                </h2>

                <span>
                  QFC Discount Sheet Administration
                </span>

              </div>

            </div>

            <div className="modal-information">

              <div>

                <span>
                  Admin Password
                </span>

                <input
                  type="password"
                  value={adminPassword}
                  onChange={(event) => {

                    setAdminPassword(
                      event.target.value
                    );

                    setLoginError("");

                  }}
                  onKeyDown={(event) => {

                    if (
                      event.key === "Enter"
                    ) {

                      event.preventDefault();

                      document
                        .getElementById(
                          "qfc-manager-login"
                        )
                        ?.click();

                    }

                  }}
                  placeholder="Enter manager password"
                  autoFocus
                  disabled={
                    loginLoading
                  }
                />

              </div>

            </div>

            {loginError && (

              <div className="data-status error">
                {loginError}
              </div>

            )}

            <button
              id="qfc-manager-login"
              className="modal-done"
              disabled={loginLoading}
              onClick={async () => {

                try {

                  setLoginLoading(true);
                  setLoginError("");

                  const response =
                    await fetch(
                      "/api/admin/login",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type":
                            "application/json",
                        },
                        body: JSON.stringify({
                          password:
                            adminPassword,
                        }),
                      }
                    );

                  const result =
                    await response.json();

                  if (
                    !response.ok ||
                    !result.success
                  ) {

                    setLoginError(
                      result.error ||
                      "Login failed."
                    );

                    return;

                  }

                  setIsEditor(true);
                  setLoginOpen(false);
                  setAdminPassword("");
                  setLoginError("");

                } catch (error) {

                  console.error(
                    "Admin login error:",
                    error
                  );

                  setLoginError(
                    "Unable to connect to the login service."
                  );

                } finally {

                  setLoginLoading(false);

                }

              }}
            >

              {loginLoading
                ? "Signing in..."
                : "Login"}

            </button>

          </div>

        </div>

      )}

      {/* =========================
          EDIT OFFER MODAL
      ========================= */}

      {isEditor &&
        editingOffer &&
        editForm && (

          <div
            className="modal-overlay"
            onClick={() => {

              if (!saveLoading) {

                setEditingOffer(null);
                setEditForm(null);
                setSaveError("");

              }

            }}
          >

            <div
              className="offer-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                className="modal-close"
                onClick={() => {

                  if (!saveLoading) {

                    setEditingOffer(null);
                    setEditForm(null);
                    setSaveError("");

                  }

                }}
              >
                ×
              </button>

              <div className="modal-airline">

                <div>

                  <h2>
                    Edit Airline Offer
                  </h2>

                  <span>
                    Manager Mode
                  </span>

                </div>

              </div>

              <div className="modal-information">

                <div>

                  <span>
                    Category
                  </span>

                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        category:
                          event.target.value,
                      });

                    }}
                  />

                </div>

                <div>

                  <span>
                    Airline
                  </span>

                  <input
                    type="text"
                    value={editForm.airline}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        airline:
                          event.target.value,
                      });

                    }}
                  />

                </div>

                <div>

                  <span>
                    Discount / Benefit
                  </span>

                  <input
                    type="text"
                    value={editForm.discount}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        discount:
                          event.target.value,
                      });

                    }}
                  />

                </div>

                <div>

                  <span>
                    Notification / Offer Type
                  </span>

                  <input
                    type="text"
                    value={editForm.notification}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        notification:
                          event.target.value,
                      });

                    }}
                  />

                </div>

                <div>

                  <span>
                    Note
                  </span>

                  <input
                    type="text"
                    value={editForm.note}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        note:
                          event.target.value,
                      });

                    }}
                  />

                </div>

                <div>

                  <span>
                    Valid Until
                  </span>

                  <input
                    type="date"
                    value={editForm.validity}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        validity:
                          event.target.value,
                      });

                    }}
                  />

                </div>

                <div>

                  <span>
                    Logo Filename
                  </span>

                  <input
                    type="text"
                    value={editForm.logo}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        logo:
                          event.target.value,
                      });

                    }}
                  />

                </div>

                <div>

                  <span>
                    Instructions
                  </span>

                  <textarea
                    rows={5}
                    value={editForm.instructions}
                    onChange={(event) => {

                      setEditForm({
                        ...editForm,
                        instructions:
                          event.target.value,
                      });

                    }}
                  />

                </div>

              </div>

              {saveError && (

                <div className="data-status error">
                  {saveError}
                </div>

              )}

              <button
                className="modal-done"
                disabled={saveLoading}
                onClick={async () => {

                  if (saveLoading) {
                    return;
                  }

                  if (
                    !editForm.airline.trim()
                  ) {

                    setSaveError(
                      "Airline name is required."
                    );

                    return;

                  }

                  if (
                    !editForm.discount.trim()
                  ) {

                    setSaveError(
                      "Discount / Benefit is required."
                    );

                    return;

                  }

                  if (
                    !editForm.validity
                  ) {

                    setSaveError(
                      "Validity date is required."
                    );

                    return;

                  }

                  try {

                    setSaveLoading(true);
                    setSaveError("");

                    const response =
                      await fetch(
                        "/api/admin/data",
                        {
                          method: "GET",
                          cache: "no-store",
                        }
                      );

                    const result =
                      await response.json();

                    if (
                      !response.ok ||
                      !result.success ||
                      !Array.isArray(
                        result.data
                      )
                    ) {

                      throw new Error(
                        result.error ||
                        "Unable to retrieve latest airline data."
                      );

                    }

                    const offerIndex =
                      result.data.findIndex(
                        (offer) => {

                          return (
                            offer.airline ===
                              editingOffer.airline &&
                            offer.notification ===
                              editingOffer.notification &&
                            offer.discount ===
                              editingOffer.discount &&
                            offer.validity ===
                              editingOffer.validity
                          );

                        }
                      );

                    if (
                      offerIndex === -1
                    ) {

                      throw new Error(
                        "The selected offer could not be found. Please refresh the page and try again."
                      );

                    }

                    const updatedData =
                      [...result.data];

                    updatedData[
                      offerIndex
                    ] = {
                      ...result.data[
                        offerIndex
                      ],
                      ...editForm,
                    };

                    const saveResponse =
                      await fetch(
                        "/api/admin/data",
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type":
                              "application/json",
                          },
                          body: JSON.stringify({
                            data:
                              updatedData,
                          }),
                        }
                      );

                    const saveResult =
                      await saveResponse.json();

                    if (
                      !saveResponse.ok ||
                      !saveResult.success
                    ) {

                      throw new Error(
                        saveResult.error ||
                        "Unable to save changes."
                      );

                    }

                    setAirlineData(
                      updatedData
                    );

                    setEditingOffer(null);
                    setEditForm(null);
                    setSaveError("");

                    console.log(
                      "QFC OFFER UPDATED SUCCESSFULLY"
                    );

                  } catch (error) {

                    console.error(
                      "Edit offer error:",
                      error
                    );

                    setSaveError(
                      error.message ||
                      "Unable to save changes."
                    );

                  } finally {

                    setSaveLoading(false);

                  }

                }}
              >

                {saveLoading
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

        )}

      {/* =========================
          DELETE OFFER MODAL
      ========================= */}

      {isEditor &&
        deleteOffer && (

          <div
            className="modal-overlay"
            onClick={() => {

              if (!deleteLoading) {

                setDeleteOffer(null);
                setDeleteError("");

              }

            }}
          >

            <div
              className="offer-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                className="modal-close"
                onClick={() => {

                  if (!deleteLoading) {

                    setDeleteOffer(null);
                    setDeleteError("");

                  }

                }}
              >
                ×
              </button>

              <div className="modal-airline">

                <div>

                  <h2>
                    Delete Airline Offer
                  </h2>

                  <span>
                    Manager Mode
                  </span>

                </div>

              </div>

              <div className="modal-information">

                <div>

                  <span>
                    Airline
                  </span>

                  <strong>
                    {deleteOffer.airline}
                  </strong>

                </div>

                <div>

                  <span>
                    Offer
                  </span>

                  <strong>
                    {deleteOffer.notification ||
                      "Standard Offer"}
                  </strong>

                </div>

                <div>

                  <span>
                    Discount / Benefit
                  </span>

                  <strong>
                    {deleteOffer.discount}
                  </strong>

                </div>

                <div>

                  <span>
                    Valid Until
                  </span>

                  <strong>
                    {formatDate(
                      deleteOffer.validity
                    )}
                  </strong>

                </div>

              </div>

              <div className="data-status error">

                Are you sure you want to permanently
                delete this offer?

              </div>

              {deleteError && (

                <div className="data-status error">
                  {deleteError}
                </div>

              )}

              <button
                className="modal-done"
                disabled={deleteLoading}
                onClick={async () => {

                  if (deleteLoading) {
                    return;
                  }

                  try {

                    setDeleteLoading(true);
                    setDeleteError("");

                    const response =
                      await fetch(
                        "/api/admin/data",
                        {
                          method: "GET",
                          cache: "no-store",
                        }
                      );

                    const result =
                      await response.json();

                    if (
                      !response.ok ||
                      !result.success ||
                      !Array.isArray(
                        result.data
                      )
                    ) {

                      throw new Error(
                        result.error ||
                        "Unable to retrieve latest airline data."
                      );

                    }

                    const offerIndex =
                      result.data.findIndex(
                        (offer) => {

                          return (
                            offer.airline ===
                              deleteOffer.airline &&
                            offer.category ===
                              deleteOffer.category &&
                            offer.discount ===
                              deleteOffer.discount &&
                            offer.logo ===
                              deleteOffer.logo &&
                            offer.note ===
                              deleteOffer.note &&
                            offer.notification ===
                              deleteOffer.notification &&
                            offer.validity ===
                              deleteOffer.validity &&
                            offer.instructions ===
                              deleteOffer.instructions
                          );

                        }
                      );

                    if (
                      offerIndex === -1
                    ) {

                      throw new Error(
                        "The selected offer could not be found. Please refresh the page and try again."
                      );

                    }

                    const updatedData =
                      result.data.filter(
                        (_, index) =>
                          index !==
                          offerIndex
                      );

                    const saveResponse =
                      await fetch(
                        "/api/admin/data",
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type":
                              "application/json",
                          },
                          body: JSON.stringify({
                            data:
                              updatedData,
                          }),
                        }
                      );

                    const saveResult =
                      await saveResponse.json();

                    if (
                      !saveResponse.ok ||
                      !saveResult.success
                    ) {

                      throw new Error(
                        saveResult.error ||
                        "Unable to delete the offer."
                      );

                    }

                    setAirlineData(
                      updatedData
                    );

                    setDeleteOffer(null);
                    setDeleteError("");

                    console.log(
                      "QFC OFFER DELETED SUCCESSFULLY"
                    );

                  } catch (error) {

                    console.error(
                      "Delete offer error:",
                      error
                    );

                    setDeleteError(
                      error.message ||
                      "Unable to delete offer."
                    );

                  } finally {

                    setDeleteLoading(false);

                  }

                }}
              >

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Offer"}

              </button>

            </div>

          </div>

        )}

      {/* =========================
          ADD NEW OFFER MODAL
      ========================= */}

      {isEditor &&
        addOfferOpen && (

          <div
            className="modal-overlay"
            onClick={() => {

              if (!addLoading) {

                setAddOfferOpen(false);
                setAddError("");

              }

            }}
          >

            <div
              className="offer-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                className="modal-close"
                onClick={() => {

                  if (!addLoading) {

                    setAddOfferOpen(false);
                    setAddError("");

                  }

                }}
              >
                ×
              </button>

              <div className="modal-airline">

                <div>

                  <h2>
                    Add New Airline Offer
                  </h2>

                  <span>
                    Manager Mode
                  </span>

                </div>

              </div>

              <div className="modal-information">

                <div>

                  <span>
                    Category
                  </span>

                  <input
                    type="text"
                    value={addForm.category}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        category:
                          event.target.value,
                      });

                    }}
                    placeholder="Cash / Credit"
                    disabled={addLoading}
                  />

                </div>

                <div>

                  <span>
                    Airline
                  </span>

                  <input
                    type="text"
                    value={addForm.airline}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        airline:
                          event.target.value,
                      });

                      setAddError("");

                    }}
                    placeholder="Enter airline name"
                    disabled={addLoading}
                  />

                </div>

                <div>

                  <span>
                    Discount / Benefit
                  </span>

                  <input
                    type="text"
                    value={addForm.discount}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        discount:
                          event.target.value,
                      });

                      setAddError("");

                    }}
                    placeholder="-2.5% or PKR 500"
                    disabled={addLoading}
                  />

                </div>

                <div>

                  <span>
                    Notification / Offer Type
                  </span>

                  <input
                    type="text"
                    value={addForm.notification}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        notification:
                          event.target.value,
                      });

                    }}
                    placeholder="GDS / NDC / Web Fare / HITT ONLY"
                    disabled={addLoading}
                  />

                </div>

                <div>

                  <span>
                    Note
                  </span>

                  <input
                    type="text"
                    value={addForm.note}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        note:
                          event.target.value,
                      });

                    }}
                    placeholder="International / Domestic / GDS"
                    disabled={addLoading}
                  />

                </div>

                <div>

                  <span>
                    Valid Until
                  </span>

                  <input
                    type="date"
                    value={addForm.validity}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        validity:
                          event.target.value,
                      });

                      setAddError("");

                    }}
                    disabled={addLoading}
                  />

                </div>

                <div>

                  <span>
                    Logo Filename
                  </span>

                  <input
                    type="text"
                    value={addForm.logo}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        logo:
                          event.target.value,
                      });

                    }}
                    placeholder="example.png"
                    disabled={addLoading}
                  />

                </div>

                <div>

                  <span>
                    Instructions
                  </span>

                  <textarea
                    rows={5}
                    value={addForm.instructions}
                    onChange={(event) => {

                      setAddForm({
                        ...addForm,
                        instructions:
                          event.target.value,
                      });

                    }}
                    placeholder="Enter booking or ticketing instructions"
                    disabled={addLoading}
                  />

                </div>

              </div>

              {addError && (

                <div className="data-status error">
                  {addError}
                </div>

              )}

              <button
                className="modal-done"
                disabled={addLoading}
                onClick={async () => {

                  if (addLoading) {
                    return;
                  }

                  if (
                    !addForm.airline.trim()
                  ) {

                    setAddError(
                      "Airline name is required."
                    );

                    return;

                  }

                  if (
                    !addForm.discount.trim()
                  ) {

                    setAddError(
                      "Discount / Benefit is required."
                    );

                    return;

                  }

                  if (
                    !addForm.validity
                  ) {

                    setAddError(
                      "Validity date is required."
                    );

                    return;

                  }

                  try {

                    setAddLoading(true);
                    setAddError("");

                    const response =
                      await fetch(
                        "/api/admin/data",
                        {
                          method: "GET",
                          cache: "no-store",
                        }
                      );

                    const result =
                      await response.json();

                    if (
                      !response.ok ||
                      !result.success ||
                      !Array.isArray(
                        result.data
                      )
                    ) {

                      throw new Error(
                        result.error ||
                        "Unable to retrieve latest airline data."
                      );

                    }

                    const newOffer = {

                      category:
                        addForm.category.trim(),

                      airline:
                        addForm.airline.trim(),

                      discount:
                        addForm.discount.trim(),

                      logo:
                        addForm.logo.trim(),

                      note:
                        addForm.note.trim(),

                      notification:
                        addForm.notification.trim(),

                      validity:
                        addForm.validity,

                      instructions:
                        addForm.instructions.trim(),

                    };

                    const updatedData = [
                      ...result.data,
                      newOffer,
                    ];

                    const saveResponse =
                      await fetch(
                        "/api/admin/data",
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type":
                              "application/json",
                          },
                          body: JSON.stringify({
                            data:
                              updatedData,
                          }),
                        }
                      );

                    const saveResult =
                      await saveResponse.json();

                    if (
                      !saveResponse.ok ||
                      !saveResult.success
                    ) {

                      throw new Error(
                        saveResult.error ||
                        "Unable to save the new airline offer."
                      );

                    }

                    setAirlineData(
                      updatedData
                    );

                    setAddOfferOpen(false);
                    setAddError("");

                    setAddForm({
                      category: "",
                      airline: "",
                      discount: "",
                      logo: "",
                      note: "",
                      notification: "",
                      validity: "",
                      instructions: "",
                    });

                    console.log(
                      "QFC NEW OFFER ADDED SUCCESSFULLY"
                    );

                  } catch (error) {

                    console.error(
                      "Add offer error:",
                      error
                    );

                    setAddError(
                      error.message ||
                      "Unable to add new offer."
                    );

                  } finally {

                    setAddLoading(false);

                  }

                }}
              >

                {addLoading
                  ? "Adding..."
                  : "Add Offer"}

              </button>

            </div>

          </div>

        )}

      {/* CALCULATOR */}

      {calculatorOpen && (

        <DiscountCalculator
          offers={airlineData}
          onClose={() =>
            setCalculatorOpen(false)
          }
        />

      )}

      {/* PRINT TRIGGER */}

      {printTarget && (

        <div
          className="print-trigger"
          ref={(element) => {

            if (!element) return;

            setTimeout(() => {
              window.print();
            }, 100);

          }}
        />

      )}

    </main>
  );
}
