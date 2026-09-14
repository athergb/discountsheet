import Link from "next/link";

export const metadata = {
  title: "Airline Discount Sheet Pakistan | QFC Group",
  description:
    "QFC Group airline discount sheet for travel agents in Pakistan. Check airline discounts, GDS offers, Same Day Cash, Credit Airline and travel agent ticketing benefits.",
  keywords: [
    "airline discount sheet Pakistan",
    "airline discounts Pakistan",
    "travel agent airline discounts",
    "QFC airline discount sheet",
    "travel agent discounts Pakistan",
    "GDS airline discounts Pakistan",
  ],
  alternates: {
    canonical:
      "https://discountsheet.vercel.app/airline-discount-sheet-pakistan/",
  },
  openGraph: {
    title: "Airline Discount Sheet Pakistan | QFC Group",
    description:
      "QFC Group airline discount sheet for travel agents in Pakistan with airline discounts, GDS offers and ticketing benefits.",
    url: "https://discountsheet.vercel.app/airline-discount-sheet-pakistan/",
    siteName: "QFC Group",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/QFClogo.png",
        width: 512,
        height: 512,
        alt: "QFC Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Airline Discount Sheet Pakistan | QFC Group",
    description:
      "QFC Group airline discount sheet for travel agents in Pakistan.",
    images: ["/QFClogo.png"],
  },
};

export default function AirlineDiscountSheetPakistan() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4fbfd 0%, #ffffff 50%, #eef9fb 100%)",
        padding: "40px 20px",
        color: "#16323a",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <img
            src="/QFClogo.png"
            alt="QFC Group Pvt Ltd"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              marginBottom: "20px",
            }}
          />

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.1,
              margin: "0 0 18px",
              fontWeight: 800,
            }}
          >
            Airline Discount Sheet Pakistan
          </h1>

          <p
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              fontSize: "19px",
              lineHeight: 1.7,
              color: "#52666d",
            }}
          >
            Access the QFC Group airline discount sheet for travel agents in
            Pakistan. Check airline discounts, GDS offers, Same Day Cash,
            Credit Airline and other ticketing benefits.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "13px 24px",
                borderRadius: "10px",
                background: "#0aa6c0",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Open Discount Sheet
            </Link>

            <Link
              href="/gds-airline-discounts/"
              style={{
                display: "inline-block",
                padding: "13px 24px",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#087f94",
                textDecoration: "none",
                fontWeight: 700,
                border: "1px solid #b8dce3",
              }}
            >
              GDS Airline Discounts
            </Link>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
            marginBottom: "45px",
          }}
        >
          {[
            {
              title: "Same Day Cash",
              text: "Check available airline discounts and ticketing benefits for Same Day Cash transactions.",
            },
            {
              title: "Credit Airline",
              text: "Review airline credit offers and applicable travel agent discount information.",
            },
            {
              title: "GDS Offers",
              text: "Find airline discount information associated with Amadeus, Galileo and Sabre GDS channels.",
            },
            {
              title: "Travel Agent Resources",
              text: "Access useful QFC Group resources for airline ticketing, calculations and agency operations.",
            },
          ].map((item) => (
            <article
              key={item.title}
              style={{
                background: "#ffffff",
                border: "1px solid #d9edf1",
                borderRadius: "16px",
                padding: "25px",
                boxShadow: "0 8px 25px rgba(0, 80, 100, 0.06)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontSize: "22px",
                  color: "#087f94",
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  lineHeight: 1.7,
                  color: "#596d73",
                  marginBottom: 0,
                }}
              >
                {item.text}
              </p>
            </article>
          ))}
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "35px",
            border: "1px solid #d9edf1",
            boxShadow: "0 8px 25px rgba(0, 80, 100, 0.05)",
            marginBottom: "35px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#087f94",
              fontSize: "30px",
            }}
          >
            Airline Discounts for Travel Agents in Pakistan
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            QFC Group provides airline discount information and travel agent
            resources for the Pakistan travel industry. The airline discount
            sheet is designed to make it easier for agents to review available
            airline offers, discount structures, ticketing benefits and
            applicable conditions.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Travel agents can use the discount sheet to compare airline offers
            and quickly identify relevant options before ticketing. Depending
            on the airline and offer, information may include Same Day Cash,
            Credit Airline, GDS, NDC and other fare-related benefits.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            The QFC discount sheet also works together with the airline
            discount calculator, helping travel agents understand discount,
            PSF and segment-related calculations.
          </p>
        </section>

        <section
          style={{
            background: "#eef9fb",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#087f94",
            }}
          >
            Explore QFC Airline Tools
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <Link
              href="/gds-airline-discounts/"
              style={{
                color: "#087f94",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              GDS Airline Discounts →
            </Link>

            <Link
              href="/airline-discount-calculator/"
              style={{
                color: "#087f94",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Airline Discount Calculator →
            </Link>

            <Link
              href="/"
              style={{
                color: "#087f94",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Open Full Discount Sheet →
            </Link>
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            padding: "25px 0",
            borderTop: "1px solid #d9edf1",
            color: "#6b7f84",
          }}
        >
          <strong>QFC Group Pvt Ltd</strong>
          <br />
          Airline Discount Sheet & Travel Agent Resources Pakistan
        </footer>
      </div>
    </main>
  );
}