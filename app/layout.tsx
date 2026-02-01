import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google"; // Using Lato for a clean, professional sans-serif
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amicus AI | The Future of Counsel",
  description: "Elite AI Legal Consultancy. Jurisdiction-aware, private, and precise.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.phone.email/verify_email_v1.js"
          strategy="afterInteractive"
        />
        <meta name="google-site-verification" content="z89_y2w8b2a0dGcpC0S3hy4ObEPHA1A09Ts5T3aHZEU" />
      </head>
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-navy-950 text-slate-200 font-sans`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
