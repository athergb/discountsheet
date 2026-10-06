import Link from "next/link";

export const metadata = {
  title: "GDS Airline Discounts Pakistan | Amadeus Galileo Sabre | QFC Group",
  description:
    "GDS airline discounts in Pakistan for travel agents using Amadeus, Galileo and Sabre. Check GDS offers, Same Day Cash, Credit Airline and related QFC tools.",
  keywords: [
    "GDS airline discounts Pakistan",
    "Amadeus airline discounts Pakistan",
    "Galileo airline discounts Pakistan",
    "Sabre airline discounts Pakistan",
    "GDS discounts travel agents",
    "airline GDS offers Pakistan",
    "GDS vs NDC Pakistan",
    "QFC GDS discounts",
  ],
  alternates: {
    canonical: "https://discountsheet.vercel.app/gds-airline-discounts",
  },
  openGraph: {
    title: "GDS Airline Discounts Pakistan | QFC Group",
    description:
      "GDS airline discounts and travel agent offers for Amadeus, Galileo and Sabre users in Pakistan.",
    url: "https://discountsheet.vercel.app/gds-airline-discounts",
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
    alt: "Amadeus GDS airline discounts for travel agents in Pakistan",
    officialUrl: "https://amadeus.com/en/travel-sellers/products/travel-platform-gds",
  },
  {
    name: "Galileo",
    code: "1G",
    logo: "/1G.png",
    description:
      "Find airline discount information and GDS-related benefits available through Galileo (Travelport+).",
    alt: "Galileo GDS airline discounts for travel agents in Pakistan",
    officialUrl: "https://www.travelport.com/",
  },
  {
    name: "Sabre",
    code: "1S",
    logo: "/1S.png",
    description:
      "Check airline offers and discount information for travel agents operating through Sabre.",
    alt: "Sabre GDS airline discounts for travel agents in Pakistan",
    officialUrl: "https://developer.sabre.com/",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "QFC Group Airline Discount Sheet",
      item: "https://discountsheet.vercel.app/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "GDS Airline Discounts Pakistan",
      item: "https://discountsheet.vercel.app/gds-airline-discounts",
    },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "GDS Airline Discounts Pakistan",
  description:
    "GDS airline discount information for Pakistan travel agents using Amadeus, Galileo and Sabre.",
  url: "https://discountsheet.vercel.app/gds-airline-discounts",
  inLanguage: "en-PK",
  isPartOf: {
    "@type": "WebSite",
    name: "QFC Group Airline Discount Sheet",
    url: "https://discountsheet.vercel.app/",
  },
  about: [
    {
      "@type": "Thing",
      name: "Global Distribution System",
    },
    {
      "@type": "Thing",
      name: "Airline discounts",
    },
    {
      "@type": "Thing",
      name: "Travel agents in Pakistan",
    },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <nav
          aria-label="Breadcrumb"
          style={{
            marginBottom: "25px",
            fontSize: "14px",
            color: "#6b7f84",
          }}
        >
          <Link
            href="/"
            style={{ color: "#087f94", textDecoration: "none" }}
          >
            QFC Airline Discount Sheet
          </Link>{" "}
          / GDS Airline Discounts Pakistan
        </nav>

        <header
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <img
            src="/QFClogo.png"
            alt="QFC Group Pvt Ltd airline discount sheet"
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
            GDS airline discounts for Pakistan travel agents using Amadeus,
            Galileo and Sabre. Review available GDS offers and related QFC
            ticketing resources before issuing tickets.
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
              href="/airline-discount-sheet-pakistan"
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
          aria-labelledby="gds-platforms"
          style={{
            marginBottom: "45px",
          }}
        >
          <h2
            id="gds-platforms"
            style={{
              textAlign: "center",
              color: "#087f94",
              fontSize: "32px",
              marginBottom: "24px",
            }}
          >
            Major GDS Platforms
          </h2>

          <p
            style={{
              maxWidth: "850px",
              margin: "0 auto 25px",
              textAlign: "center",
              lineHeight: 1.8,
              color: "#596d73",
            }}
          >
            Amadeus, Galileo and Sabre are major GDS platforms used by travel
            sellers to access travel content, fares, availability and
            reservation services. QFC uses these GDS names and codes to help
            travel agents identify the applicable discount category.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "22px",
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
                  alt={gds.alt}
                  loading="lazy"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "70px",
                    objectFit: "contain",
                    margin: "0 auto 20px",
                  }}
                />

                <h3
                  style={{
                    margin: "0 0 10px",
                    color: "#087f94",
                    fontSize: "25px",
                  }}
                >
                  {gds.name} ({gds.code})
                </h3>

                <p
                  style={{
                    lineHeight: 1.7,
                    color: "#596d73",
                    marginBottom: "18px",
                  }}
                >
                  {gds.description}
                </p>

                <a
                  href={gds.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#087f94",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Official {gds.name} resource →
                </a>
              </article>
            ))}
          </div>
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
            What Is a GDS?
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            A Global Distribution System (GDS) is a technology platform that
            connects travel sellers with travel content from providers such
            as airlines. Travel agents can use a GDS to search schedules,
            availability and fares and to manage reservations and ticketing.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            For Pakistan travel agents, GDS platforms can be an important part
            of the airline booking workflow. QFC provides a separate airline
            discount sheet so agents can check applicable discount information
            before ticket issuance.
          </p>
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
            Amadeus Airline Discounts
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Amadeus is a major travel technology and GDS platform used by
            travel sellers. Travel agents using Amadeus can use the QFC
            airline discount sheet to review applicable GDS offers and compare
            the available ticketing options.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Before issuing a ticket, agents should confirm the current airline
            offer, fare conditions, validity and applicable booking channel.
            A discount shown on the current sheet should be checked against
            the specific ticketing conditions.
          </p>
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
            Galileo Airline Discounts
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Galileo is the historic name associated with Travelport's 1G
            platform, now commonly referred to as Travelport+. Travel agents
            using the 1G environment can use the QFC discount sheet to review
            applicable GDS airline offers.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Because airline offers and conditions can change, agents should
            confirm the current discount, validity and ticketing requirements
            before issuing a ticket.
          </p>
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
            Sabre Airline Discounts
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Sabre is a major GDS and travel marketplace connecting travel
            providers with travel agencies. Travel agents using Sabre can use
            the QFC airline discount sheet to review applicable GDS offers and
            related ticketing information.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            The applicable discount should be checked against the current
            airline offer and the specific fare, route and ticketing
            conditions before ticket issuance.
          </p>
        </section>

        <section
          style={{
            background: "#eef9fb",
            borderRadius: "18px",
            padding: "35px",
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
            GDS vs NDC Airline Discounts
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            GDS and NDC are different airline distribution channels. An
            airline may provide different fares, content or conditions through
            each channel, so travel agents should identify whether a QFC offer
            is marked as GDS, NDC or another booking category before applying
            it.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            The QFC airline discount sheet separates available offer
            categories to help agents identify the relevant option before
            ticketing. The live sheet should always be used to confirm the
            latest applicable offer.
          </p>
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
            Same Day Cash and Credit Airline Offers
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            QFC's airline discount sheet includes offer categories such as
            Same Day Cash and Credit Airline in addition to GDS and NDC
            categories. These categories help travel agents identify the
            ticketing arrangement associated with an offer.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Travel agents should check the current airline-specific terms,
            validity and ticketing conditions before using an offer. The live
            QFC discount sheet is the appropriate place to check the current
            available information.
          </p>
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
            How Pakistan Travel Agents Use the QFC GDS Discount Sheet
          </h2>

          <ol style={{ lineHeight: 1.9, color: "#596d73", paddingLeft: "22px" }}>
            <li>Find the relevant airline or available airline offer.</li>
            <li>
              Identify whether the offer is GDS, NDC, Same Day Cash, Credit
              Airline or another category.
            </li>
            <li>Check the applicable discount and listed conditions.</li>
            <li>Confirm the booking and ticketing channel.</li>
            <li>
              Use the applicable discount, PSF or segment calculation when
              required.
            </li>
            <li>Confirm the final ticket amount before issuance.</li>
          </ol>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Checking the current sheet is important because airline offers can
            change by airline, route, booking channel and validity period.
          </p>
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
            GDS Discounts, PSF and Ticket Calculations
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            The airline discount is one part of a travel agent's ticket
            calculation. Depending on the booking, agents may also need to
            consider PSF, segment-related amounts, passenger type and other
            applicable ticketing charges.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            QFC also provides an airline discount calculator that can help
            agents work through discount, PSF and segment-related calculations
            before confirming the final amount.
          </p>
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
            Why Check the Current Airline Discount Sheet?
          </h2>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            Airline discount offers can change by airline, booking channel,
            validity period and ticketing conditions. Travel agents should
            therefore use the current QFC airline discount sheet instead of
            relying on an old saved discount list.
          </p>

          <p style={{ lineHeight: 1.8, color: "#596d73" }}>
            The live QFC sheet provides a central reference for Pakistan
            travel agents to review available airline discount information and
            related GDS, NDC and ticketing resources.
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
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Link
              href="/airline-discount-sheet-pakistan"
              style={{
                color: "#087f94",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Airline Discount Sheet Pakistan →
            </Link>

            <Link
              href="/airline-discount-calculator"
              style={{
                color: "#087f94",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Airline Discount Calculator Pakistan →
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
          GDS Airline Discounts &amp; Travel Agent Resources Pakistan
        </footer>
      </div>
    </main>
  );
}
