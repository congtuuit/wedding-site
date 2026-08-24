import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
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
  themeColor: "#FDFCFA",
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
      className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${inter.variable} ${greatVibes.variable}`}
    >
      <body className="font-sans bg-background text-textMain min-h-screen">
        {children}
      </body>
    </html>
  );
}
