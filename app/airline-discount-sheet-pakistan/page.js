import Link from "next/link";

export const metadata = {
  title: "Airline Discount Sheet Pakistan | QFC Group",
  description:
    "QFC Group airline discount sheet for travel agents in Pakistan, including current airline discounts, GDS offers and booking information.",
  alternates: {
    canonical: "https://discountsheet.vercel.app/airline-discount-sheet-pakistan/",
  },
};

export default function AirlineDiscountSheetPakistanPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Airline Discount Sheet Pakistan</h1>
      <p>
        QFC Group airline discount information for travel agents in Pakistan,
        including airline discounts, GDS offers, NDC offers and booking
        information.
      </p>
      <p>
        <Link href="/">Open the latest QFC Airline Discount Sheet</Link>
      </p>
    </main>
  );
}
