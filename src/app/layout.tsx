import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: "Đặt Tên Bé Theo Thần Số Học & Ngũ Hành | Numerology Baby Name",
  description:
    "Công cụ đặt tên cho bé dựa trên thần số học Pythagorean kết hợp Ngũ Hành. Phân tích 6 chỉ số: đường đời, sứ mệnh, linh hồn, nhân cách, trưởng thành, ngày sinh. Gợi ý tên hợp mệnh, so sánh tên, phân tích biệt danh.",
  keywords: [
    "thần số học",
    "đặt tên bé",
    "đặt tên con",
    "numerology",
    "baby name",
    "tên hay cho bé",
    "ngũ hành",
    "phong thủy tên",
    "đặt tên theo mệnh",
    "thần số học 2026",
    "tên bé trai",
    "tên bé gái",
    "pythagorean numerology",
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "Đặt Tên Bé Theo Thần Số Học & Ngũ Hành",
    description: "Tìm tên hay, hợp mệnh cho bé yêu dựa trên thần số học Pythagorean kết hợp Ngũ Hành. Phân tích đầy đủ 6 chỉ số, gợi ý tên, so sánh và chia sẻ.",
    type: "website",
    locale: "vi_VN",
    siteName: "Baby Name Numerology",
  },
  twitter: {
    card: "summary_large_image",
    title: "Đặt Tên Bé Theo Thần Số Học & Ngũ Hành",
    description: "Công cụ đặt tên bé dựa trên thần số học Pythagorean + Ngũ Hành",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tên Bé",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Baby Name Numerology",
  alternateName: "Đặt Tên Bé Theo Thần Số Học",
  url: SITE_URL,
  description:
    "Công cụ đặt tên cho bé dựa trên thần số học Pythagorean kết hợp Ngũ Hành. Phân tích 6 chỉ số, gợi ý tên hợp mệnh, so sánh và chia sẻ.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  inLanguage: "vi-VN",
  offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#f7f3fa] flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
