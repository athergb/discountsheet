import Link from "next/link";

export const metadata = {
  title: "Airline Discount Calculator Pakistan | PSF Calculator | QFC Group",
  description:
    "Use the QFC airline discount calculator for travel agents in Pakistan. Calculate airline discounts, PSF, segment discounts and passenger fare adjustments for airline ticketing.",
  keywords: [
    "airline discount calculator Pakistan",
    "airline discount calculator",
    "PSF calculator Pakistan",
    "airline ticket discount calculator",
    "travel agent discount calculator",
    "segment discount calculator",
    "QFC airline calculator",
  ],
  alternates: {
    canonical:
      "https://discountsheet.vercel.app/airline-discount-calculator/",
  },
  openGraph: {
    title: "Airline Discount Calculator Pakistan | QFC Group",
    description:
      "Calculate airline discounts, PSF and segment-related ticketing amounts with the QFC airline discount calculator.",
    url: "https://discountsheet.vercel.app/airline-discount-calculator/",
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
    title: "Airline Discount Calculator Pakistan | QFC Group",
    description:
      "Airline discount and PSF calculator for travel agents in Pakistan.",
    images: ["/QFClogo.png"],
  },
};

const calculatorFeatures = [
  {
    title: "Airline Discount",
    text: "Review applicable airline discount information and understand how the discount affects the fare.",
  },
  {
    title: "PSF Calculation",
    text: "Calculate applicable PSF amounts as part of the airline ticketing calculation.",
  },
  {
    title: "Segment Discount",
    text: "Understand GDS-related segment discount amounts that may apply to eligible bookings.",
  },
  {
    title: "Passenger Types",
    text: "Work with adult, child and infant passenger quantities when reviewing ticket calculations.",
  },
];

export default function AirlineDiscountCalculator() {
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
            Airline Discount Calculator Pakistan
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
            Calculate airline discounts, PSF, segment discounts and
            passenger-related amounts using the QFC airline discount
            resources for travel agents in Pakistan.
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
              Open Calculator
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
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
            marginBottom: "45px",
          }}
        >
          {calculatorFeatures.map((feature) => (
            <article
              key={feature.title}
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
                {feature.title}
              </h2>

              <p
                style={{
                  lineHeight: 1.7,
                  color: "#596d73",
                  marginBottom: 0,
                }}
              >
                {feature.text}
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
            How the Airline Discount Calculator Works
          </h2>

          <ol
            style={{
              paddingLeft: "24px",
              lineHeight: 1.9,
              color: "#596d73",
            }}
          >
            <li>
              Select the applicable airline from the available airline
              information.
            </li>

            <li>
              Select the relevant GDS or ticketing option where applicable.
            </li>

            <li>
              Enter the basic fare and applicable taxes or ticketing amounts.
            </li>

            <li>
              Enter the relevant passenger quantities, including adults,
              children and infants.
            </li>

            <li>
              Review the calculated discount, PSF, segment discount and final
              ticket amount.
            </li>
          </ol>
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
            Airline Discount and PSF Calculations
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Airline ticket calculations can involve several components,
            including basic fare, taxes, airline discounts, PSF and
            segment-based charges or benefits. A dedicated calculator helps
            travel agents review these values before completing ticketing.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            The QFC airline discount calculator is designed around the
            discount-sheet workflow used by travel agents. It can be used
            together with the airline discount sheet to review the applicable
            offer and calculate the resulting amounts.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Calculations should always be checked against the applicable
            airline offer, fare rules, GDS conditions and current QFC
            instructions before ticket issuance.
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
          Airline Discount Calculator & Travel Agent Resources Pakistan
        </footer>
      </div>
    </main>
  );
}