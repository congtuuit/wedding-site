import type { Metadata } from "next";
import { headers } from "next/headers";
import { decodeGuestName } from "@/lib/utils";
import { getActiveWeddingStage } from "@/lib/wedding-timeline";
import { normalizeLocale } from "@/lib/i18n";
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

  const langParam = resolvedSearchParams?.lang;

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

  const rawLangStr =
    typeof langParam === "string"
      ? langParam
      : Array.isArray(langParam)
      ? langParam[0]
      : undefined;

  const guestName = decodeGuestName(rawGuestStr);
  const stage = getActiveWeddingStage(rawEventStr);
  const isJp = normalizeLocale(rawLangStr) === "jp";

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

  // Build query parts
  const queryParams = new URLSearchParams();
  if (isJp) queryParams.set("lang", "jp");
  if (rawGuestStr) queryParams.set("to", rawGuestStr);
  if (rawEventStr) queryParams.set("event", rawEventStr);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const pageUrl = `${siteUrl}/${queryString}`;

  const coupleNameStr = stage.primaryCoupleName;
  const shareImageUrl = `${siteUrl}/images/TOBI0530-og.jpg`;

  if (isJp) {
    const jpCoupleName = coupleNameStr;
    if (guestName) {
      const title = `💌 招待状: ${guestName} 様 — 結婚披露宴のご案内 | ${jpCoupleName}`;
      const description = `謹啓　${guestName} 様、${jpCoupleName}の結婚披露宴へご案内申し上げます。皆様と幸せなひとときをご一緒できることを心より楽しみにしております。`;
      const ogTitle = `💌 招待状: ${guestName} 様 | ${jpCoupleName} 結婚式のご案内`;

      return {
        metadataBase: null,
        title,
        description,
        alternates: {
          canonical: pageUrl,
        },
        openGraph: {
          title: ogTitle,
          description,
          url: pageUrl,
          siteName: `${jpCoupleName} 結婚式のご案内`,
          images: [
            {
              url: shareImageUrl,
              secureUrl: shareImageUrl,
              width: 1200,
              height: 630,
              type: "image/jpeg",
              alt: `結婚式のご案内 - ${guestName} 様`,
            },
          ],
          locale: "ja_JP",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: ogTitle,
          description,
          images: [shareImageUrl],
        },
      };
    }

    // Default JP metadata
    const title = `${jpCoupleName} — 結婚披露宴のご案内 (2026年12月12日)`;
    const description = `謹啓　${jpCoupleName}の結婚披露宴へご案内申し上げます。2026年12月12日、The ADORA Center 3階 エメラルドホール（ホーチミン市タンソンニャット坊ホアンヴァンツー通り431番地）にて皆様のお越しを心よりお待ち申し上げます。`;

    return {
      metadataBase: null,
      title,
      description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: `${jpCoupleName} 結婚式のご案内`,
        images: [
          {
            url: shareImageUrl,
            secureUrl: shareImageUrl,
            width: 1200,
            height: 630,
            type: "image/jpeg",
            alt: `結婚式のご案内 - ${jpCoupleName}`,
          },
        ],
        locale: "ja_JP",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [shareImageUrl],
      },
    };
  }

  // Vietnamese metadata (default)
  if (guestName) {
    const title = `💌 Thân gửi: ${guestName} — ${stage.invitationHeadline} ${coupleNameStr}`;
    const description = `Trân trọng kính mời ${guestName} đến chung vui trong ngày hạnh phúc của ${coupleNameStr} vào ngày ${stage.weddingDateFormatted} (${stage.ceremonyName} tại ${stage.location}).`;
    const ogTitle = `💌 Thân gửi: ${guestName} | ${stage.invitationHeadline} ${coupleNameStr}`;

    return {
      metadataBase: null,
      title,
      description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: ogTitle,
        description,
        url: pageUrl,
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
    };
  }

  // Default fallback metadata when no guest is specified
  return {
    metadataBase: null,
    title: `${coupleNameStr} — ${stage.invitationHeadline} ${stage.weddingDateFormatted}`,
    description: `Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của ${coupleNameStr} vào ngày ${stage.weddingDateFormatted} (${stage.ceremonyName} tại ${stage.location}).`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${coupleNameStr} — ${stage.invitationHeadline} (${stage.weddingDateFormatted})`,
      description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình trong ngày trọng đại (${stage.ceremonyName})!`,
      url: pageUrl,
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

  const langParam = resolvedSearchParams?.lang;

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

  const rawLangStr =
    typeof langParam === "string"
      ? langParam
      : Array.isArray(langParam)
      ? langParam[0]
      : undefined;

  const guestName = decodeGuestName(rawGuestStr);
  const stage = getActiveWeddingStage(rawEventStr);
  const initialLang = normalizeLocale(rawLangStr);

  return (
    <WeddingPageClient
      initialGuestName={guestName || undefined}
      initialIsPersonalized={Boolean(guestName)}
      initialStage={stage}
      initialLang={initialLang}
    />
  );
}


