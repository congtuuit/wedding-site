"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Users,
  Sparkles,
  Download,
  Share2,
  FileSpreadsheet,
  Trash2,
  ArrowLeft,
  Mail,
  Heart,
  Search,
  RefreshCw,
  MapPin,
  Clock,
  Car,
  UtensilsCrossed,
  BedDouble,
  Church,
  PartyPopper,
  Save,
  RotateCcw,
  Navigation,
  CalendarDays,
  Pencil,
  X,
} from "lucide-react";
import { encodeGuestName } from "@/lib/utils";
import { getActiveWeddingStage } from "@/lib/wedding-timeline";
import weddingDataJson from "@/data/wedding.json";

interface GeneratedItem {
  id: string;
  name: string;
  link: string;
  createdAt: string;
}

const STORAGE_KEY = "wedding_custom_links_history";
const WEBHOOK_URL = weddingDataJson.appsheetWebhookUrl || "";

// ─── Itinerary Types ───────────────────────────────────────────────────────
type ItinCategory = "travel" | "meal" | "rest" | "ceremony" | "party";

interface ItinEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  mapUrl: string;
  category: ItinCategory;
}

interface ItinDay {
  id: string;
  dayLabel: string;
  dayName: string;
  theme: string;
  events: ItinEvent[];
}

const ITIN_CAT_CONFIG: Record<ItinCategory, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  travel:   { icon: <Car className="w-3.5 h-3.5" />,           label: "Di chuyển",  color: "text-sky-700",     bg: "bg-sky-50" },
  meal:     { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, label: "Ăn uống",   color: "text-amber-700",   bg: "bg-amber-50" },
  rest:     { icon: <BedDouble className="w-3.5 h-3.5" />,      label: "Nghỉ ngơi", color: "text-violet-700",  bg: "bg-violet-50" },
  ceremony: { icon: <Church className="w-3.5 h-3.5" />,         label: "Nghi lễ",   color: "text-rose-700",    bg: "bg-rose-50" },
  party:    { icon: <PartyPopper className="w-3.5 h-3.5" />,    label: "Tiệc tùng", color: "text-fuchsia-700", bg: "bg-fuchsia-50" },
};
// ───────────────────────────────────────────────────────────────────────────

