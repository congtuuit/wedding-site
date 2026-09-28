import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Alex_Brush } from "next/font/google";
import "./globals.css";

// Modern Luxury Sans-Serif for Headings & Titles (Font Không Chân Sang Trọng)
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

// Modern Clean Sans-Serif for Body & Reading (Font Không Chân Dễ Đọc)
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Romantic, flowing, graceful cursive script for Groom & Bride names
const alexBrush = Alex_Brush({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-couple",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://tu-huong-wedding.vercel.app")
  ),
  title: "Tú Văn & Hường Nguyễn — Thư Mời Tân Hôn 12.12.2026",
  description:
    "Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của Tú Văn & Hường Nguyễn vào ngày 12 . 12 . 2026.",
  openGraph: {
    title: "Tú Văn & Hường Nguyễn — Thư Mời Tân Hôn (12.12.2026)",
    description:
      "Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày trọng đại!",
    siteName: "Thiệp Cưới Tú Văn & Hường Nguyễn",
    images: [
      {
        url: "/images/TOBI0530-og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Thiệp Cưới Tú Văn & Hường Nguyễn",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tú Văn & Hường Nguyễn — Thư Mời Tân Hôn 12.12.2026",
    description: "Trân trọng kính mời bạn đến chung vui cùng chúng mình!",
    images: ["/images/TOBI0530-og.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakarta.variable} ${beVietnam.variable} ${alexBrush.variable}`}
    >
      <body className="font-sans bg-[#120406] text-textMain min-h-screen antialiased flex justify-center">
        {children}
      </body>
    </html>
  );
}
