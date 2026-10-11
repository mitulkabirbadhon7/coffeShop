import * as React from "react";

export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders Schema.org structured data JSON-LD in a script tag.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generates Schema.org/CoffeeShop structured data for Chocobliss Roastery.
 */
export function getRoasteryJsonLd(siteUrl: string = "https://chocobliss.coffee") {
  return {
    "@context": "https://schema.org",
    "@type": "CoffeeShop",
    "@id": `${siteUrl}#roastery`,
    name: "Chocobliss Coffee Roastery",
    alternateName: "Chocobliss Dhaka",
    url: siteUrl,
    logo: `${siteUrl}/images/story-craft.jpg`,
    image: `${siteUrl}/images/hero-poster.jpg`,
    description:
      "Specialty small-batch coffee roastery and fine cacao atelier based in Banani, Dhaka. Ethical direct-trade terroirs and artisanal espresso extracts.",
    telephone: "+880 1700-000000",
    priceRange: "৳৳",
    servesCuisine: "Specialty Coffee, Single-Origin Chocolate, Artisan Pastries",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Road 11, Block D, Banani",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka",
      postalCode: "1213",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.7937,
      longitude: 90.4066,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "22:00",
      },
    ],
    hasMenu: `${siteUrl}/products`,
    acceptsReservations: "False",
  };
}

/**
 * Generates Schema.org/Product structured data for an individual coffee offering.
 */
export function getProductJsonLd({
  name,
  description,
  slug,
  priceMinor,
  currency = "BDT",
  isAvailable = true,
  imagePath,
  siteUrl = "https://chocobliss.coffee",
}: {
  name: string;
  description?: string | null;
  slug: string;
  priceMinor: number;
  currency?: string;
  isAvailable?: boolean;
  imagePath?: string | null;
  siteUrl?: string;
}) {
  const imageUrl = imagePath
    ? (imagePath.startsWith("http") ? imagePath : `${siteUrl}${imagePath}`)
    : `${siteUrl}/images/story-craft.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description:
      description ||
      `Specialty single-origin coffee: ${name}. Small-batch roasted with precision in Dhaka.`,
    image: imageUrl,
    sku: slug,
    url: `${siteUrl}/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Chocobliss Coffee Roastery",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${slug}`,
      price: (priceMinor / 100).toFixed(2),
      priceCurrency: currency,
      priceValidUntil: "2027-12-31",
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Chocobliss Coffee Roastery",
      },
    },
  };
}

/**
 * Generates Schema.org/BreadcrumbList structured data.
 */
export function getBreadcrumbJsonLd(
  items: { name: string; url: string }[],
  siteUrl: string = "https://chocobliss.coffee"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}
