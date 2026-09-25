import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import sharp from "sharp";
import weddingData from "@/data/wedding.json";
import { generateBankingMemo } from "@/lib/banking";
import { decodeGuestName } from "@/lib/utils";

export const runtime = "nodejs";

// In-Memory Cache (RAM LRU, tối đa 500 ảnh)
const memoryCache = new Map<string, Buffer>();
const MAX_MEMORY_CACHE = 500;

// Deduplication cho các request đồng thời
const inFlightRequests = new Map<string, Promise<Buffer>>();

// Thư mục lưu Persistent Disk Cache
const CACHE_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "wedding-qr-cache")
  : path.join(process.cwd(), ".cache", "qr");

function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch {
    // Bỏ qua lỗi tạo thư mục nếu môi trường bị giới hạn quyền
  }
}

// Khởi tạo thư mục cache
ensureCacheDir();

function setMemoryCache(key: string, buffer: Buffer) {
  if (memoryCache.size >= MAX_MEMORY_CACHE) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) memoryCache.delete(oldestKey);
  }
  memoryCache.set(key, buffer);
}

// Hàm dọn sạch toàn bộ cache (RAM & Ổ đĩa)
function clearAllQrCache() {
  const memoryCount = memoryCache.size;
  memoryCache.clear();
  let diskCount = 0;
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      for (const file of files) {
        if (file.endsWith(".png")) {
          try {
            fs.unlinkSync(path.join(CACHE_DIR, file));
            diskCount++;
          } catch {
            // Bỏ qua lỗi xóa từng file nếu bị khóa
          }
        }
      }
    }
  } catch {
    // Bỏ qua lỗi đọc thư mục
  }
  return { memoryCleared: memoryCount, diskFilesCleared: diskCount };
}

