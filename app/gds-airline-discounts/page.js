import Link from "next/link";

export const metadata = {
  title: "GDS Airline Discounts Pakistan | QFC Group",
  description:
    "QFC Group GDS airline discounts for travel agents in Pakistan, including Amadeus, Galileo, Sabre and other GDS discount information.",
  alternates: {
    canonical: "https://discountsheet.vercel.app/gds-airline-discounts/",
  },
};

export default function GdsAirlineDiscountsPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>GDS Airline Discounts Pakistan</h1>
      <p>
        QFC Group GDS airline discount information for travel agents in
        Pakistan, including Amadeus, Galileo, Sabre, GDS offers and booking
        information.
      </p>
      <p>
        <Link href="/">Open the latest QFC Airline Discount Sheet</Link>
      </p>
    </main>
  );
}
