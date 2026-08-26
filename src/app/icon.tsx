import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation for standard browser tabs
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8C1425 0%, #42070E 100%)",
          borderRadius: "50%",
          border: "2px solid #D4AF37",
          color: "#FFF3B0",
          fontSize: 14,
          fontWeight: 800,
          fontFamily: "sans-serif",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          letterSpacing: "-0.5px",
        }}
      >
        <span>T</span>
        <span style={{ color: "#FB7185", fontSize: 11, margin: "0 1px" }}>♥</span>
        <span>H</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