// Cấu hình thời gian lưu trữ: 3 THÁNG (90 ngày = 7.776.000 giây)
const CACHE_MAX_AGE = 7776000;
const THREE_MONTHS_CACHE_HEADER =
  `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=86400, immutable`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // 0. Hỗ trợ xóa cache qua query: /api/qr?action=clear hoặc /api/qr?clear=all
  const action = searchParams.get("action") || searchParams.get("clear");
  if (action === "clear" || action === "all") {
    const result = clearAllQrCache();
    return NextResponse.json({
      success: true,
      message: `Đã dọn dẹp sạch toàn bộ cache mã QR thành công (Đĩa: ${result.diskFilesCleared} files, RAM: ${result.memoryCleared} items).`,
      timestamp: new Date().toISOString(),
      ...result,
    });
  }

  const role = searchParams.get("role") || "groom";
  const rawGuest =
    searchParams.get("guest") ||
    searchParams.get("to") ||
    searchParams.get("k") ||
    "";
  const guestName = decodeGuestName(rawGuest);
  const version =
    searchParams.get("v") ||
    (weddingData.gift as { qrVersion?: string }).qrVersion ||
    "1";
  const forceRefresh =
    searchParams.get("force") === "true" ||
    searchParams.get("refresh") === "true";

  const account = weddingData.gift.accounts.find((a) => a.role === role);
  if (!account) {
    return new NextResponse("Account not found", { status: 404 });
  }

  // 1. Tạo nội dung chuyển khoản cá nhân hóa kèm tên khách
  const memo = generateBankingMemo(
    account.memo,
    guestName,
    account.role as "groom" | "bride",
    (account as { memoTemplate?: string }).memoTemplate
  );

  // 2. Nếu không có tên khách (hoặc là khách mặc định), trả về file ảnh tĩnh gốc
  if (!guestName || guestName === "Bạn & Người Thương") {
    const staticFilePath = path.join(
      process.cwd(),
      "public",
      account.qrImage.replace(/^\//, "")
    );
    if (fs.existsSync(staticFilePath)) {
      const buffer = fs.readFileSync(staticFilePath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": THREE_MONTHS_CACHE_HEADER,
          "X-QR-Cache": "STATIC",
        },
      });
    }
  }

  // Khóa cache duy nhất theo role, số tài khoản, nội dung chuyển khoản và phiên bản version
  const cacheKey = crypto
    .createHash("md5")
    .update(`${account.role}_${account.accountNumber}_${memo}_v${version}`)
    .digest("hex");
  const diskCacheFile = path.join(CACHE_DIR, `${cacheKey}.png`);

  // Nếu có cờ forceRefresh=true: xóa file cache cũ và buộc tạo lại mới
  if (forceRefresh) {
    memoryCache.delete(cacheKey);
    try {
      if (fs.existsSync(diskCacheFile)) {
        fs.unlinkSync(diskCacheFile);
      }
    } catch {
      // ignore
    }
  } else {
    // 3. Tầng 1: Kiểm tra Memory Cache (RAM)
    const cachedInMemory = memoryCache.get(cacheKey);
    if (cachedInMemory) {
      return new NextResponse(new Uint8Array(cachedInMemory), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": THREE_MONTHS_CACHE_HEADER,
          "X-QR-Cache": "HIT-MEMORY",
        },
      });
    }

    // 4. Tầng 2: Kiểm tra Disk Cache (File System)
    try {
      if (fs.existsSync(diskCacheFile)) {
        const diskBuffer = fs.readFileSync(diskCacheFile);
        setMemoryCache(cacheKey, diskBuffer);
        return new NextResponse(new Uint8Array(diskBuffer), {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": THREE_MONTHS_CACHE_HEADER,
            "X-QR-Cache": "HIT-DISK",
          },
        });
      }
    } catch {
      // Tiếp tục tạo mới nếu đọc file disk lỗi
    }
  }

  // 5. Tầng 3: Deduplication (chống gọi trùng lặp đồng thời) & Tạo mới
  try {
    let fetchPromise = inFlightRequests.get(cacheKey);

    if (!fetchPromise) {
      fetchPromise = (async () => {
        const encodedName = encodeURIComponent(account.ownerName.trim());
        const encodedMemo = encodeURIComponent(memo.trim());
        const vietQrUrl = `https://img.vietqr.io/image/${account.bankCode}-${account.accountNumber}-compact2.png?accountName=${encodedName}&addInfo=${encodedMemo}`;

        const res = await fetch(vietQrUrl, {
          next: { revalidate: CACHE_MAX_AGE },
        });

        if (!res.ok) {
          throw new Error(`VietQR fetch failed: ${res.statusText}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        const rawBuffer = Buffer.from(arrayBuffer);

        // Cắt bỏ phần hiển thị "Số tiền: 0đ" ở đáy (tương tự scripts/update-qr.mjs)
        // Giữ nguyên Logo VietQR, Ngân hàng, Mã QR trung tâm, Tên và Số tài khoản
        const processed = await sharp(rawBuffer)
          .extract({ left: 0, top: 0, width: 540, height: 585 })
          .extend({
            bottom: 20,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .png({ quality: 90 })
          .toBuffer();

        // Ghi vào Memory Cache
        setMemoryCache(cacheKey, processed);

        // Ghi vào Disk Cache bất đồng bộ
        try {
          ensureCacheDir();
          fs.promises.writeFile(diskCacheFile, processed).catch(() => {});
        } catch {
          // Bỏ qua lỗi ghi disk nếu có
        }

        return processed;
      })();

      inFlightRequests.set(cacheKey, fetchPromise);
    }

    const finalBuffer = await fetchPromise;

    return new NextResponse(new Uint8Array(finalBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": forceRefresh
          ? "no-cache, no-store, must-revalidate"
          : THREE_MONTHS_CACHE_HEADER,
        "X-QR-Cache": forceRefresh ? "FORCED-REFRESH" : "MISS-GENERATED",
      },
    });
  } catch (error) {
    console.error(
      "Personalized VietQR generation error, falling back to static image:",
      error
    );

    // Fallback an toàn về ảnh tĩnh có sẵn
    const fallbackPath = path.join(
      process.cwd(),
      "public",
      account.qrImage.replace(/^\//, "")
    );
    if (fs.existsSync(fallbackPath)) {
      const buffer = fs.readFileSync(fallbackPath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
          "X-QR-Cache": "FALLBACK",
        },
      });
    }

    return new NextResponse("Error generating QR", { status: 500 });
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

// Hỗ trợ DELETE method để xóa toàn bộ cache
export async function DELETE() {
  const result = clearAllQrCache();
  return NextResponse.json({
    success: true,
    message: "Đã dọn dẹp sạch toàn bộ cache mã QR.",
    timestamp: new Date().toISOString(),
    ...result,
  });
}

// Hỗ trợ POST method để xóa toàn bộ cache
export async function POST() {
  const result = clearAllQrCache();
  return NextResponse.json({
    success: true,
    message: "Đã dọn dẹp sạch toàn bộ cache mã QR.",
    timestamp: new Date().toISOString(),
    ...result,
  });
}


