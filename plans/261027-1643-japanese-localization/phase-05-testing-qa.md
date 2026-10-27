# Phase 05: Validation, Typography & QA
Status: ✅ Complete
Dependencies: Phase 04

## Objective
Kiểm thử toàn diện toàn bộ tính năng song ngữ trên trang chủ, đảm bảo typography tiếng Nhật hiển thị sắc nét trên các thiết bị, không bị lỗi wrap dòng lạ, kiểm tra form RSVP & Lời chúc, và xác thực build production.

## Requirements
### Functional
- [x] Kiểm tra hiển thị đầy đủ trên cả hai ngôn ngữ (`VI` và `JP`):
  - Không còn bất kỳ đoạn text tiếng Việt nào lọt vào bản tiếng Nhật (trừ tên địa danh cụ thể nếu cần giữ nguyên phiên âm).
  - Không bị tràn layout (text overflow) do chữ tiếng Nhật dài hơn hoặc ngắn hơn tiếng Việt.
- [x] Kiểm tra font chữ:
  - Bổ sung font fallback chuẩn Nhật Bản (`Hiragino Sans`, `Yu Gothic`, `Meiryo`) vào Tailwind typography stack.
- [x] Kiểm tra form gửi RSVP và Gửi lời chúc khi ở chế độ `lang=jp`.

### Non-Functional
- [x] Build production: `npm run build` vượt qua 100% không cảnh báo hoặc lỗi (Compiled in 3.4s, exit code 0).
- [x] Lighthouse / Web Vitals: Không tăng bundle size đáng kể, giữ nguyên điểm số tối ưu hiệu năng.

## Implementation Steps
1. [x] Bước 1: Quét kiểm tra các chuỗi dịch thuật để đảm bảo không bị thiếu key giữa `vi.ts` và `jp.ts`.
2. [x] Bước 2: Kiểm tra responsive trên các kích thước màn hình điện thoại trong container `max-w-[480px]`.
3. [x] Bước 3: Kiểm tra SSR OpenGraph metadata & Twitter cards cho `ja_JP`.
4. [x] Bước 4: Chạy `npm run build` để kiểm tra TypeScript types và bundle size.

## Files to Create/Modify
- `tailwind.config.js` - Cập nhật font stack fallback tiếng Nhật
- `src/components/wedding/LanguageSwitcher.tsx` - Nút chuyển đổi ngôn ngữ
- `src/app/page.tsx` - SSR metadata & searchParams.lang handler

## Test Criteria
- [x] `npm run build` exit code 0.
- [x] Giao diện tiếng Nhật hoàn chỉnh, không sót tiếng Việt, thẩm mỹ cao.
