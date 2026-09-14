import Link from "next/link";

export const metadata = {
  title: "GDS Airline Discounts Pakistan | Amadeus Galileo Sabre | QFC Group",
  description:
    "Explore GDS airline discounts in Pakistan for travel agents using Amadeus, Galileo and Sabre. Check GDS offers, airline discounts and ticketing resources from QFC Group.",
  keywords: [
    "GDS airline discounts Pakistan",
    "Amadeus airline discounts Pakistan",
    "Galileo airline discounts Pakistan",
    "Sabre airline discounts Pakistan",
    "GDS discounts travel agents",
    "airline GDS offers Pakistan",
    "QFC GDS discounts",
  ],
  alternates: {
    canonical: "https://discountsheet.vercel.app/gds-airline-discounts/",
  },
  openGraph: {
    title: "GDS Airline Discounts Pakistan | QFC Group",
    description:
      "GDS airline discounts and travel agent offers for Amadeus, Galileo and Sabre users in Pakistan.",
    url: "https://discountsheet.vercel.app/gds-airline-discounts/",
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
    title: "GDS Airline Discounts Pakistan | QFC Group",
    description:
      "GDS airline discounts for Amadeus, Galileo and Sabre travel agents in Pakistan.",
    images: ["/QFClogo.png"],
  },
};

const gdsSystems = [
  {
    name: "Amadeus",
    code: "1A",
    logo: "/1A.png",
    description:
      "Review airline discount opportunities and applicable GDS offers for travel agents using Amadeus.",
  },
  {
    name: "Galileo",
    code: "1G",
    logo: "/1G.png",
    description:
      "Find airline discount information and GDS-related benefits available through Galileo.",
  },
  {
    name: "Sabre",
    code: "1S",
    logo: "/1S.png",
    description:
      "Check airline offers and discount information for travel agents operating through Sabre.",
  },
];

export default function GdsAirlineDiscounts() {
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
            GDS Airline Discounts Pakistan
          </h1>

          <p
            style={{
              maxWidth: "820px",
              margin: "0 auto",
              fontSize: "19px",
              lineHeight: 1.7,
              color: "#52666d",
            }}
          >
            Explore airline discounts and GDS offers for travel agents in
            Pakistan using Amadeus, Galileo and Sabre.
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
              href="/airline-discount-sheet-pakistan/"
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
              Airline Discount Sheet
            </Link>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "22px",
            marginBottom: "45px",
          }}
        >
          {gdsSystems.map((gds) => (
            <article
              key={gds.code}
              style={{
                background: "#ffffff",
                border: "1px solid #d9edf1",
                borderRadius: "18px",
                padding: "30px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0, 80, 100, 0.06)",
              }}
            >
              <img
                src={gds.logo}
                alt={`${gds.name} GDS`}
                style={{
                  maxWidth: "150px",
                  maxHeight: "70px",
                  objectFit: "contain",
                  margin: "0 auto 20px",
                }}
              />

              <h2
                style={{
                  margin: "0 0 10px",
                  color: "#087f94",
                  fontSize: "25px",
                }}
              >
                {gds.name}
              </h2>

              <p
                style={{
                  lineHeight: 1.7,
                  color: "#596d73",
                  marginBottom: 0,
                }}
              >
                {gds.description}
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
            GDS Airline Discounts for Travel Agents
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Global Distribution Systems are an important part of airline
            ticketing for travel agencies. QFC Group provides airline discount
            information and ticketing resources for travel agents operating
            through major GDS platforms.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Travel agents using Amadeus, Galileo or Sabre can use the QFC
            airline discount sheet to review available offers and understand
            the applicable discount or benefit before ticketing.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Depending on the airline and offer, GDS-related information may
            include percentage discounts, fixed-value benefits, Same Day Cash,
            Credit Airline, GDS and NDC-related conditions.
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
            Related QFC Resources
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Link
              href="/airline-discount-sheet-pakistan/"
              style={{
                color: "#087f94",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Airline Discount Sheet Pakistan →
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
              Full QFC Discount Sheet →
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
          GDS Airline Discounts & Travel Agent Resources Pakistan
        </footer>
      </div>
    </main>
  );
}