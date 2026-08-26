import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Apple Touch Icon generation (iOS Home screen & Safari)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8C1425 0%, #30040A 100%)",
          borderRadius: "40px",
          border: "8px solid #D4AF37",
          color: "#FFF3B0",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 70,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: "1px",
          }}
        >
          <span>T</span>
          <span style={{ color: "#FB7185", fontSize: 50, margin: "0 6px" }}>♥</span>
          <span>H</span>
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#D4AF37",
            letterSpacing: "3px",
            marginTop: "2px",
            textTransform: "uppercase",
          }}
        >
          Wedding
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
