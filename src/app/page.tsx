import type { Metadata } from "next";
import { headers } from "next/headers";
import { decodeGuestName } from "@/lib/utils";
import { getActiveWeddingStage } from "@/lib/wedding-timeline";
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

  const eventParam =
    resolvedSearchParams?.event ||
    resolvedSearchParams?.type;

  const rawGuestStr =
    typeof rawParam === "string"
      ? rawParam
      : Array.isArray(rawParam)
      ? rawParam[0]
      : "";

  const rawEventStr =
    typeof eventParam === "string"
      ? eventParam
      : Array.isArray(eventParam)
      ? eventParam[0]
      : undefined;

  const guestName = decodeGuestName(rawGuestStr);
  const stage = getActiveWeddingStage(rawEventStr);

  let siteUrl = "";
  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const proto =
      headersList.get("x-forwarded-proto") ||
      (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
    if (host) {
      siteUrl = `${proto}://${host}`;
    }
  } catch {
    // Fallback when headers are not available
  }

  if (!siteUrl) {
    siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://tu-huong-wedding.vercel.app");
  }

  siteUrl = siteUrl.replace(/\/+$/, "");

  const eventQueryPart = rawEventStr ? `&event=${encodeURIComponent(rawEventStr)}` : "";
  const coupleNameStr = stage.primaryCoupleName;

  const shareImageUrl = `${siteUrl}/images/TOBI0530-og.jpg`;

  if (guestName) {
    const title = `💌 Thân gửi: ${guestName} — ${stage.invitationHeadline} ${coupleNameStr}`;
    const description = `Trân trọng kính mời ${guestName} đến chung vui trong ngày hạnh phúc của ${coupleNameStr} vào ngày ${stage.weddingDateFormatted} (${stage.ceremonyName} tại ${stage.location}).`;
    const ogTitle = `💌 Thân gửi: ${guestName} | ${stage.invitationHeadline} ${coupleNameStr}`;
    const pageUrl = `${siteUrl}/?to=${encodeURIComponent(rawGuestStr)}${eventQueryPart}`;

    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: ogTitle,
        description,
        siteName: `Thiệp Cưới ${coupleNameStr}`,
        images: [
          {
            url: shareImageUrl,
            secureUrl: shareImageUrl,
            width: 1200,
            height: 630,
            type: "image/jpeg",
            alt: `${stage.invitationHeadline} gửi ${guestName}`,
          },
        ],
        locale: "vi_VN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description,
        images: [shareImageUrl],
      },
      other: {
        "og:url": pageUrl,
      },
    };
  }

  // Default fallback metadata when no guest is specified
  const fallbackPageUrl = `${siteUrl}/${rawEventStr ? `?event=${encodeURIComponent(rawEventStr)}` : ""}`;
  return {
    metadataBase: new URL(siteUrl),
    title: `${coupleNameStr} — ${stage.invitationHeadline} ${stage.weddingDateFormatted}`,
    description: `Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của ${coupleNameStr} vào ngày ${stage.weddingDateFormatted} (${stage.ceremonyName} tại ${stage.location}).`,
    alternates: {
      canonical: fallbackPageUrl,
    },
    openGraph: {
      title: `${coupleNameStr} — ${stage.invitationHeadline} (${stage.weddingDateFormatted})`,
      description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày trọng đại (${stage.ceremonyName})!`,
      siteName: `Thiệp Cưới ${coupleNameStr}`,
      images: [
        {
          url: shareImageUrl,
          secureUrl: shareImageUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `Thiệp Cưới ${coupleNameStr} — ${stage.ceremonyName}`,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${coupleNameStr} — ${stage.invitationHeadline} ${stage.weddingDateFormatted}`,
      description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày ${stage.ceremonyName}!`,
      images: [shareImageUrl],
    },
    other: {
      "og:url": fallbackPageUrl,
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const rawParam =
    resolvedSearchParams?.to ||
    resolvedSearchParams?.guest ||
    resolvedSearchParams?.k;

  const eventParam =
    resolvedSearchParams?.event ||
    resolvedSearchParams?.type;

  const rawGuestStr =
    typeof rawParam === "string"
      ? rawParam
      : Array.isArray(rawParam)
      ? rawParam[0]
      : "";

  const rawEventStr =
    typeof eventParam === "string"
      ? eventParam
      : Array.isArray(eventParam)
      ? eventParam[0]
      : undefined;

  const guestName = decodeGuestName(rawGuestStr);
  const stage = getActiveWeddingStage(rawEventStr);

  return (
    <WeddingPageClient
      initialGuestName={guestName || undefined}
      initialIsPersonalized={Boolean(guestName)}
      initialStage={stage}
    />
  );
}

