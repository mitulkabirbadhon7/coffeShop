export const siteConfig = {
  name: "Chocobliss Coffee Roastery",
  shortName: "Chocobliss",
  description:
    "A sanctuary of artisanal coffee roasting and handcrafted single-origin chocolate creations in Dhaka.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  currency: "BDT",
  currencySymbol: "৳",
  timezone: "Asia/Dhaka",
  operatingHours: "Daily 8:00 AM – 10:00 PM",
  contact: {
    address: "House 14, Road 7, Banani, Dhaka, Bangladesh",
    phone: "+880 1700 000000",
    email: "contact@chocoblisscoffee.com",
  },
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Menu & Roasts", href: "/products" },
      { name: "Our Roastery", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    account: [
      { name: "Dashboard", href: "/account" },
      { name: "Order History", href: "/account/orders" },
      { name: "Saved Addresses", href: "/account/addresses" },
    ],
    admin: [
      { name: "Overview", href: "/admin" },
      { name: "Products", href: "/admin/products" },
      { name: "Orders", href: "/admin/orders" },
      { name: "Site Content", href: "/admin/content" },
      { name: "Testimonials", href: "/admin/testimonials" },
      { name: "Messages", href: "/admin/messages" },
    ],
  },
  policy: {
    model: "Pickup Only",
    onlinePayments: false,
    delivery: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;
