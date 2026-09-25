import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import weddingData from "@/data/wedding.json";
import { generateBankingMemo } from "@/lib/banking";
import { decodeGuestName } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "groom";
  const rawGuest = searchParams.get("guest") || searchParams.get("to") || searchParams.get("k") || "";
  const guestName = decodeGuestName(rawGuest);

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

  // 2. Nếu không có tên khách (hoặc là khách mặc định) và file ảnh tĩnh đã có sẵn, trả về file tĩnh
  if (!guestName || guestName === "Bạn & Người Thương") {
    const staticFilePath = path.join(
      process.cwd(),
      "public",
      account.qrImage.replace(/^\//, "")
    );
    if (fs.existsSync(staticFilePath)) {
      const buffer = fs.readFileSync(staticFilePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }
  }

  // 3. Tải mã VietQR động từ img.vietqr.io với nội dung addInfo chứa tên khách
  const encodedName = encodeURIComponent(account.ownerName.trim());
  const encodedMemo = encodeURIComponent(memo.trim());
  const vietQrUrl = `https://img.vietqr.io/image/${account.bankCode}-${account.accountNumber}-compact2.png?accountName=${encodedName}&addInfo=${encodedMemo}`;

  try {
    const res = await fetch(vietQrUrl, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`VietQR fetch failed: ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Cắt bỏ phần hiển thị "Số tiền: 0đ" ở đáy (tương tự scripts/update-qr.mjs)
    // Giữ nguyên Logo VietQR, Ngân hàng, Mã QR trung tâm, Tên và Số tài khoản
    const processedBuffer = await sharp(rawBuffer)
      .extract({ left: 0, top: 0, width: 540, height: 585 })
      .extend({ bottom: 20, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png({ quality: 90 })
      .toBuffer();

    return new NextResponse(processedBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Personalized VietQR generation error, falling back to static image:", error);

    // Fallback an toàn về ảnh tĩnh có sẵn
    const fallbackPath = path.join(
      process.cwd(),
      "public",
      account.qrImage.replace(/^\//, "")
    );
    if (fs.existsSync(fallbackPath)) {
      const buffer = fs.readFileSync(fallbackPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return new NextResponse("Error generating QR", { status: 500 });
  }
}
