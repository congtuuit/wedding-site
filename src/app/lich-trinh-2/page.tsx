"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Car,
  UtensilsCrossed,
  BedDouble,
  Church,
  PartyPopper,
  MapPin,
  ArrowLeft,
  Heart,
  Clock,
  Calendar,
  Navigation,
  ChevronDown,
  CheckCircle2,
  Phone,
  X,
} from "lucide-react";
import weddingData from "@/data/wedding.json";
import itineraryCongTy from "@/data/itinerary-cong-ty.json";

const ITINERARY_CACHE_KEY = "lich-trinh-2:itinerary";
const ITINERARY_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// Chỉ sử dụng cache từ ngày 09/10/2026 đến hết 10/10/2026 theo giờ Việt Nam (UTC+7)
const CACHE_START_VN = new Date("2026-10-09T00:00:00+07:00").getTime();
const CACHE_END_VN = new Date("2026-10-10T23:59:59.999+07:00").getTime();

function isCacheAllowed(): boolean {
  const now = Date.now();
  return now >= CACHE_START_VN && now <= CACHE_END_VN;
}

const CONTACTS = [
  { name: "Tài xế", phone: "đang cập nhật" },
  { name: "Anh Tân", phone: "0909666489" },
  { name: "Chị Tuyền", phone: "" },
  { name: "Chị Nga", phone: "" },
  { name: "Chị Thùy", phone: "" },
  { name: "Chị Yến", phone: "0979457975" },
  { name: "Hậu", phone: "" },
  { name: "Tiên", phone: "" },
  { name: "An Tiên", phone: "" },
  { name: "Thanh", phone: "0708975273" },
  { name: "Huyền", phone: "0888619628" },
  { name: "Hương", phone: "0339833242" },
  { name: "Phim", phone: "0339769196" },
  { name: "Anh Kiên", phone: "086 2443775" },
];

type ItineraryCategory = "travel" | "meal" | "rest" | "ceremony" | "party";
type EventStatus = "past" | "active" | "future";

interface ItineraryEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  mapUrl: string;
  category: ItineraryCategory;
}

interface ItineraryDay {
  id: string;
  dayLabel: string;
  dayName: string;
  theme: string;
  events: ItineraryEvent[];
}

const CATEGORY_CONFIG: Record<
  ItineraryCategory,
  {
    icon: React.ReactNode;
    label: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  travel: {
    icon: <Car className="w-4 h-4" />,
    label: "Di chuyển",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  meal: {
    icon: <UtensilsCrossed className="w-4 h-4" />,
    label: "Ăn uống",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  rest: {
    icon: <BedDouble className="w-4 h-4" />,
    label: "Nghỉ ngơi",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  ceremony: {
    icon: <Church className="w-4 h-4" />,
    label: "Nghi lễ",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  party: {
    icon: <PartyPopper className="w-4 h-4" />,
    label: "Tiệc tùng",
    color: "text-fuchsia-700",
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
  },
};

// ── Standalone realtime clock — completely isolated from parent renders ──
function LiveClock({ isMock = false }: { isMock?: boolean }) {
  const [display, setDisplay] = useState({ time: "", date: "" });

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setDisplay({
        time: d.toLocaleTimeString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        date: d.toLocaleDateString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      });
    };
    fmt(); // call immediately so no blank flash
    const id = setInterval(fmt, 1_000);
    return () => clearInterval(id);
  }, []);

  if (!display.time) return null; // avoid SSR mismatch

  return (
    <div className="glass-card rounded-2xl border border-white/80 shadow-md px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-xs text-gray-500 font-medium">
          {isMock ? "⏱ Mock time" : "Giờ Việt Nam"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{display.date}</span>
        <span className="text-sm font-bold text-rose-600 tabular-nums tracking-tight">
          {display.time}
        </span>
      </div>
    </div>
  );
}

/** Parse "Thứ Sáu, 09/10/2026" → extract DD/MM/YYYY */
function parseDayDate(
  dayName: string,
): { day: number; month: number; year: number } | null {
  const match = dayName.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return null;
  return {
    day: parseInt(match[1]),
    month: parseInt(match[2]),
    year: parseInt(match[3]),
  };
}

/** Build a Vietnam-local Date object from event date + time "HH:MM" */
function buildVNDate(dayName: string, time: string): Date | null {
  const parsed = parseDayDate(dayName);
  if (!parsed) return null;
  const [hh, mm] = time.split(":").map(Number);
  if (isNaN(hh) || isNaN(mm)) return null;
  // Vietnam is UTC+7
  return new Date(
    Date.UTC(parsed.year, parsed.month - 1, parsed.day, hh - 7, mm),
  );
}

/** Convert a datetime-local string "YYYY-MM-DDTHH:MM" (treated as VN/UTC+7) to UTC Date */
function mockVNStringToDate(s: string): Date {
  const [datePart, timePart] = s.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, m] = timePart.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h - 7, m));
}

