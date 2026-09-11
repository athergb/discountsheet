import Link from "next/link";

export const metadata = {
  title: "Airline Discount Calculator Pakistan | QFC Group",
  description:
    "QFC Group airline discount calculator for travel agents in Pakistan. Calculate airline discounts, PSF, segment discounts and ticket totals.",
  alternates: {
    canonical: "https://discountsheet.vercel.app/airline-discount-calculator/",
  },
};

export default function AirlineDiscountCalculatorPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Airline Discount Calculator Pakistan</h1>
      <p>
        QFC Group airline discount calculator for travel agents in Pakistan,
        including airline discounts, PSF calculations, segment discounts and
        ticket totals.
      </p>
      <p>
        <Link href="/">Open the QFC Airline Discount Sheet</Link>
      </p>
    </main>
  );
}
