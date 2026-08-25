import type { Metadata } from "next";
import { decodeGuestName } from "@/lib/utils";
import { WeddingPageClient } from "@/components/wedding/WeddingPageClient";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const rawParam =
    resolvedSearchParams?.to ||
    resolvedSearchParams?.guest ||
    resolvedSearchParams?.k;

  const rawGuestStr =
    typeof rawParam === "string"
      ? rawParam
      : Array.isArray(rawParam)
      ? rawParam[0]
      : "";

  const guestName = decodeGuestName(rawGuestStr);

  if (guestName) {
    const title = `💌 Thân gửi: ${guestName} — Thư Mời Thành Hôn Tú Văn & Hường Nguyễn`;
    const description = `Trân trọng kính mời ${guestName} đến chung vui trong ngày hạnh phúc của Tú Văn & Hường Nguyễn vào ngày 12.12.2026.`;
    const ogTitle = `💌 Thân gửi: ${guestName} | Thư Mời Thành Hôn Tú Văn & Hường Nguyễn`;
    const ogImage = `/api/og?to=${encodeURIComponent(rawGuestStr)}`;
    const pageUrl = `/?to=${encodeURIComponent(rawGuestStr)}`;

    return {
      title,
      description,
      openGraph: {
        title: ogTitle,
        description,
        url: pageUrl,
        siteName: "Thiệp Cưới Tú Văn & Hường Nguyễn",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `Thư Mời Thành Hôn gửi ${guestName}`,
          },
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
        title: ogTitle,
        description,
        images: [ogImage],
      },
    };
  }

  // Default fallback metadata when no guest is specified
  return {
    title: "Tú Văn & Hường Nguyễn — Thư Mời Thành Hôn 12.12.2026",
    description:
      "Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của Tú Văn & Hường Nguyễn vào ngày 12 . 12 . 2026.",
    openGraph: {
      title: "Tú Văn & Hường Nguyễn — Thư Mời Thành Hôn (12.12.2026)",
      description:
        "Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày trọng đại!",
      url: "/",
      siteName: "Thiệp Cưới Tú Văn & Hường Nguyễn",
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          alt: "Thiệp Cưới Tú Văn & Hường Nguyễn",
        },
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
      images: ["/api/og"],
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const rawParam =
    resolvedSearchParams?.to ||
    resolvedSearchParams?.guest ||
    resolvedSearchParams?.k;

  const rawGuestStr =
    typeof rawParam === "string"
      ? rawParam
      : Array.isArray(rawParam)
      ? rawParam[0]
      : "";

  const guestName = decodeGuestName(rawGuestStr);

  return (
    <WeddingPageClient
      initialGuestName={guestName || undefined}
      initialIsPersonalized={Boolean(guestName)}
    />
  );
}
