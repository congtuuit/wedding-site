export interface RSVPData {
  guestName: string;
  attending: "yes" | "no";
  eventSelected: string;
  numberOfGuests: number;
  message?: string;
  submittedAt: string;
}

export interface WishData {
  id: string;
  senderName: string;
  content: string;
  createdAt: string;
}

const DEFAULT_WISHES: WishData[] = [
  {
    id: "wish-1",
    senderName: "Gia đình Bác Thành",
    content: "Chúc hai cháu Tú & Hường trăm năm hạnh phúc, cùng nhau xây dựng tổ ấm ngập tràn niềm vui và bình an!",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "wish-2",
    senderName: "Hội bạn thân Đại Học",
    content: "Chúc mừng tình yêu đơm hoa kết trái! Mãi mãi mặn nồng và ngọt ngào như ngày đầu nhé!",
    createdAt: "2026-08-21T14:30:00.000Z",
  }
];

const STORAGE_KEY_RSVP = "wedding_user_rsvp";
const STORAGE_KEY_WISHES = "wedding_user_wishes";

/**
 * Submit RSVP to Webhook / Google AppSheet and store in localStorage
 */
export async function submitRSVP(data: RSVPData, webhookUrl?: string): Promise<{ success: boolean; message: string }> {
  try {
    // Save to local storage for immediate feedback
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_RSVP, JSON.stringify(data));
    }

    // Also add their message to wishes if provided
    if (data.message && data.message.trim()) {
      addWish({
        senderName: data.guestName,
        content: data.message,
      });
    }

    // If webhookUrl is configured, send payload
    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            type: "RSVP",
            ...data,
          }),
        });
      } catch (err) {
        console.warn("Webhook fetch warning (non-blocking):", err);
      }
    }

    return { success: true, message: "Xác nhận tham dự thành công!" };
  } catch (error) {
    console.error("RSVP submit error:", error);
    // Still return success if local cache succeeded
    return { success: true, message: "Đã ghi nhận phản hồi của bạn!" };
  }
}

/**
 * Retrieve saved RSVP
 */
export function getSavedRSVP(): RSVPData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RSVP);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Get list of wishes (Default + User added)
 */
export function getWishes(): WishData[] {
  if (typeof window === "undefined") return DEFAULT_WISHES;
  try {
    const localRaw = localStorage.getItem(STORAGE_KEY_WISHES);
    const localWishes: WishData[] = localRaw ? JSON.parse(localRaw) : [];
    return [...localWishes, ...DEFAULT_WISHES];
  } catch {
    return DEFAULT_WISHES;
  }
}

/**
 * Fetch live wishes from Google Sheet API (falls back to local + defaults)
 */
export async function fetchLiveWishes(webhookUrl?: string): Promise<WishData[]> {
  const localWishes = getWishes();
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return localWishes;
  }

  try {
    const res = await fetch(webhookUrl, { method: "GET" });
    const json = await res.json();
    if (json && json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
      const sheetWishes: WishData[] = json.data;
      return sheetWishes.length < 3 ? [...sheetWishes, ...DEFAULT_WISHES] : sheetWishes;
    }
  } catch (err) {
    console.warn("Could not fetch live wishes from Google Sheet:", err);
  }

  return localWishes;
}

/**
 * Add a new wish
 */
export async function addWish(
  wish: { senderName: string; content: string },
  webhookUrl?: string
): Promise<WishData> {
  const newWish: WishData = {
    id: `wish-${Date.now()}`,
    senderName: wish.senderName.trim() || "Khách mời ẩn danh",
    content: wish.content.trim(),
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const localRaw = localStorage.getItem(STORAGE_KEY_WISHES);
      const localWishes: WishData[] = localRaw ? JSON.parse(localRaw) : [];
      localWishes.unshift(newWish);
      localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(localWishes));
    } catch (e) {
      console.error(e);
    }
  }

  // If webhook is provided, trigger it in background
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          type: "WISH",
          ...newWish,
        }),
      }).catch(() => { });
    } catch { }
  }

  return newWish;
}
