import type { Metadata } from "next";
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

  const eventQueryPart = rawEventStr ? `&event=${encodeURIComponent(rawEventStr)}` : "";
  const coupleNameStr = stage.primaryCoupleName;

  if (guestName) {
    const title = `💌 Thân gửi: ${guestName} — ${stage.invitationHeadline} ${coupleNameStr}`;
    const description = `Trân trọng kính mời ${guestName} đến chung vui trong ngày hạnh phúc của ${coupleNameStr} vào ngày ${stage.weddingDateFormatted} (${stage.ceremonyName} tại ${stage.location}).`;
    const ogTitle = `💌 Thân gửi: ${guestName} | ${stage.invitationHeadline} ${coupleNameStr}`;
    const ogImage = `/api/og?to=${encodeURIComponent(rawGuestStr)}${eventQueryPart}`;
    const pageUrl = `/?to=${encodeURIComponent(rawGuestStr)}${eventQueryPart}`;

    return {
      title,
      description,
      openGraph: {
        title: ogTitle,
        description,
        url: pageUrl,
        siteName: `Thiệp Cưới ${coupleNameStr}`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${stage.invitationHeadline} gửi ${guestName}`,
          },
          {
            url: "/images/TOBI0448.webp",
            width: 1200,
            height: 630,
            alt: `Thiệp Cưới ${coupleNameStr}`,
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
  const fallbackOgImage = `/api/og${rawEventStr ? `?event=${encodeURIComponent(rawEventStr)}` : ""}`;
  return {
    title: `${coupleNameStr} — ${stage.invitationHeadline} ${stage.weddingDateFormatted}`,
    description: `Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của ${coupleNameStr} vào ngày ${stage.weddingDateFormatted} (${stage.ceremonyName} tại ${stage.location}).`,
    openGraph: {
      title: `${coupleNameStr} — ${stage.invitationHeadline} (${stage.weddingDateFormatted})`,
      description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày trọng đại (${stage.ceremonyName})!`,
      url: `/${rawEventStr ? `?event=${encodeURIComponent(rawEventStr)}` : ""}`,
      siteName: `Thiệp Cưới ${coupleNameStr}`,
      images: [
        {
          url: fallbackOgImage,
          width: 1200,
          height: 630,
          alt: `Thiệp Cưới ${coupleNameStr} — ${stage.ceremonyName}`,
        },
        {
          url: "/images/TOBI0448.webp",
          width: 1200,
          height: 630,
          alt: `Thiệp Cưới ${coupleNameStr}`,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${coupleNameStr} — ${stage.invitationHeadline} ${stage.weddingDateFormatted}`,
      description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày ${stage.ceremonyName}!`,
      images: [fallbackOgImage],
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

