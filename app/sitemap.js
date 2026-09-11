export default function sitemap() {
  return [
    {
      url: "https://discountsheet.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://discountsheet.vercel.app/airline-discount-sheet-pakistan/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://discountsheet.vercel.app/gds-airline-discounts/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://discountsheet.vercel.app/airline-discount-calculator/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
