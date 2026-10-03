import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch Trình Di Chuyển — Đám Cưới Tú Văn & Hường Nguyễn",
  description:
    "Lịch trình di chuyển và các mốc thời gian chi tiết trong chuyến đi về Lâm Đồng dự đám cưới Tú Văn & Hường Nguyễn.",
  openGraph: {
    title: "Lịch Trình Di Chuyển — Đám Cưới Tú Văn & Hường Nguyễn",
    description:
      "Chi tiết lịch trình, thời gian, địa điểm, liên hệ và bản đồ di chuyển chuyến đi cưới Tú Văn & Hường Nguyễn.",
    siteName: "Thiệp Cưới Tú Văn & Hường Nguyễn",
    images: [
      {
        url: "/images/TOBI0530-og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Lịch Trình Di Chuyển — Đám Cưới Tú Văn & Hường Nguyễn",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lịch Trình Di Chuyển — Đám Cưới Tú Văn & Hường Nguyễn",
    description:
      "Chi tiết lịch trình, thời gian, địa điểm, liên hệ và bản đồ di chuyển chuyến đi cưới Tú Văn & Hường Nguyễn.",
    images: ["/images/TOBI0530-og.jpg"],
  },
};

export default function LichTrinh2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
