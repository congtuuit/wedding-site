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
    content: "Chúc mừng 10 năm tình yêu đơm hoa kết trái! Mãi mãi mặn nồng và ngọt ngào như ngày đầu nhé!",
    createdAt: "2026-08-21T14:30:00.000Z",
  },
  {
    id: "wish-3",
    senderName: "Anh Rin & Chị Mai",
    content: "Mừng ngày chung đôi của hai em. Chúc hai vợ chồng luôn đồng lòng, yêu thương và thấu hiểu nhau.",
    createdAt: "2026-08-22T09:15:00.000Z",
  },
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
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "RSVP",
          ...data,
        }),
      });
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "WISH",
          ...newWish,
        }),
      }).catch(() => {});
    } catch {}
  }

  return newWish;
}