export default function SharePage() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk" | "history" | "itinerary">("single");
  const [baseUrl, setBaseUrl] = useState<string>("");

  // Itinerary state
  const [itinDays, setItinDays] = useState<ItinDay[]>(() => {
    const raw = weddingDataJson.itinerary?.days as ItinDay[] | undefined;
    return raw ? JSON.parse(JSON.stringify(raw)) : [];
  });
  const [itinDirty, setItinDirty] = useState(false);
  const [itinSaving, setItinSaving] = useState(false);
  const [itinSaved, setItinSaved] = useState(false);
  const [itinLoading, setItinLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<ItinEvent>>({});

  // Event targeting state
  const [eventTarget, setEventTarget] = useState<"auto" | "que" | "sg">("auto");

  // Single mode state
  const [guestName, setGuestName] = useState<string>("");
  const [linkType, setLinkType] = useState<"plain" | "base64">("base64");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);
  const [showQr, setShowQr] = useState<boolean>(false);

  // Bulk mode state
  const [bulkInput, setBulkInput] = useState<string>("");
  const [bulkResults, setBulkResults] = useState<GeneratedItem[]>([]);
  const [bulkCopiedIdx, setBulkCopiedIdx] = useState<number | null>(null);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<GeneratedItem[]>([]);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [historyCopiedIdx, setHistoryCopiedIdx] = useState<number | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Quick prefix suggestions
  const PREFIXES = ["Bạn", "Anh", "Chị", "Em", "Gia đình Bác", "Gia đình Chú", "Gia đình Cô", "Vợ chồng Bạn"];

  // Fetch history from Google Sheets and localStorage
  const loadHistory = async () => {
    // 1. Load from local storage first
    let localItems: GeneratedItem[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        localItems = JSON.parse(saved);
        setHistory(localItems);
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from Google Sheet
    if (WEBHOOK_URL && WEBHOOK_URL.startsWith("http")) {
      setIsLoadingHistory(true);
      try {
        const res = await fetch(`${WEBHOOK_URL}?action=guests`);
        const json = await res.json();
        if (json && json.status === "success" && Array.isArray(json.data)) {
          const sheetItems: GeneratedItem[] = json.data;
          const combined = [...sheetItems, ...localItems];
          const unique = Array.from(
            new Map(combined.map((item) => [item.name.toLowerCase().trim(), item])).values()
          );
          setHistory(unique);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(unique.slice(0, 200)));
        }
      } catch (err) {
        console.warn("Could not sync with Google Sheet history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
      loadHistory();
    }
  }, []);

  const saveToHistoryAndSheet = (item: GeneratedItem) => {
    // 1. Update UI & LocalStorage
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.name.toLowerCase().trim() !== item.name.toLowerCase().trim());
      const updated = [item, ...filtered];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 200)));
      }
      return updated;
    });

    // 2. Sync to Google Sheets (tab Danh_Sach_Khach_Moi)
    if (WEBHOOK_URL && WEBHOOK_URL.startsWith("http") && item.name.trim()) {
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          type: "GUEST_LINK",
          name: item.name.trim(),
          link: item.link,
          createdAt: item.createdAt,
        }),
      }).catch((err) => console.warn("Google Sheet sync failed:", err));
    }
  };

  // Get active stage for preview & message templates
  const previewStage = useMemo(() => {
    return getActiveWeddingStage(eventTarget !== "auto" ? eventTarget : undefined);
  }, [eventTarget]);

  // Generate single link
  const currentLink = useMemo(() => {
    if (!baseUrl) return "";
    const trimmed = guestName.trim();
    const eventQueryParam = eventTarget !== "auto" ? `&event=${eventTarget}` : "";

    if (!trimmed) {
      return eventTarget !== "auto" ? `${baseUrl}/?event=${eventTarget}` : baseUrl;
    }

    if (linkType === "base64") {
      return `${baseUrl}/?to=${encodeGuestName(trimmed)}${eventQueryParam}`;
    }
    return `${baseUrl}/?to=${encodeURIComponent(trimmed)}${eventQueryParam}`;
  }, [baseUrl, guestName, linkType, eventTarget]);

  // Message templates
  const messageTemplates = useMemo(() => {
    const name = guestName.trim() || "Bạn";
    const isNhaGai = previewStage.stageKey === "que";

    if (isNhaGai) {
      return [
        {
          title: "Mẫu Thân Mật (Lễ Vu Quy — Nhà Gái)",
          body: `Thân gửi ${name},\n\nHường & Tú rất vui mừng được trân trọng gửi lời mời đến ${name} tới chung vui trong buổi Lễ Vu Quy & Tiệc Cưới tại nhà gái vào ngày ${previewStage.weddingDateFormatted}.\n\nThời gian: Thứ Bảy, 10 Tháng 10 Năm 2026 (09:00 Lễ Gia Tiên - 11:30 Khai Tiệc)\nĐịa điểm: Tư Gia Nhà Gái, Cát Tiên 3, Lâm Đồng.\n\nSự hiện diện của ${name} là niềm hạnh phúc to lớn đối với chúng mình!\n\nXem thiệp mời chi tiết tại đây:\n${currentLink}\n\nTrân trọng & Yêu thương!`,
        },
        {
          title: "Mẫu Trang Trọng (Người lớn, gia đình, họ hàng)",
          body: `Kính gửi ${name},\n\nGia đình chúng tôi trân trọng kính mời ${name} cùng gia đình tới dự buổi tiệc mừng Lễ Vu Quy của hai cháu Hường Nguyễn & Tú Văn.\n\nThời gian: Thứ Bảy, 10 Tháng 10 Năm 2026\nĐịa điểm: Tư Gia Nhà Gái, Cát Tiên 3, Lâm Đồng.\n\nKính mời xem thiệp cưới trực tuyến tại:\n${currentLink}\n\nRất hân hạnh được đón tiếp!`,
        },
        {
          title: "Mẫu Ngắn Gọn (Gửi Zalo / Messenger)",
          body: `Mời ${name} cùng người thương tới chung vui Lễ Vu Quy của Hường Nguyễn & Tú Văn ngày 10.10.2026 tại Lâm Đồng nhé!\nXem thiệp cưới tại: ${currentLink}`,
        },
      ];
    }

    return [
      {
        title: "Mẫu Thân Mật (Lễ Tân Hôn — Nhà Trai)",
        body: `Thân gửi ${name},\n\nTú & Hường rất vui mừng được trân trọng gửi lời mời đến ${name} tới chung vui trong ngày trọng đại Lễ Tân Hôn của chúng mình vào ngày ${previewStage.weddingDateFormatted}.\n\nThời gian: Thứ Bảy, 12 Tháng 12 Năm 2026 (18:00 Đón Khách - 19:00 Khai Tiệc)\nĐịa điểm: The ADORA Center, 431 Đ. Hoàng Văn Thụ, Tân Bình, TP.HCM.\n\nSự hiện diện của ${name} là niềm hạnh phúc to lớn đối với chúng mình!\n\nXem thiệp mời chi tiết tại đây:\n${currentLink}\n\nTrân trọng & Yêu thương!`,
      },
      {
        title: "Mẫu Trang Trọng (Người lớn, gia đình, đối tác)",
        body: `Kính gửi ${name},\n\nGia đình chúng tôi trân trọng kính mời ${name} cùng gia đình tới dự buổi tiệc mừng Lễ Tân Hôn của hai cháu Tú Văn & Hường Nguyễn.\n\nThời gian: Thứ Bảy, 12 Tháng 12 Năm 2026\nĐịa điểm: The ADORA Center, 431 Đ. Hoàng Văn Thụ, Tân Bình, TP.HCM.\n\nKính mời xem thiệp cưới trực tuyến tại:\n${currentLink}\n\nRất hân hạnh được đón tiếp!`,
      },
      {
        title: "Mẫu Ngắn Gọn (Gửi Zalo / Messenger)",
        body: `Mời ${name} cùng người thương tới chung vui Lễ Tân Hôn của Tú Văn & Hường Nguyễn ngày 12.12.2026 tại TP.HCM nhé!\nXem thiệp cưới tại: ${currentLink}`,
      },
    ];
  }, [guestName, currentLink, previewStage]);

  // Handlers
  const handleCopyLink = async (linkToCopy = currentLink) => {
    if (!linkToCopy) return;
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopiedLink(true);
      if (guestName.trim()) {
        saveToHistoryAndSheet({
          id: `link-${Date.now()}`,
          name: guestName.trim(),
          link: linkToCopy,
          createdAt: new Date().toISOString(),
        });
      }
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyTemplate = async (templateText: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(templateText);
      setCopiedTemplateIdx(idx);
      if (guestName.trim()) {
        saveToHistoryAndSheet({
          id: `link-${Date.now()}`,
          name: guestName.trim(),
          link: currentLink,
          createdAt: new Date().toISOString(),
        });
      }
      setTimeout(() => setCopiedTemplateIdx(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Bulk Generation
  const handleGenerateBulk = async () => {
    if (!bulkInput.trim() || !baseUrl) return;
    const lines = bulkInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const eventQueryParam = eventTarget !== "auto" ? `&event=${eventTarget}` : "";

    const generated: GeneratedItem[] = lines.map((name, idx) => {
      const link =
        linkType === "base64"
          ? `${baseUrl}/?to=${encodeGuestName(name)}${eventQueryParam}`
          : `${baseUrl}/?to=${encodeURIComponent(name)}${eventQueryParam}`;
      return {
        id: `bulk-${Date.now()}-${idx}`,
        name,
        link,
        createdAt: new Date().toISOString(),
      };
    });

    setBulkResults(generated);

    // Save to history & LocalStorage
    setHistory((prev) => {
      const combined = [...generated, ...prev];
      const unique = Array.from(
        new Map(combined.map((item) => [item.name.toLowerCase().trim(), item])).values()
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unique.slice(0, 200)));
      }
      return unique;
    });

    // Save batch to Google Sheets
    if (WEBHOOK_URL && WEBHOOK_URL.startsWith("http")) {
      setIsSubmittingBulk(true);
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            type: "BULK_GUEST_LINKS",
            guests: generated,
          }),
        });
      } catch (err) {
        console.warn("Bulk sync to Google Sheets error:", err);
      } finally {
        setIsSubmittingBulk(false);
      }
    }
  };

  const handleExportCSV = () => {
    if (bulkResults.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      "STT,Ten Khach Moi,Link Thiep Cuoi\n" +
      bulkResults.map((r, i) => `${i + 1},"${r.name}","${r.link}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Danh_Sach_Thiep_Cuoi_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch sử trên trình duyệt này?")) {
      setHistory([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  // Filtered History
  const filteredHistory = history.filter((h) =>
    h.name.toLowerCase().includes(historySearch.toLowerCase().trim())
  );

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=8C1425&bgcolor=FAF7F2&data=${encodeURIComponent(
    currentLink
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#280E12] font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E8DCDD] px-4 py-3.5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#8C1425] hover:text-[#8C1425]/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem Trang Thiệp Cưới</span>
          </Link>
          <div className="text-center">
            <span className="font-couple text-xl text-[#8C1425]">{previewStage.primaryCoupleName}</span>
          </div>
          <div className="w-28 text-right flex items-center justify-end gap-1.5">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sheet Sync</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Hero */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#8C1425]/10 text-[#8C1425] mb-1">
            <Share2 className="w-5 h-5" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl text-[#280E12] font-normal tracking-wide">
            Tạo Link Thiệp Cưới Cá Nhân Hóa
          </h1>
          <p className="text-xs sm:text-sm text-[#6B4E53] max-w-lg mx-auto leading-relaxed">
            Nhập tên người nhận để tạo đường link và lời mời mang tên riêng. Tất cả link tạo ra sẽ được{" "}
            <strong>tự động đồng bộ và lưu trữ vào Google Sheets (Tab: Danh_Sach_Khach_Moi)</strong>.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 p-1.5 max-w-md mx-auto rounded-2xl bg-white border border-[#E8DCDD] shadow-sm mb-8">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "single"
                ? "bg-[#8C1425] text-white shadow-sm"
                : "text-[#6B4E53] hover:text-[#280E12] hover:bg-[#FAF7F2]"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Tạo Từng Người</span>
          </button>

          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "bulk"
                ? "bg-[#8C1425] text-white shadow-sm"
                : "text-[#6B4E53] hover:text-[#280E12] hover:bg-[#FAF7F2]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tạo Hàng Loạt</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === "history"
                ? "bg-[#8C1425] text-white shadow-sm"
                : "text-[#6B4E53] hover:text-[#280E12] hover:bg-[#FAF7F2]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lịch Sử ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === "itinerary"
                ? "bg-[#8C1425] text-white shadow-sm"
                : "text-[#6B4E53] hover:text-[#280E12] hover:bg-[#FAF7F2]"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Lịch Trình</span>
          </button>
        </div>

        {/* TAB 1: SINGLE LINK GENERATOR */}
        {activeTab === "single" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DCDD] shadow-sm space-y-6">
              {/* Input Form */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6B4E53]">
                  1. Nhập Tên Khách Mời / Người Nhận
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ví dụ: Anh Hoàng, Gia đình Bác Thành, Bạn Linh..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DCDD] focus:border-[#8C1425] focus:ring-2 focus:ring-[#8C1425]/20 outline-none text-sm sm:text-base text-[#280E12] font-medium"
                    autoFocus
                  />
                  {guestName && (
                    <button
                      onClick={() => setGuestName("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6B4E53] hover:text-[#280E12] bg-[#E8DCDD]/60 hover:bg-[#E8DCDD] w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-[#6B4E53] mr-1">Gợi ý xưng hô:</span>
                  {PREFIXES.map((prefix) => (
                    <button
                      key={prefix}
                      onClick={() => {
                        if (!guestName.startsWith(prefix)) {
                          setGuestName(`${prefix} `);
                        }
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DCDD] hover:border-[#8C1425] text-[#6B4E53] hover:text-[#8C1425] transition-colors"
                    >
                      {prefix}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Target Selector Option */}
              <div className="pt-2 space-y-2 border-t border-[#E8DCDD]/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#6B4E53] uppercase tracking-wider text-[11px]">
                    2. Chọn Sự Kiện Mời Cho Khách
                  </span>
                  <span className="text-[11px] text-[#8C1425] font-medium">
                    {eventTarget === "auto"
                      ? `Tự động theo ngày (Hiện tại: ${previewStage.ceremonyName})`
                      : eventTarget === "que"
                      ? "Chỉ định: Lễ Vu Quy (Nhà Gái)"
                      : "Chỉ định: Lễ Tân Hôn (Nhà Trai)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEventTarget("auto")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      eventTarget === "auto"
                        ? "bg-[#8C1425]/10 border-[#8C1425] text-[#8C1425] font-semibold shadow-xs"
                        : "bg-[#FAF7F2] border-[#E8DCDD] text-[#6B4E53] hover:border-[#8C1425]/40"
                    }`}
                  >
                    <div className="font-semibold">⏱️ Tự Động (Thông minh)</div>
                    <div className="text-[10px] text-[#6B4E53] mt-0.5">
                      Trước 10.10 là Vu Quy, sau 10.10 là Tân Hôn
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEventTarget("que")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      eventTarget === "que"
                        ? "bg-[#8C1425]/10 border-[#8C1425] text-[#8C1425] font-semibold shadow-xs"
                        : "bg-[#FAF7F2] border-[#E8DCDD] text-[#6B4E53] hover:border-[#8C1425]/40"
                    }`}
                  >
                    <div className="font-semibold">🌸 Nhà Gái (10.10.2026)</div>
                    <div className="text-[10px] text-[#6B4E53] mt-0.5">
                      Lễ Vu Quy & Tiệc Cưới Lâm Đồng
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEventTarget("sg")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      eventTarget === "sg"
                        ? "bg-[#8C1425]/10 border-[#8C1425] text-[#8C1425] font-semibold shadow-xs"
                        : "bg-[#FAF7F2] border-[#E8DCDD] text-[#6B4E53] hover:border-[#8C1425]/40"
                    }`}
                  >
                    <div className="font-semibold">🏰 Nhà Trai (12.12.2026)</div>
                    <div className="text-[10px] text-[#6B4E53] mt-0.5">
                      Lễ Tân Hôn The ADORA TP.HCM
                    </div>
                  </button>
                </div>
              </div>

              {/* Link Type Option */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#E8DCDD]/60">
                <span className="font-medium text-[#6B4E53]">Kiểu hiển thị đường link:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="linkType"
                      checked={linkType === "plain"}
                      onChange={() => setLinkType("plain")}
                      className="accent-[#8C1425]"
                    />
                    <span>Chữ tiếng Việt rõ nghĩa (?to=Anh%20Hoàng)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="linkType"
                      checked={linkType === "base64"}
                      onChange={() => setLinkType("base64")}
                      className="accent-[#8C1425]"
                    />
                    <span>Mã hóa Base64 (?to=QW5o...)</span>
                  </label>
                </div>
              </div>

              {/* Output Result Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DCDD] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#8C1425] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Đường Link Chia Sẻ Của Bạn</span>
                  </span>
                  {guestName.trim() && (
                    <span className="text-[11px] text-[#D4AF37] font-medium font-sans">
                      ✦ Đã cá nhân hóa cho: <strong>{guestName.trim()}</strong>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentLink}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DCDD] text-xs font-mono text-[#280E12] select-all outline-none truncate"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyLink()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8C1425] text-white text-xs font-semibold tracking-wide hover:bg-[#8C1425]/90 transition-all active:scale-95 shadow-sm"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "Đã Lưu & Sao Chép!" : "Sao Chép & Lưu Link"}</span>
                    </button>

                    <a
                      href={currentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-[#E8DCDD] text-[#8C1425] hover:bg-[#FAF7F2] transition-colors"
                      title="Mở xem thử thiệp mời"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => setShowQr(!showQr)}
                      className={`inline-flex items-center justify-center p-2.5 rounded-xl border transition-colors ${
                        showQr
                          ? "bg-[#8C1425] text-white border-[#8C1425]"
                          : "bg-white border-[#E8DCDD] text-[#8C1425] hover:bg-[#FAF7F2]"
                      }`}
                      title="Hiện mã QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* QR Code Popup Box */}
                {showQr && (
                  <div className="p-4 rounded-2xl bg-white border border-[#E8DCDD] flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left mt-3">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code Thiệp Cưới"
                      className="w-36 h-36 rounded-xl border border-[#E8DCDD] shadow-sm bg-white p-1"
                    />
                    <div className="space-y-2">
                      <h4 className="font-heading text-sm font-semibold text-[#280E12]">
                        Mã QR Thiệp Mời: {guestName || "Khách Quý"}
                      </h4>
                      <p className="text-xs text-[#6B4E53] max-w-xs">
                        Quét mã này bằng Camera điện thoại hoặc Zalo để mở thẳng thiệp mời cá nhân hóa.
                      </p>
                      <a
                        href={qrCodeUrl}
                        download={`QR_ThiepCuoi_${guestName || "Khach"}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DCDD] text-xs text-[#8C1425] font-medium hover:bg-[#8C1425] hover:text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Ảnh QR Về Máy</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Envelope Preview Mockup */}
              <div className="p-5 rounded-2xl bg-[#FCECEE]/50 border border-[#8C1425]/15 space-y-2 text-center">
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#8C1425] font-semibold">
                  Xem trước dòng chữ trên phong bì thiệp
                </span>
                <div className="py-2">
                  <p className="text-xs font-sans text-[#6B4E53]">
                    {eventTarget === "que"
                      ? "Lễ Vu Quy (10.10.2026) — Thân gửi đến:"
                      : eventTarget === "sg"
                      ? "Lễ Tân Hôn (12.12.2026) — Thân gửi đến:"
                      : "Thân gửi đến:"}
                  </p>
                  <p className="font-couple text-2xl sm:text-3xl text-[#8C1425] pt-0.5">
                    {guestName.trim() || "Bạn & Người Thương"}
                  </p>
                </div>
                <p className="text-[11px] text-[#6B4E53]/80 italic">
                  (Khi khách mở link, tên này sẽ xuất hiện trang trọng trên phong bì thiệp cưới và tự động điền vào form)
                </p>
              </div>

              {/* Social Media Share Preview Mockup (Zalo / Facebook / Messenger) */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8DCDD] shadow-sm space-y-3 text-left">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-[11px] uppercase font-sans tracking-wider font-semibold text-[#8C1425] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Mô phỏng hiển thị khi dán link qua Zalo / Facebook / iMessage</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FCECEE] text-[#8C1425] font-medium border border-[#8C1425]/20">
                    Xem Trước Tin Nhắn
                  </span>
                </div>

                <a
                  href={currentLink || "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden border border-[#E2D4D6] bg-white shadow-sm hover:shadow-md hover:border-[#8C1425]/40 transition-all max-w-lg mx-auto group cursor-pointer"
                  title="Nhấp để mở thử liên kết thiệp mời này trong tab mới"
                >
                  <div className="relative aspect-[1200/630] w-full bg-[#150204] flex items-center justify-center overflow-hidden border-b border-[#E8DCDD]">
                    <img
                      src="/images/TOBI0530-og.jpg"
                      alt="Open Graph Preview Card"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase font-semibold text-[#8C1425] tracking-wider">
                        {baseUrl ? baseUrl.replace(/^https?:\/\//, "") : "tu-huong-wedding.vercel.app"}
                      </div>
                      <div className="text-[10px] text-[#8C1425] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-3 h-3" />
                        <span>Mở liên kết</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#280E12] line-clamp-1 group-hover:text-[#8C1425] transition-colors">
                      💌 Thân gửi: {guestName.trim() || "Bạn & Người Thương"} — {previewStage.invitationHeadline} {previewStage.primaryCoupleName}
                    </div>
                    <div className="text-[11px] text-[#6B4E53] line-clamp-2 leading-relaxed">
                      Trân trọng kính mời {guestName.trim() || "bạn"} đến chung vui trong ngày hạnh phúc của {previewStage.primaryCoupleName} vào ngày {previewStage.weddingDateFormatted} ({previewStage.ceremonyName} tại {previewStage.location}).
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Message Templates Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DCDD] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg text-[#280E12] font-semibold">
                    Mẫu Tin Nhắn Mời Thiệp (Kèm Link)
                  </h3>
                  <p className="text-xs text-[#6B4E53]">
                    Chọn và sao chép mẫu tin nhắn phù hợp để gửi nhanh qua Zalo, Messenger hoặc SMS
                  </p>
                </div>
                <Mail className="w-5 h-5 text-[#8C1425]" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {messageTemplates.map((tpl, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DCDD] hover:border-[#8C1425]/40 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-semibold text-[#8C1425]">
                        {tpl.title}
                      </span>
                      <button
                        onClick={() => handleCopyTemplate(tpl.body, idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8DCDD] text-xs font-semibold text-[#8C1425] hover:bg-[#8C1425] hover:text-white transition-all shadow-2xs active:scale-95"
                      >
                        {copiedTemplateIdx === idx ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedTemplateIdx === idx ? "Đã Sao Chép & Lưu!" : "Sao Chép Tin Nhắn"}</span>
                      </button>
                    </div>
                    <pre className="text-xs text-[#280E12] font-sans whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-[#E8DCDD]/70 select-all">
                      {tpl.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BULK LINK GENERATOR */}
        {activeTab === "bulk" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DCDD] shadow-sm space-y-5">
              <div>
                <h3 className="font-heading text-lg text-[#280E12] font-semibold">
                  Tạo Hàng Loạt Link Từ Danh Sách
                </h3>
                <p className="text-xs text-[#6B4E53]">
                  Dán danh sách tên khách mời (mỗi dòng một tên) để tạo link hàng loạt, tự động lưu vào Google Sheets và xuất file Excel
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6B4E53] mb-2">
                  Danh Sách Tên Khách Mời (Mỗi dòng 1 tên):
                </label>
                <textarea
                  rows={6}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`Anh Hoàng\nChị Mai\nGia đình Bác Thành\nBạn Thân Cấp 3\nEm Linh...`}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DCDD] focus:border-[#8C1425] focus:ring-2 focus:ring-[#8C1425]/20 outline-none text-sm text-[#280E12] font-mono leading-relaxed"
                />
              </div>

              {/* Event Target Selector for Bulk */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-[#6B4E53] uppercase tracking-wider text-[11px]">
                  Chọn sự kiện cho danh sách này:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEventTarget("auto")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      eventTarget === "auto"
                        ? "bg-[#8C1425]/10 border-[#8C1425] text-[#8C1425] font-semibold shadow-xs"
                        : "bg-[#FAF7F2] border-[#E8DCDD] text-[#6B4E53] hover:border-[#8C1425]/40"
                    }`}
                  >
                    <div className="font-semibold">⏱️ Tự Động</div>
                    <div className="text-[10px] text-[#6B4E53]">Theo ngày thực tế</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEventTarget("que")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      eventTarget === "que"
                        ? "bg-[#8C1425]/10 border-[#8C1425] text-[#8C1425] font-semibold shadow-xs"
                        : "bg-[#FAF7F2] border-[#E8DCDD] text-[#6B4E53] hover:border-[#8C1425]/40"
                    }`}
                  >
                    <div className="font-semibold">🌸 Nhà Gái (10.10)</div>
                    <div className="text-[10px] text-[#6B4E53]">Lễ Vu Quy Lâm Đồng</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEventTarget("sg")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      eventTarget === "sg"
                        ? "bg-[#8C1425]/10 border-[#8C1425] text-[#8C1425] font-semibold shadow-xs"
                        : "bg-[#FAF7F2] border-[#E8DCDD] text-[#6B4E53] hover:border-[#8C1425]/40"
                    }`}
                  >
                    <div className="font-semibold">🏰 Nhà Trai (12.12)</div>
                    <div className="text-[10px] text-[#6B4E53]">Lễ Tân Hôn TP.HCM</div>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleGenerateBulk}
                  disabled={!bulkInput.trim() || isSubmittingBulk}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8C1425] text-white text-xs font-semibold tracking-wide uppercase hover:bg-[#8C1425]/90 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSubmittingBulk
                      ? "Đang lưu vào Sheet..."
                      : `Tạo & Lưu Tất Cả Link (${bulkInput.split("\n").filter((l) => l.trim()).length} khách)`}
                  </span>
                </button>

                {bulkResults.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] hover:border-[#8C1425] text-[#8C1425] text-xs font-semibold transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span>Xuất File Excel (CSV)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Results Table */}
            {bulkResults.length > 0 && (
              <div className="p-6 rounded-3xl bg-white border border-[#E8DCDD] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-base font-semibold text-[#280E12]">
                    Kết Quả Đã Tạo ({bulkResults.length} link)
                  </h4>
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã lưu vào Google Sheet (Tab: Danh_Sach_Khach_Moi)</span>
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8DCDD] bg-[#FAF7F2] text-[#6B4E53] font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3 w-10">STT</th>
                        <th className="py-3 px-3 w-40">Tên Khách Mời</th>
                        <th className="py-3 px-3">Link Thiệp Cưới</th>
                        <th className="py-3 px-3 text-right w-28">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCDD]/60">
                      {bulkResults.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          <td className="py-3 px-3 font-mono text-[#6B4E53]">{idx + 1}</td>
                          <td className="py-3 px-3 font-medium text-[#280E12]">{item.name}</td>
                          <td className="py-3 px-3 font-mono text-[#6B4E53] max-w-xs truncate">
                            {item.link}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={async () => {
                                  await navigator.clipboard.writeText(item.link);
                                  setBulkCopiedIdx(idx);
                                  setTimeout(() => setBulkCopiedIdx(null), 2000);
                                }}
                                className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DCDD] hover:bg-[#8C1425] hover:text-white transition-colors text-[#8C1425]"
                                title="Sao chép link"
                              >
                                {bulkCopiedIdx === idx ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DCDD] hover:bg-[#8C1425] hover:text-white transition-colors text-[#8C1425]"
                                title="Mở xem thử"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === "history" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DCDD] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg text-[#280E12] font-semibold flex items-center gap-2">
                  <span>Lịch Sử Link Khách Mời ({history.length})</span>
                  {isLoadingHistory && <RefreshCw className="w-3.5 h-3.5 text-[#8C1425] animate-spin" />}
                </h3>
                <p className="text-xs text-[#6B4E53]">
                  Đồng bộ 2 chiều giữa Google Sheets (Tab: <strong>Danh_Sach_Khach_Moi</strong>) và trình duyệt
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadHistory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-xs font-medium text-[#6B4E53] hover:text-[#8C1425]"
                  title="Tải lại từ Google Sheet"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đồng Bộ Sheet</span>
                </button>

                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Cache Máy</span>
                  </button>
                )}
              </div>
            </div>

            {history.length > 0 && (
              <div className="relative">
                <Search className="w-4 h-4 text-[#6B4E53] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên khách mời..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] focus:border-[#8C1425] outline-none text-xs text-[#280E12]"
                />
              </div>
            )}

            {filteredHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6B4E53] space-y-2">
                <p>Chưa có link nào trong lịch sử.</p>
                <button
                  onClick={() => setActiveTab("single")}
                  className="text-[#8C1425] font-semibold underline"
                >
                  Tạo link đầu tiên ngay
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DCDD] bg-[#FAF7F2] text-[#6B4E53] font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3 w-10">STT</th>
                      <th className="py-3 px-3 w-40">Tên Khách Mời</th>
                      <th className="py-3 px-3">Link Thiệp Cưới</th>
                      <th className="py-3 px-3 text-right w-28">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCDD]/60">
                    {filteredHistory.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="py-3 px-3 font-mono text-[#6B4E53]">{idx + 1}</td>
                        <td className="py-3 px-3 font-medium text-[#280E12]">{item.name}</td>
                        <td className="py-3 px-3 font-mono text-[#6B4E53] max-w-xs truncate">
                          {item.link}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={async () => {
                                await navigator.clipboard.writeText(item.link);
                                setHistoryCopiedIdx(idx);
                                setTimeout(() => setHistoryCopiedIdx(null), 2000);
                              }}
                              className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DCDD] hover:bg-[#8C1425] hover:text-white transition-colors text-[#8C1425]"
                              title="Sao chép link"
                            >
                              {historyCopiedIdx === idx ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DCDD] hover:bg-[#8C1425] hover:text-white transition-colors text-[#8C1425]"
                              title="Mở xem thử"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ITINERARY EDITOR */}
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            {/* Header card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8DCDD] shadow-sm">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-5 h-5 text-[#8C1425]" />
                    <h2 className="font-semibold text-[#280E12] text-base">Lịch Trình Di Chuyển</h2>
                  </div>
                  <p className="text-xs text-[#6B4E53]">
                    Chỉnh sửa lịch trình và đồng bộ lên Google Sheets (tab{" "}
                    <code className="bg-[#FAF7F2] px-1 rounded font-mono text-[10px]">LICH_TRINH</code>).
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href="/lich-trinh"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-[#6B4E53] hover:text-[#280E12] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Xem trang
                  </Link>
                  <button
                    onClick={async () => {
                      if (!WEBHOOK_URL || !WEBHOOK_URL.startsWith("http")) return;
                      setItinLoading(true);
                      try {
                        const res = await fetch(`${WEBHOOK_URL}?action=lich_trinh`);
                        const json = await res.json();
                        if (json?.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
                          const byDay: Record<string, ItinEvent[]> = {};
                          json.data.forEach((row: Record<string, string>) => {
                            if (!byDay[row.dayId]) byDay[row.dayId] = [];
                            byDay[row.dayId].push({
                              id: row.id,
                              time: row.time,
                              title: row.title,
                              description: row.description,
                              mapUrl: row.mapUrl,
                              category: row.category as ItinCategory,
                            });
                          });
                          setItinDays(prev =>
                            prev.map(day => ({
                              ...day,
                              events: byDay[day.id] ?? day.events,
                            }))
                          );
                          setItinDirty(false);
                        }
                      } catch (err) {
                        console.warn("Load from Sheets error:", err);
                      } finally {
                        setItinLoading(false);
                      }
                    }}
                    disabled={itinLoading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-[#6B4E53] hover:text-[#280E12] transition-colors disabled:opacity-50"
                  >
                    {itinLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    Load từ Sheets
                  </button>
                  <button
                    onClick={async () => {
                      if (!WEBHOOK_URL || !WEBHOOK_URL.startsWith("http")) return;
                      setItinSaving(true);
                      try {
                        const allEvents = itinDays.flatMap(day =>
                          day.events.map(ev => ({
                            ...ev,
                            dayId: day.id,
                            dayLabel: day.dayLabel,
                            dayName: day.dayName,
                          }))
                        );
                        await fetch(WEBHOOK_URL, {
                          method: "POST",
                          headers: { "Content-Type": "text/plain;charset=utf-8" },
                          body: JSON.stringify({ type: "LICH_TRINH", events: allEvents }),
                        });
                        setItinDirty(false);
                        setItinSaved(true);
                        setTimeout(() => setItinSaved(false), 3000);
                      } catch (err) {
                        console.warn("Save to Sheets error:", err);
                      } finally {
                        setItinSaving(false);
                      }
                    }}
                    disabled={itinSaving || !itinDirty}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors disabled:opacity-50 ${
                      itinSaved
                        ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                        : "bg-[#8C1425] border-[#8C1425] text-white hover:bg-[#6d0f1c]"
                    }`}
                  >
                    {itinSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : itinSaved ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {itinSaved ? "Đã lưu!" : "Lưu lên Sheets"}
                  </button>
                </div>
              </div>

              {itinDirty && (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Có thay đổi chưa được lưu lên Google Sheets.
                </div>
              )}
            </div>

            {/* Days */}
            {itinDays.map((day, dayIdx) => (
              <div key={day.id} className="rounded-3xl bg-white border border-[#E8DCDD] shadow-sm overflow-hidden">
                {/* Day header */}
                <div className="px-5 py-3 bg-gradient-to-r from-rose-50 to-fuchsia-50 border-b border-[#E8DCDD] flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-[#8C1425]" />
                  <div>
                    <span className="text-xs font-bold text-[#8C1425] uppercase tracking-wider">{day.dayLabel}</span>
                    <span className="text-xs text-[#6B4E53] ml-2">{day.dayName}</span>
                    <p className="text-sm font-semibold text-[#280E12]">{day.theme}</p>
                  </div>
                </div>

                {/* Events */}
                <div className="divide-y divide-[#F0E8E9]">
                  {day.events.map((event, evIdx) => {
                    const cat = ITIN_CAT_CONFIG[event.category] || ITIN_CAT_CONFIG.travel;
                    const isEditing = editingEventId === event.id;

                    return (
                      <div key={event.id} className="px-4 py-3">
                        {isEditing ? (
                          /* Edit form */
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] uppercase font-semibold text-[#6B4E53] mb-1">Giờ</label>
                                <input
                                  type="text"
                                  value={editDraft.time ?? ""}
                                  onChange={e => setEditDraft(d => ({ ...d, time: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-sm focus:border-[#8C1425] outline-none"
                                  placeholder="HH:MM"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-semibold text-[#6B4E53] mb-1">Loại</label>
                                <select
                                  value={editDraft.category ?? "travel"}
                                  onChange={e => setEditDraft(d => ({ ...d, category: e.target.value as ItinCategory }))}
                                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-sm focus:border-[#8C1425] outline-none"
                                >
                                  {(Object.entries(ITIN_CAT_CONFIG) as [ItinCategory, { label: string }][]).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-[#6B4E53] mb-1">Tiêu đề</label>
                              <input
                                type="text"
                                value={editDraft.title ?? ""}
                                onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-sm focus:border-[#8C1425] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-[#6B4E53] mb-1">Mô tả</label>
                              <textarea
                                rows={2}
                                value={editDraft.description ?? ""}
                                onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-sm focus:border-[#8C1425] outline-none resize-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-semibold text-[#6B4E53] mb-1">Link bản đồ (tuỳ chọn)</label>
                              <input
                                type="url"
                                value={editDraft.mapUrl ?? ""}
                                onChange={e => setEditDraft(d => ({ ...d, mapUrl: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-sm focus:border-[#8C1425] outline-none"
                                placeholder="https://maps.app.goo.gl/..."
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setItinDays(prev =>
                                    prev.map((d, di) =>
                                      di !== dayIdx ? d : {
                                        ...d,
                                        events: d.events.map((ev, ei) =>
                                          ei !== evIdx ? ev : { ...ev, ...editDraft } as ItinEvent
                                        ),
                                      }
                                    )
                                  );
                                  setItinDirty(true);
                                  setEditingEventId(null);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8C1425] text-white text-xs font-semibold hover:bg-[#6d0f1c] transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Lưu
                              </button>
                              <button
                                onClick={() => setEditingEventId(null)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DCDD] text-[#6B4E53] text-xs font-semibold hover:text-[#280E12] transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Huỷ
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Display row */
                          <div className="flex items-start gap-3 group">
                            <div className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color}`}>
                              {cat.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-rose-400" />
                                <span className="text-xs font-bold text-rose-600">{event.time}</span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                                  {cat.label}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-[#280E12] mt-0.5 leading-snug">{event.title}</p>
                              {event.description && (
                                <p className="text-xs text-[#6B4E53] mt-0.5 line-clamp-1">{event.description}</p>
                              )}
                              {event.mapUrl && (
                                <a
                                  href={event.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-sky-600 hover:text-sky-800 mt-1"
                                >
                                  <MapPin className="w-2.5 h-2.5" /> Xem bản đồ
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setEditingEventId(event.id);
                                setEditDraft({ ...event });
                              }}
                              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-[#6B4E53] hover:text-[#280E12] hover:bg-[#FAF7F2] border border-transparent hover:border-[#E8DCDD]"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Info footer */}
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>💡 Hướng dẫn:</strong> Hover vào từng hoạt động để thấy nút chỉnh sửa ✏️. Sau khi chỉnh sửa xong, nhấn{" "}
                <strong>"Lưu lên Sheets"</strong> để đồng bộ toàn bộ lịch trình lên Google Sheets (tab{" "}
                <code className="bg-white px-1 rounded">LICH_TRINH</code>).
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
