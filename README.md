# Baby Name Numerology

Ứng dụng gợi ý & phân tích tên cho bé theo Thần Số Học (Pythagorean Numerology) kết hợp Ngũ Hành. Tối ưu cho bé tuổi Bính Ngọ 2026.

## Tính năng

- **Gợi ý tên** — Tìm tên hay, hợp mệnh dựa trên ngày sinh, giới tính, họ & tên đệm
- **Phân tích tên** — Chấm điểm tên đầy đủ theo 5 chỉ số numerology + ngũ hành
- **Tương thích bố mẹ** — Đánh giá mức độ hài hòa tên bé với tên bố mẹ
- **So sánh tên** — So sánh nhiều tên cạnh nhau để dễ chọn
- **Biệt danh** — Gợi ý & phân tích biệt danh dễ thương cho bé
- **Lưu yêu thích** — Lưu tên ưng ý vào localStorage
- **Chia sẻ** — Share kết quả qua Web Share API hoặc clipboard
- **Tên kiêng** — Loại bỏ tên trùng với người thân (check cả họ, đệm, tên)
- **Custom names** — Danh sách tên cộng đồng, tự động thêm khi user nhập tên mới
- **Thống kê** — Hiển thị tổng lượt tìm kiếm

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Font**: Geist (via next/font)
- **Analytics**: Plausible
- **Storage**: GitHub JSON files (custom names + stats)
- **Deploy**: Vercel
- **PWA**: manifest.json, icons, offline-ready

## Cấu trúc project

```
src/
├── app/
│   ├── page.tsx              # Landing page (Bính Ngọ 2026)
│   ├── dat-ten/page.tsx      # Tool đặt tên (tabs)
│   ├── api/
│   │   ├── names/route.ts    # API custom names (GitHub)
│   │   └── stats/route.ts    # API usage counter (GitHub)
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── tabs/                 # Tab components
│   │   ├── SuggestTab.tsx    # Gợi ý tên
│   │   ├── AnalyzeTab.tsx    # Phân tích tên
│   │   ├── NameTab.tsx       # Container (suggest + analyze)
│   │   ├── NicknameTab.tsx   # Biệt danh
│   │   └── FavoritesTab.tsx  # Tên đã lưu
│   └── shared/               # Shared components
│       ├── SuggestionCard.tsx
│       ├── CompareModal.tsx
│       ├── DatePicker.tsx
│       ├── ShareButton.tsx
│       ├── AnalysisDetail.tsx
│       ├── ParentCompatCards.tsx
│       └── ParentInputFields.tsx
├── lib/
│   ├── numerology/           # Core numerology engine
│   │   ├── core.ts           # Pythagorean mapping
│   │   ├── indices.ts        # 5 chỉ số (Life Path, Expression...)
│   │   ├── compatibility.ts  # Tính điểm tương thích
│   │   ├── ngu-hanh.ts       # Ngũ hành (Kim Mộc Thủy Hỏa Thổ)
│   │   ├── parent-compat.ts  # Tương thích bố mẹ
│   │   ├── analyze.ts        # Phân tích tổng hợp
│   │   ├── nickname.ts       # Phân tích biệt danh
│   │   ├── meanings.ts       # Ý nghĩa các số
│   │   └── types.ts          # TypeScript types
│   ├── names.ts              # Database tên Việt Nam
│   ├── suggest.ts            # Engine gợi ý tên
│   ├── custom-names.ts       # API client (shared custom names)
│   ├── favorites.ts          # localStorage favorites
│   ├── analytics.ts          # Plausible tracking
│   └── url-params.ts         # URL query params
├── constants/
│   └── ui.ts                 # UI constants & types
└── public/
    └── data/
        ├── custom-names.json # Shared custom names (GitHub-synced)
        └── stats.json        # Usage counter (GitHub-synced)
```

## Cài đặt

```bash
npm install
```

## Development

```bash
npm run dev
```

Mở http://localhost:3000

## Environment Variables

Tạo file `.env.local`:

```bash
# GitHub Personal Access Token (fine-grained)
# Permissions: Contents (Read and Write) trên repo này
GITHUB_TOKEN=github_pat_xxxxxxxxxxxx

# (Optional) Plausible analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com

# (Optional) Site URL cho SEO/sharing
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Build

```bash
npm run build
```

## Deploy

Deploy trên Vercel. Cần set environment variables:
- `GITHUB_TOKEN` — cho API custom names + stats
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — cho analytics (optional)
- `NEXT_PUBLIC_SITE_URL` — cho SEO metadata (optional)

## Routes

| Route | Mô tả |
|-------|--------|
| `/` | Landing page Bính Ngọ 2026 |
| `/dat-ten` | Tool đặt tên (tabs: Tên, Biệt danh, Đã lưu) |
| `/api/names` | API custom names (GET/POST) |
| `/api/stats` | API usage counter (GET/POST) |

## License

Private project.
