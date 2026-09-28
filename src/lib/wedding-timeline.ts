import weddingDataJson from "@/data/wedding.json";
import { WeddingEvent } from "@/types/wedding";

export type WeddingStageKey = "que" | "sg";

export interface ActiveWeddingStage {
  stageKey: WeddingStageKey;
  ceremonyName: string; // e.g. "Lễ Vu Quy" or "Lễ Tân Hôn"
  ceremonyBadge: string; // e.g. "✨ LỄ VU QUY ✨" or "✨ LỄ TÂN HÔN ✨"
  invitationHeadline: string; // e.g. "Thư Mời Lễ Vu Quy" or "Thư Mời Tân Hôn"
  primaryCoupleName: string; // "Hường Nguyễn & Tú Văn" vs "Tú Văn & Hường Nguyễn"
  shortCoupleName: string; // "Hường & Tú" vs "Tú & Hường"
  uppercaseCoupleName: string; // "HƯỜNG NGUYỄN & TÚ VĂN" vs "TÚ VĂN & HƯỜNG NGUYỄN"
  initials: string; // "H & T" vs "T & H"
  firstName: string; // First displayed person's name
  secondName: string; // Second displayed person's name
  showGroomAccount: boolean; // false for Vu Quy, true for Tân Hôn
  weddingDate: string; // "2026-10-10" or "2026-12-12"
  weddingDateFormatted: string; // "10 . 10 . 2026" or "12 . 12 . 2026"
  targetCountdownIso: string;
  venueShort: string;
  location: string;
  isPast: boolean;
  activeEvent: WeddingEvent;
  secondaryEvent: WeddingEvent;
  orderedEvents: WeddingEvent[];
  defaultFilter: "que" | "sg" | "all";
}

// Cutoff timestamps (in Vietnam Time GMT+7: end of day 23:59:59)
export const NHA_GAI_CUTOFF_ISO = "2026-10-10T23:59:59+07:00";
export const NHA_TRAI_CUTOFF_ISO = "2026-12-12T23:59:59+07:00";

const allEvents: WeddingEvent[] = weddingDataJson.events as WeddingEvent[];
const nhaGaiEvent = allEvents.find((e) => e.category === "que") || allEvents[0];
const nhaTraiEvent = allEvents.find((e) => e.category === "sg") || allEvents[1] || allEvents[0];

/**
 * Intelligent time-based wedding stage resolver.
 * 
 * Logic:
 * 1. If overrideParam is provided ('que' or 'sg'), force that specific event.
 * 2. Otherwise compare current time (referenceDate, default = now):
 *    - now <= 10.10.2026 23:59:59 (GMT+7) -> Nhà Gái (Lễ Vu Quy - 10.10.2026)
 *      - Tên: Cô Dâu & Chú Rể (Hường Nguyễn & Tú Văn)
 *      - Ẩn thông tin chuyển khoản Chú Rể
 *    - 11.10.2026 <= now <= 12.12.2026 23:59:59 (GMT+7) -> Nhà Trai (Lễ Tân Hôn - 12.12.2026)
 *      - Tên: Chú Rể & Cô Dâu (Tú Văn & Hường Nguyễn)
 *      - Hiện cả 2 thông tin chuyển khoản (Chú Rể & Cô Dâu)
 *    - now > 12.12.2026 -> Retains Nhà Trai (12.12.2026, with isPast = true)
 */
