import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UTF-8 safe Decoder for Vietnamese guest names (supports both Base64 and plain URL encoded text)
 * Examples:
 * - 'QW5oIEhvw6BuZw==' -> 'Anh Hoàng'
 * - 'Anh%20Ho%C3%A0ng' -> 'Anh Hoàng'
 * - 'Anh+Ho%C3%A0ng' -> 'Anh Hoàng'
 */
export function decodeGuestName(rawStr: string | null | undefined): string {
  if (!rawStr || typeof rawStr !== "string") return "";
  const trimmed = rawStr.trim();
  if (!trimmed) return "";

  // 1. If it contains spaces or percent encoding or plus, decode standard URI
  const withSpaces = trimmed.replace(/\+/g, " ");

  // 2. Try Base64 decoding if it matches base64 pattern
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length >= 4) {
    try {
      const binaryString = atob(trimmed);
      const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      if (decoded && !/[\x00-\x08\x0E-\x1F]/.test(decoded)) {
        return decoded.trim();
      }
    } catch {
      // Not valid base64, continue to URL decode
    }
  }

  // 3. Fallback to standard URL decode
  try {
    return decodeURIComponent(withSpaces).trim();
  } catch {
    return withSpaces.trim();
  }
}

/**
 * UTF-8 safe Base64 encoder helper (for generating guest links)
 */
export function encodeGuestName(name: string): string {
  if (!name) return "";
  try {
    const bytes = new TextEncoder().encode(name);
    const binary = String.fromCharCode(...bytes);
    return btoa(binary);
  } catch {
    return encodeURIComponent(name);
  }
}

/**
 * Format currency in VND
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
