import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Montserrat, Alex_Brush, Great_Vibes } from "next/font/google";
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

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

// Romantic, flowing, graceful cursive script for Groom & Bride names
const alexBrush = Alex_Brush({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-couple",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tuvan-huong.wedding"),
  title: "Tú Văn & Hường Nguyễn — Thư Mời Thành Hôn 12.12.2026",
  description:
    "Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của Tú Văn & Hường Nguyễn vào ngày 12 . 12 . 2026.",
  openGraph: {
    title: "Tú Văn & Hường Nguyễn — Thư Mời Thành Hôn (12.12.2026)",
    description:
      "Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày trọng đại!",
    url: "https://tuvan-huong.wedding",
    siteName: "Thiệp Cưới Tú Văn & Hường Nguyễn",
    images: [
      {
        url: "/images/TOBI0448.webp",
        width: 1200,
        height: 630,
        alt: "Thiệp Cưới Tú Văn & Hường Nguyễn",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tú Văn & Hường Nguyễn — Thư Mời Thành Hôn 12.12.2026",
    description: "Trân trọng kính mời bạn đến chung vui cùng chúng mình!",
    images: ["/images/TOBI0448.webp"],
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
      className={`${plusJakarta.variable} ${beVietnam.variable} ${montserrat.variable} ${alexBrush.variable} ${greatVibes.variable}`}
    >
      <body className="font-sans bg-[#120406] text-textMain min-h-screen antialiased flex justify-center">
        {children}
      </body>
    </html>
  );
}