export function getActiveWeddingStage(
  overrideParam?: string | null,
  referenceDate?: Date
): ActiveWeddingStage {
  const normalizedParam = overrideParam?.toLowerCase().trim();

  // 1. Manual Overrides (e.g. from ?event=que or ?type=que or ?event=nha-gai)
  if (normalizedParam === "que" || normalizedParam === "nha-gai" || normalizedParam === "vu-quy") {
    return {
      stageKey: "que",
      ceremonyName: "Lễ Vu Quy",
      ceremonyBadge: "✨ LỄ VU QUY ✨",
      invitationHeadline: "Thư Mời Lễ Vu Quy",
      primaryCoupleName: "Hường Nguyễn & Tú Văn",
      shortCoupleName: "Hường & Tú",
      uppercaseCoupleName: "HƯỜNG NGUYỄN & TÚ VĂN",
      initials: "H & T",
      firstName: "Hường Nguyễn",
      secondName: "Tú Văn",
      showGroomAccount: false,
      weddingDate: "2026-10-10",
      weddingDateFormatted: "10 . 10 . 2026",
      targetCountdownIso: nhaGaiEvent.startDateIso,
      venueShort: `${nhaGaiEvent.venue}, ${nhaGaiEvent.address}`,
      location: "Cát Tiên, Lâm Đồng",
      isPast: false,
      activeEvent: nhaGaiEvent,
      secondaryEvent: nhaTraiEvent,
      orderedEvents: [nhaGaiEvent, nhaTraiEvent],
      defaultFilter: "que",
    };
  }

  if (
    normalizedParam === "sg" ||
    normalizedParam === "nha-trai" ||
    normalizedParam === "thanh-hon" ||
    normalizedParam === "tan-hon"
  ) {
    return {
      stageKey: "sg",
      ceremonyName: "Lễ Tân Hôn",
      ceremonyBadge: "✨ LỄ TÂN HÔN ✨",
      invitationHeadline: "Thư Mời Tân Hôn",
      primaryCoupleName: "Tú Văn & Hường Nguyễn",
      shortCoupleName: "Tú & Hường",
      uppercaseCoupleName: "TÚ VĂN & HƯỜNG NGUYỄN",
      initials: "T & H",
      firstName: "Tú Văn",
      secondName: "Hường Nguyễn",
      showGroomAccount: true,
      weddingDate: "2026-12-12",
      weddingDateFormatted: "12 . 12 . 2026",
      targetCountdownIso: nhaTraiEvent.startDateIso,
      venueShort: `${nhaTraiEvent.venue}, ${nhaTraiEvent.address}`,
      location: "TP. Hồ Chí Minh",
      isPast: false,
      activeEvent: nhaTraiEvent,
      secondaryEvent: nhaGaiEvent,
      orderedEvents: [nhaTraiEvent, nhaGaiEvent],
      defaultFilter: "sg",
    };
  }

  // 2. Automatic Date Calculation
  const now = referenceDate ? referenceDate.getTime() : Date.now();
  const nhaGaiCutoff = new Date(NHA_GAI_CUTOFF_ISO).getTime();
  const nhaTraiCutoff = new Date(NHA_TRAI_CUTOFF_ISO).getTime();

  // Phase 1: Up to and including 10.10.2026 (Nhà Gái - Lễ Vu Quy)
  if (now <= nhaGaiCutoff) {
    return {
      stageKey: "que",
      ceremonyName: "Lễ Vu Quy",
      ceremonyBadge: "✨ LỄ VU QUY ✨",
      invitationHeadline: "Thư Mời Lễ Vu Quy",
      primaryCoupleName: "Hường Nguyễn & Tú Văn",
      shortCoupleName: "Hường & Tú",
      uppercaseCoupleName: "HƯỜNG NGUYỄN & TÚ VĂN",
      initials: "H & T",
      firstName: "Hường Nguyễn",
      secondName: "Tú Văn",
      showGroomAccount: false,
      weddingDate: "2026-10-10",
      weddingDateFormatted: "10 . 10 . 2026",
      targetCountdownIso: nhaGaiEvent.startDateIso,
      venueShort: `${nhaGaiEvent.venue}, ${nhaGaiEvent.address}`,
      location: "Cát Tiên, Lâm Đồng",
      isPast: false,
      activeEvent: nhaGaiEvent,
      secondaryEvent: nhaTraiEvent,
      orderedEvents: [nhaGaiEvent, nhaTraiEvent],
      defaultFilter: "que",
    };
  }

  // Phase 2: After 10.10.2026 and up to 12.12.2026 (Nhà Trai - Lễ Tân Hôn)
  if (now <= nhaTraiCutoff) {
    return {
      stageKey: "sg",
      ceremonyName: "Lễ Tân Hôn",
      ceremonyBadge: "✨ LỄ TÂN HÔN ✨",
      invitationHeadline: "Thư Mời Tân Hôn",
      primaryCoupleName: "Tú Văn & Hường Nguyễn",
      shortCoupleName: "Tú & Hường",
      uppercaseCoupleName: "TÚ VĂN & HƯỜNG NGUYỄN",
      initials: "T & H",
      firstName: "Tú Văn",
      secondName: "Hường Nguyễn",
      showGroomAccount: true,
      weddingDate: "2026-12-12",
      weddingDateFormatted: "12 . 12 . 2026",
      targetCountdownIso: nhaTraiEvent.startDateIso,
      venueShort: `${nhaTraiEvent.venue}, ${nhaTraiEvent.address}`,
      location: "TP. Hồ Chí Minh",
      isPast: false,
      activeEvent: nhaTraiEvent,
      secondaryEvent: nhaGaiEvent,
      orderedEvents: [nhaTraiEvent, nhaGaiEvent],
      defaultFilter: "sg",
    };
  }

  // Phase 3: After 12.12.2026 (Retain final state)
  return {
    stageKey: "sg",
    ceremonyName: "Lễ Tân Hôn",
    ceremonyBadge: "✨ LỄ TÂN HÔN ✨",
    invitationHeadline: "Thư Mời Tân Hôn",
    primaryCoupleName: "Tú Văn & Hường Nguyễn",
    shortCoupleName: "Tú & Hường",
    uppercaseCoupleName: "TÚ VĂN & HƯỜNG NGUYỄN",
    initials: "T & H",
    firstName: "Tú Văn",
    secondName: "Hường Nguyễn",
    showGroomAccount: true,
    weddingDate: "2026-12-12",
    weddingDateFormatted: "12 . 12 . 2026",
    targetCountdownIso: nhaTraiEvent.startDateIso,
    venueShort: `${nhaTraiEvent.venue}, ${nhaTraiEvent.address}`,
    location: "TP. Hồ Chí Minh",
    isPast: true,
    activeEvent: nhaTraiEvent,
    secondaryEvent: nhaGaiEvent,
    orderedEvents: [nhaTraiEvent, nhaGaiEvent],
    defaultFilter: "all",
  };
}
