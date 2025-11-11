import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

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
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
