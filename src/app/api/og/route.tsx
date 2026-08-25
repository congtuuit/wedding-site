import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { decodeGuestName } from "@/lib/utils";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawTo = searchParams.get("to") || searchParams.get("guest") || searchParams.get("k");
    const guestName = decodeGuestName(rawTo);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#150204",
            backgroundImage:
              "radial-gradient(circle at 50% 30%, #3D0811 0%, #1A0306 60%, #0D0102 100%)",
            padding: "40px 60px",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Outer Gold Border */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              right: "20px",
              bottom: "20px",
              border: "2px solid rgba(212, 175, 55, 0.4)",
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              pointerEvents: "none",
            }}
          />

          {/* Inner Dashed Border */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: "28px",
              right: "28px",
              bottom: "28px",
              border: "1px dashed rgba(212, 175, 55, 0.25)",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              pointerEvents: "none",
            }}
          />

          {/* Top Monogram Circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              backgroundColor: "rgba(212, 175, 55, 0.12)",
              border: "1.5px solid #D4AF37",
              color: "#F3E5AB",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "16px",
              boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)",
            }}
          >
            T & H
          </div>

          {/* Subtitle / Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "6px",
              color: "#D4AF37",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            ✨ THƯ MỜI THÀNH HÔN ✨
          </div>

          {/* Couple Names */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              fontWeight: 800,
              color: "#FFF9F0",
              letterSpacing: "1.5px",
              marginBottom: "20px",
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            TÚ VĂN & HƯỜNG NGUYỄN
          </div>

          {/* Guest Invitation Box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "880px",
              padding: "20px 36px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1.5px solid rgba(212, 175, 55, 0.5)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: "#F3E5AB",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Thân gửi
            </div>
            <div
              style={{
                fontSize: guestName && guestName.length > 25 ? "32px" : "38px",
                fontWeight: 800,
                color: "#F6E05E",
                textAlign: "center",
                lineHeight: 1.2,
                textShadow: "0 0 24px rgba(246, 224, 94, 0.5)",
              }}
            >
              {guestName || "Bạn & Người Thương"}
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.75)",
                marginTop: "6px",
                fontStyle: "italic",
              }}
            >
              Đến chung vui cùng chúng mình trong ngày trọng đại
            </div>
          </div>

          {/* Date & Location Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              fontSize: "17px",
              fontWeight: 600,
              color: "#F3E5AB",
              letterSpacing: "1px",
            }}
          >
            <span>📅 12 . 12 . 2026</span>
            <span style={{ color: "#D4AF37", opacity: 0.6 }}>•</span>
            <span>The ADORA Center, TP. Hồ Chí Minh</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Internal error";
    return new Response(`Failed to generate the image: ${message}`, {
      status: 500,
    });
  }
}
