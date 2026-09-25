/**
 * Banking & VietQR Helper Functions
 * Chuẩn hóa nội dung chuyển khoản ngân hàng (Banking Memo) và tích hợp VietQR
 */

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu sang không dấu (ASCII chuẩn ngân hàng),
 * loại bỏ ký tự đặc biệt để đảm bảo 100% ứng dụng ngân hàng quét mã QR không bị lỗi font hoặc lỗi ký tự.
 * Ví dụ: "Anh Hoàng" -> "Anh Hoang", "Cô Chú Bảy & Gia Đình" -> "Co Chu Bay Gia Dinh"
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tạo nội dung chuyển khoản ngân hàng kèm tên người chuyển (Guest Name)
 * - Cấu trúc chuẩn: <Tên người nhận thiệp cưới> + " mung cuoi Tu Huong"
 *   Ví dụ: "Anh Hoàng" -> "Anh Hoang mung cuoi Tu Huong"
 * - Giới hạn độ dài an toàn tối đa 50 ký tự (chuẩn Napas/VietQR)
 * - Nếu không có tên khách hoặc là mặc định ("Bạn & Người Thương"): dùng "Mung cuoi Tu Huong"
 */
export function generateBankingMemo(
  defaultMemo?: string,
  guestName?: string,
  role?: "groom" | "bride",
  memoTemplate?: string
): string {
  const fallbackMemo = defaultMemo || "Mung cuoi Tu Huong";

  if (!guestName || guestName === "Bạn & Người Thương" || guestName.trim() === "") {
    return fallbackMemo;
  }

  const cleanGuest = removeVietnameseTones(guestName);
  if (!cleanGuest) {
    return fallbackMemo;
  }

  let memo = "";
  if (memoTemplate && memoTemplate.includes("{guest}")) {
    memo = memoTemplate.replace("{guest}", cleanGuest);
  } else {
    memo = `${cleanGuest} mung cuoi Tu Huong`;
  }

  // Giới hạn an toàn 50 ký tự cho hệ thống ngân hàng (Napas)
  if (memo.length <= 50) {
    return memo;
  }

  const suffix = " mung cuoi Tu Huong";
  const maxGuestLen = Math.max(10, 50 - suffix.length);
  const truncatedGuest = cleanGuest.slice(0, maxGuestLen).trim();
  return `${truncatedGuest}${suffix}`;
}

/**
 * Tạo URL mã VietQR trực tiếp từ dịch vụ img.vietqr.io
 */
export function getVietQrUrl({
  bankCode,
  accountNumber,
  ownerName,
  memo,
  template = "compact2",
}: {
  bankCode: string;
  accountNumber: string;
  ownerName: string;
  memo?: string;
  template?: "compact2" | "compact" | "qr_only";
}): string {
  const encodedName = encodeURIComponent(ownerName.trim());
  const encodedMemo = memo ? `&addInfo=${encodeURIComponent(memo.trim())}` : "";
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.png?accountName=${encodedName}${encodedMemo}`;
}