/** Determine status of each event across all days, given a reference 'now' */
function computeStatuses(
  days: ItineraryDay[],
  now: Date,
): Map<string, EventStatus> {
  const flat: { id: string; date: Date | null }[] = [];

  for (const day of days) {
    for (const ev of day.events) {
      flat.push({ id: ev.id, date: buildVNDate(day.dayName, ev.time) });
    }
  }

  const result = new Map<string, EventStatus>();

  for (let i = 0; i < flat.length; i++) {
    const cur = flat[i];
    const next = flat[i + 1];

    if (!cur.date) {
      result.set(cur.id, "future");
      continue;
    }
    if (cur.date > now) {
      result.set(cur.id, "future");
      continue;
    }

    // cur.date <= now
    const nextDate = next?.date ?? null;
    if (nextDate && nextDate <= now) {
      result.set(cur.id, "past");
    } else {
      result.set(cur.id, "active");
    }
  }

  return result;
}

function EventCard({
  event,
  isLast,
  status,
}: {
  event: ItineraryEvent;
  isLast: boolean;
  status: EventStatus;
}) {
  const [expanded, setExpanded] = useState(false);
  const cat =
    CATEGORY_CONFIG[event.category as ItineraryCategory] ||
    CATEGORY_CONFIG.travel;

  const isPast = status === "past";
  const isActive = status === "active";

  return (
    <div className="relative flex gap-4">
      {/* Timeline dot column */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div className="relative flex-shrink-0 w-9 h-9">
          {/* Pulse rings – only for active */}
          {isActive && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-rose-400" />
              <span className="absolute -inset-1.5 rounded-full animate-pulse opacity-20 bg-rose-300" />
            </>
          )}
          <div
            className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 shadow-md transition-all duration-300
              ${
                isPast
                  ? "bg-gray-100 border-gray-200"
                  : isActive
                    ? `${cat.bg} ${cat.border} ring-2 ring-offset-2 ring-rose-300 shadow-rose-200 shadow-lg`
                    : `${cat.bg} ${cat.border}`
              }`}
          >
            {isPast ? (
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            ) : (
              <span className={isActive ? cat.color : cat.color}>
                {cat.icon}
              </span>
            )}
          </div>
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className={`w-px flex-1 mt-1 mb-1 min-h-[2rem] transition-colors duration-500 ${
              isPast
                ? "bg-gray-200"
                : "bg-gradient-to-b from-rose-200 to-rose-100"
            }`}
          />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-4 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300
          ${
            isPast
              ? "bg-gray-50 border-gray-200 opacity-60"
              : isActive
                ? `${cat.bg} ${cat.border} shadow-md ring-1 ring-rose-200`
                : `${cat.bg} ${cat.border}`
          }`}
      >
        {/* Active badge */}
        {isActive && (
          <div className="flex items-center gap-1.5 px-4 pt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
              Đang diễn ra
            </span>
          </div>
        )}

        {/* Header button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-4 py-3 flex items-start gap-3 group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border
                  ${isPast ? "bg-gray-100 text-gray-400 border-gray-200" : `${cat.bg} ${cat.color} ${cat.border}`}`}
              >
                {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : cat.icon}
                {cat.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock
                className={`w-3.5 h-3.5 flex-shrink-0 ${isPast ? "text-gray-400" : "text-rose-400"}`}
              />
              <span
                className={`font-bold text-sm ${isPast ? "text-gray-400" : "text-rose-600"}`}
              >
                {event.time}
              </span>
            </div>
            <h3
              className={`font-semibold text-sm leading-snug mt-1 pr-4 ${isPast ? "text-gray-400" : "text-gray-800"}`}
            >
              {event.title}
            </h3>
            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all hover:shadow-sm
                  ${
                    isPast
                      ? "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200"
                      : `${cat.bg} ${cat.color} ${cat.border} hover:brightness-95`
                  }`}
              >
                <Navigation className="w-3 h-3" />
                Xem bản đồ
              </a>
            )}
          </div>
          <div
            className={`mt-1 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${isPast ? "text-gray-300" : cat.color}`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {/* Expandable description */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-white/60">
            <p
              className={`text-sm mt-3 leading-relaxed ${isPast ? "text-gray-400" : "text-gray-600"}`}
            >
              {event.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-50 to-fuchsia-50 border-b border-rose-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-400 flex items-center justify-center shadow-md">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Liên hệ</h2>
              <p className="text-xs text-gray-500">Danh sách người liên lạc</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contact list */}
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-[3rem_1fr_1fr] bg-gray-50 border-b border-gray-200">
            <div className="px-3 py-3 font-semibold text-sm text-gray-700 text-center">
              STT
            </div>
            <div className="px-4 py-3 font-semibold text-sm text-gray-700">
              Tên
            </div>
            <div className="px-4 py-3 font-semibold text-sm text-gray-700">
              Số điện thoại
            </div>
          </div>
          {CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[3rem_1fr_1fr] hover:bg-gray-50 transition-colors"
            >
              <div className="px-3 py-3 text-sm text-gray-400 text-center tabular-nums">
                {idx + 1}
              </div>
              <div className="px-4 py-3 text-sm text-gray-800 font-medium">
                {contact.name}
              </div>
              <div className="px-4 py-3 text-sm">
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-rose-600 font-semibold hover:text-rose-700 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DaySection({
  day,
  isOpen,
  onClick,
  statuses,
}: {
  day: ItineraryDay;
  isOpen: boolean;
  onClick: () => void;
  statuses: Map<string, EventStatus>;
}) {
  const dayColors = {
    "day-1": {
      accent: "from-sky-400 to-rose-400",
      pill: "bg-sky-100 text-sky-700 border-sky-200",
    },
    "day-2": {
      accent: "from-rose-400 to-fuchsia-400",
      pill: "bg-rose-100 text-rose-700 border-rose-200",
    },
  };
  const colors =
    dayColors[day.id as keyof typeof dayColors] || dayColors["day-1"];

  const hasActiveEvent = day.events.some(
    (ev) => statuses.get(ev.id) === "active",
  );
  const allPast = day.events.every((ev) => statuses.get(ev.id) === "past");

  return (
    <div
      className={`rounded-3xl border-2 overflow-hidden transition-all duration-300
        ${isOpen ? "border-rose-200 shadow-lg" : "border-gray-100 shadow-sm"}
        ${allPast ? "opacity-75" : ""}`}
    >
      {/* Day header */}
      <button
        onClick={onClick}
        className="w-full text-left bg-white px-5 py-4 flex items-center justify-between group hover:bg-rose-50/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`relative w-10 h-10 rounded-2xl bg-gradient-to-br ${colors.accent} flex items-center justify-center shadow-md`}
          >
            {hasActiveEvent && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colors.pill}`}
              >
                {day.dayLabel}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {day.dayName}
              </span>
              {hasActiveEvent && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                  Hôm nay
                </span>
              )}
            </div>
            <p
              className={`font-bold text-sm mt-0.5 ${allPast ? "text-gray-400" : "text-gray-800"}`}
            >
              {day.theme}
            </p>
          </div>
        </div>
        <div
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {/* Events list */}
      {isOpen && (
        <div className="bg-gradient-to-b from-rose-50/30 to-white px-4 pt-4 pb-2">
          {day.events.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              isLast={idx === day.events.length - 1}
              status={statuses.get(event.id) ?? "future"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LichTrinhPage() {
  const itinerary = itineraryCongTy;
  const couple = weddingData.couple;
  const searchParams = useSearchParams();
  const isDebug = searchParams.get("debug") === "1";

  // Loading state (false mặc định vì dữ liệu tĩnh đã có sẵn trong source)
  const [isLoading, setIsLoading] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  // Dynamic days state synced with Google Sheets
  const [days, setDays] = useState<ItineraryDay[]>(
    () => itinerary.days as ItineraryDay[],
  );

  useEffect(() => {
    const applyByDay = (byDay: Record<string, ItineraryEvent[]>) =>
      setDays((prev) =>
        prev.map((day) => ({
          ...day,
          events: byDay[day.id] ?? day.events,
        })),
      );

    const fetchSheetItinerary = async () => {
      const url = weddingData.appsheetWebhookUrl;
      const forceRefresh = searchParams.get("refresh") === "1";
      const cacheAllowed = isCacheAllowed();

      // Nếu đang ngoài thời gian cho phép (trước 09/10 hoặc sau 10/10/2026 giờ VN),
      // tự động xoá cache đã lưu của những user từng truy cập trước đó
      if (!cacheAllowed) {
        try {
          localStorage.removeItem(ITINERARY_CACHE_KEY);
        } catch {
          // ignore
        }
      }

      try {
        if (!forceRefresh && cacheAllowed) {
          try {
            const raw = localStorage.getItem(ITINERARY_CACHE_KEY);
            if (raw) {
              const cached = JSON.parse(raw) as {
                ts: number;
                byDay: Record<string, ItineraryEvent[]>;
              };
              if (Date.now() - cached.ts < ITINERARY_CACHE_TTL_MS) {
                applyByDay(cached.byDay);
                return;
              }
            }
          } catch {
            // ignore corrupt/unavailable cache
          }
        }

        if (url) {
          const res = await fetch(`${url}?action=lich_trinh_cong_ty`);
          const json = await res.json();
          if (
            json?.status === "success" &&
            Array.isArray(json.data) &&
            json.data.length > 0
          ) {
            const byDay: Record<string, ItineraryEvent[]> = {};
            json.data.forEach((row: Record<string, string>) => {
              if (!byDay[row.dayId]) byDay[row.dayId] = [];
              byDay[row.dayId].push({
                id: row.id,
                time: row.time,
                title: row.title,
                description: row.description,
                mapUrl: row.mapUrl,
                category: row.category as ItineraryCategory,
              });
            });
            applyByDay(byDay);

            if (cacheAllowed) {
              try {
                localStorage.setItem(
                  ITINERARY_CACHE_KEY,
                  JSON.stringify({ ts: Date.now(), byDay }),
                );
              } catch {
                // storage full/unavailable
              }
            }
          }
        }
      } catch (e) {
        console.warn("Could not fetch sheet itinerary:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSheetItinerary();
  }, [searchParams]);

  // Debug: mock time override (stored as VN local string "YYYY-MM-DDTHH:MM")
  const [mockTime, setMockTime] = useState<string>("");

  // Real clock – ticks every minute
  const [realNow, setRealNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setRealNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  // Effective "now": mock if set, else real
  const now = useMemo(
    () => (isDebug && mockTime ? mockVNStringToDate(mockTime) : realNow),
    [isDebug, mockTime, realNow],
  );

  const statuses = useMemo(() => computeStatuses(days, now), [now, days]);

  // Auto-open the day that has the active event (or day-1 by default)
  const defaultOpen = useMemo<Record<string, boolean>>(() => {
    const obj: Record<string, boolean> = {};
    let foundActive = false;
    for (const day of days) {
      const hasActive = day.events.some(
        (ev) => statuses.get(ev.id) === "active",
      );
      if (hasActive) {
        obj[day.id] = true;
        foundActive = true;
      } else {
        obj[day.id] = false;
      }
    }
    if (!foundActive) obj["day-1"] = true;
    return obj;
  }, [statuses, days]);

  const [openDays, setOpenDays] =
    useState<Record<string, boolean>>(defaultOpen);

  useEffect(() => {
    setOpenDays((prev) => {
      const anyOpen = Object.values(prev).some(Boolean);
      if (!anyOpen) return defaultOpen;
      return prev;
    });
  }, [defaultOpen]);

  const toggleDay = (dayId: string) =>
    setOpenDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));

  const totalEvents = days.reduce(
    (sum, d) => sum + d.events.length,
    0,
  );

  // Show loading screen while fetching data
  if (isLoading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; background: #fdf8f6; }
          .hero-bg { background: linear-gradient(135deg, #fff1f2 0%, #fce7f3 40%, #f3e8ff 70%, #eff6ff 100%); }
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            15% { transform: scale(1.15); }
            30% { transform: scale(1); }
            45% { transform: scale(1.1); }
          }
          .heartbeat { animation: heartbeat 1.4s ease-in-out infinite; }
        `}</style>
        <div className="hero-bg min-h-screen w-full flex items-center justify-center relative overflow-hidden px-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-200/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="relative z-10 text-center max-w-xs">
            <div className="heartbeat inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-400 shadow-lg shadow-rose-200 mb-5">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className="playfair text-2xl font-bold text-rose-800 mb-2">
              Đang tải lịch trình...
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Vui lòng chờ trong giây lát để cập nhật thông tin mới nhất
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');

        body { font-family: 'Inter', sans-serif; background: #fdf8f6; }

        .hero-bg {
          background: linear-gradient(135deg, #fff1f2 0%, #fce7f3 40%, #f3e8ff 70%, #eff6ff 100%);
        }

        .glass-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.7);
        }

        .playfair { font-family: 'Playfair Display', serif; }

        .stat-card {
          background: linear-gradient(135deg, #fff5f5, #fff0f5);
          border: 1px solid #fecdd3;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .float-anim { animation: float 3s ease-in-out infinite; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fade-in-up 0.6s ease forwards; }
      `}</style>

      <main className="min-h-screen" style={{ background: "#fdf8f6" }}>
        {/* Hero Section */}
        <div className="hero-bg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-200/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-10">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-rose-500 text-sm font-medium hover:text-rose-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Trang chủ
              </Link>
              <button
                onClick={() => setShowContacts(true)}
                className="inline-flex items-center gap-1.5 text-rose-500 text-sm font-medium hover:text-rose-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Liên hệ
              </button>
            </div>

            <div className="text-center fade-in-up">
              <div className="float-anim inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-400 shadow-lg shadow-rose-200 mb-4">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>

              <h1 className="playfair text-3xl font-bold text-rose-800 mb-1">
                {itinerary.title}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                {itinerary.subtitle}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 border border-rose-200 shadow-sm">
                <span className="text-rose-700 font-bold text-sm">
                  {couple.groom.name}
                </span>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span className="text-rose-700 font-bold text-sm">
                  {couple.bride.name}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="stat-card rounded-2xl p-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-rose-600">
                  {days.length}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Ngày</div>
              </div>
              <div className="stat-card rounded-2xl p-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-rose-600">
                  {days.reduce((sum, d) => sum + d.events.length, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Hoạt động</div>
              </div>
              <div className="stat-card rounded-2xl p-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-rose-600">~400</div>
                <div className="text-xs text-gray-500 mt-0.5">km</div>
              </div>
            </div>
          </div>
        </div>

        {/* VN Clock bar */}
        <div className="max-w-md mx-auto px-4 -mt-4 z-20 relative space-y-2">
          {/* ── DEBUG PANEL (only at ?debug=1) ── */}
          {isDebug && (
            <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  🧪 Debug Mode
                </span>
                <span className="text-[10px] text-amber-500">
                  Mock thời gian VN để test trạng thái
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={mockTime}
                  onChange={(e) => setMockTime(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-amber-300 bg-white text-gray-700 focus:outline-none focus:border-amber-500"
                />
                {mockTime && (
                  <button
                    onClick={() => setMockTime("")}
                    className="text-xs px-2 py-1.5 rounded-lg bg-amber-200 text-amber-800 font-semibold hover:bg-amber-300 transition-colors whitespace-nowrap"
                  >
                    ✕ Reset
                  </button>
                )}
              </div>
              {/* Quick-jump buttons per event */}
              <div className="flex flex-wrap gap-1.5">
                {days.flatMap((day) =>
                  day.events.map((ev) => {
                    const parsed = parseDayDate(day.dayName);
                    if (!parsed) return null;
                    const pad = (n: number) => String(n).padStart(2, "0");
                    const iso = `${parsed.year}-${pad(parsed.month)}-${pad(parsed.day)}T${ev.time}`;
                    const isSet = mockTime === iso;
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setMockTime(iso)}
                        title={ev.title}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors whitespace-nowrap ${
                          isSet
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"
                        }`}
                      >
                        {day.dayLabel} {ev.time}
                      </button>
                    );
                  }),
                )}
              </div>
              <p className="text-[10px] text-amber-500 leading-relaxed">
                Nhấn nút giờ để nhảy đến thời điểm đó và xem trạng thái
                past/active/future.
              </p>
            </div>
          )}

          <LiveClock isMock={isDebug && !!mockTime} />

          {/* Nút liên hệ */}
          <button
            onClick={() => setShowContacts(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md hover:from-rose-600 hover:to-fuchsia-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>
              Liên hệ điều phối & đoàn xe ({CONTACTS.length} số liên lạc)
            </span>
          </button>

          {/* Category legend */}
          <div className="glass-card rounded-2xl border border-white/80 shadow-md p-3">
            <div className="flex flex-wrap gap-2 justify-center">
              {(
                Object.entries(CATEGORY_CONFIG) as [
                  ItineraryCategory,
                  typeof CATEGORY_CONFIG.travel,
                ][]
              ).map(([key, cat]) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}
                >
                  {cat.icon}
                  {cat.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Itinerary Days */}
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {days.map((day) => (
            <DaySection
              key={day.id}
              day={day as ItineraryDay}
              isOpen={!!openDays[day.id]}
              onClick={() => toggleDay(day.id)}
              statuses={statuses}
            />
          ))}

          {/* Footer note */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-rose-50 to-fuchsia-50 border border-rose-100 p-4 text-center">
            <MapPin className="w-5 h-5 text-rose-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm leading-relaxed">
              Nhấn vào từng hoạt động để xem chi tiết.
            </p>
            <p className="text-rose-500 font-semibold text-xs mt-2">
              💕 Cảm ơn bạn đã cùng đồng hành trong hành trình ý nghĩa này!
            </p>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContacts}
        onClose={() => setShowContacts(false)}
      />
    </>
  );
}

import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense>
      <LichTrinhPage />
    </Suspense>
  );
}
