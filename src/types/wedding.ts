export interface CoupleInfo {
  groom: {
    name: string;
    fullName: string;
    fatherName: string;
    motherName: string;
    role: string;
    hometown: string;
  };
  bride: {
    name: string;
    fullName: string;
    fatherName: string;
    motherName: string;
    role: string;
    hometown: string;
  };
  initials: string;
  weddingDate: string; // YYYY-MM-DD
  weddingDateFormatted: string; // e.g. "12 . 12 . 2026"
}

export interface WeddingEvent {
  id: string;
  category: "sg" | "que";
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  calendarTitle: string;
  calendarDescription: string;
  calendarLocation: string;
  startDateIso: string; // 2026-12-12T09:00:00+07:00
  endDateIso: string; // 2026-12-12T12:00:00+07:00
}

export interface TimelineStory {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
}

export interface BankAccount {
  ownerName: string;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  qrImage: string;
  role: "groom" | "bride";
  title: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  title?: string;
  alt: string;
  aspectRatio?: "square" | "tall" | "wide";
}

export interface WeddingData {
  couple: CoupleInfo;
  hero: {
    mainPhoto: string;
    tagline: string;
    subTagline: string;
  };
  invitation: {
    headline: string;
    quote: string;
    messageParagraphs: string[];
    closing: string;
  };
  events: WeddingEvent[];
  timeline: TimelineStory[];
  gallery: GalleryPhoto[];
  gift: {
    headline: string;
    subline: string;
    accounts: BankAccount[];
  };
  music: {
    src: string;
    title: string;
    artist: string;
    defaultVolume: number;
  };
  appsheetWebhookUrl?: string;
}
