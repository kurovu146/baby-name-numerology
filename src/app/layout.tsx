import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Đặt Tên Bé Theo Thần Số Học | Numerology Baby Name",
  description:
    "Công cụ đặt tên cho bé dựa trên thần số học Pythagorean. Phân tích chỉ số đường đời, sứ mệnh, linh hồn, nhân cách. Gợi ý tên hợp mệnh.",
  keywords: [
    "thần số học",
    "đặt tên bé",
    "đặt tên con",
    "numerology",
    "baby name",
    "tên hay cho bé",
  ],
  openGraph: {
    title: "Đặt Tên Bé Theo Thần Số Học",
    description: "Tìm tên hay, hợp mệnh cho bé yêu dựa trên thần số học Pythagorean",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-amber-50 via-white to-rose-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
