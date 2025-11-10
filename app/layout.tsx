import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poppy Marketing Ads Manager",
  description: "Manage your Meta advertising campaigns with ease",
  openGraph: {
    title: "Poppy Marketing Ads Manager",
    description: "Manage your Meta advertising campaigns with ease",
    url: "https://app.poppymarketingandconsulting.com",
    siteName: "Poppy Marketing Ads Manager",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-poppy-white text-gray-800 font-raleway">
        {children}
      </body>
    </html>
  );
}
