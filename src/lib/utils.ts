import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UTF-8 safe Base64 decoder for Vietnamese names
 * Example: 'R2lhIMSRw6xuaCBBbmggUmlu' -> 'Gia đình Anh Rin'
 */
export function decodeGuestName(base64Str: string | null | undefined): string {
  if (!base64Str || typeof base64Str !== "string") return "";
  try {
    const cleanStr = decodeURIComponent(base64Str.trim());
    // Convert base64 to binary string
    const binaryString = atob(cleanStr);
    // Convert binary string to bytes
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    // Decode UTF-8 bytes to text
    return new TextDecoder().decode(bytes);
  } catch (error) {
    // If it is not a base64 string, check if it's already a plain text name
    try {
      const decoded = decodeURIComponent(base64Str);
      if (decoded && !/^[A-Za-z0-9+/=]+$/.test(decoded)) {
        return decoded;
      }
    } catch {
      // Fallback
    }
    return "";
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
