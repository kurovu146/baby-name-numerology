import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Đặt Tên Bé Theo Thần Số Học & Ngũ Hành";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #673779 0%, #041628 100%)",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 20 }}>✨</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: 16,
          }}
        >
          Đặt Tên Bé
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          Thần Số Học Pythagorean · Ngũ Hành · 6 Chỉ Số
        </div>
        <div
          style={{
            marginTop: 36,
            width: 80,
            height: 5,
            borderRadius: 3,
            background: "#af3689",
          }}
        />
        <div
          style={{
            marginTop: 28,
            fontSize: 16,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Baby Name Numerology
        </div>
      </div>
    ),
    { ...size },
  );
}
