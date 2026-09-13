import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BulkValidityUpdate from "../components/BulkValidityUpdate";
import AirlineViewToggle from "../components/AirlineViewToggle";
import ManagerArrangementButton from "../components/ManagerArrangementButton";
import TableExportBridge from "../components/TableExportBridge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://discountsheet.vercel.app"),

  title: "Airline Discount Sheet Pakistan | Travel Agent Discounts | QFC Group",

  description:
    "QFC Group airline discount sheet for travel agents in Pakistan. Check airline discounts, GDS offers, Same Day Cash and Credit Airline rates, PSF calculations, and ticketing service charges.",

  keywords: [
    "airline discount sheet Pakistan",
    "travel agent airline discounts Pakistan",
    "GDS airline discounts",
    "Amadeus Galileo Sabre discounts",
    "airline discount calculator",
    "PSF calculator",
    "QFC Group",
  ],

  authors: [
    {
      name: "QFC Group Pvt Ltd",
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://discountsheet.vercel.app/",
  },

  openGraph: {
    title:
      "Airline Discount Sheet Pakistan | Travel Agent Discounts | QFC Group",
    description:
      "QFC Group airline discount sheet for travel agents in Pakistan. Check airline discounts, GDS offers, Same Day Cash and Credit Airline rates, PSF calculations, and ticketing service charges.",
    url: "https://discountsheet.vercel.app/",
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
    title:
      "Airline Discount Sheet Pakistan | Travel Agent Discounts | QFC Group",
    description:
      "QFC Group airline discount sheet for travel agents in Pakistan.",
    images: ["/QFClogo.png"],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  other: {
    "geo.region": "PK",
    "language": "en",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        {children}
        <BulkValidityUpdate />
        <AirlineViewToggle />
        <ManagerArrangementButton />
        <TableExportBridge />
      </body>
    </html>
  );
}
