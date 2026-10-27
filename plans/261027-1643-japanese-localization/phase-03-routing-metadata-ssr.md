# Phase 03: Routing & SSR Metadata for JP
Status: ✅ Complete
Dependencies: Phase 02

## Objective
Nâng cấp `src/app/page.tsx` để:
1. Đọc và nhận diện query param `lang=jp` từ `searchParams`.
2. Tạo SSR Dynamic Metadata và OpenGraph tiếng Nhật chuẩn mực khi chia sẻ link (khi gửi qua Zalo, Messenger, LINE, iMessage, Twitter).
3. Hỗ trợ trường hợp có tên khách mời: `/?lang=jp&to=Tanaka` hiển thị `💌 招待状: 田中様 — トゥ＆フオン 結婚式のご案内`.

## Requirements
### Functional
- [x] Bổ sung param `lang` vào `searchParams` type trong `src/app/page.tsx`.
- [x] Xử lý hàm `generateMetadata`:
  - Kiểm tra `resolvedSearchParams.lang === "jp"`.
  - Nếu là tiếng Nhật:
    - Title: `💌 招待状: ${guestName || '大切な皆様へ'} — 結婚式のご案内 | トゥ＆フオン`
    - Description: Lời mời tham dự ngày trọng đại của Tú & Hường bằng tiếng Nhật trang nhã.
    - OpenGraph locale: `"ja_JP"`.
    - Canonical URL: Giữ đúng query param `lang=jp` cùng với `to` và `event`.
  - Nếu không có hoặc khác `"jp"`: Giữ nguyên logic tiếng Việt hiện tại với locale `"vi_VN"`.
- [x] Truyền prop `lang` đã chuẩn hóa (`"vi" | "jp"`) xuống `WeddingPageClient`.

### Non-Functional
- [x] Đảm bảo hiệu năng Server Component không bị ảnh hưởng, thời gian render < 50ms.
- [x] Không làm gãy logic parse `guestName` (decode base64 hoặc tên thường) và `stage`.

## Implementation Steps
1. [x] Bước 1: Cập nhật `src/app/page.tsx` type definition cho Props `searchParams`.
2. [x] Bước 2: Tách logic tạo metadata tiếng Nhật tương thích `searchParams.lang`.
3. [x] Bước 3: Đảm bảo link canonical và alternate tags phản ánh đúng URL có param `lang=jp`.
4. [x] Bước 4: Kiểm tra kết quả thẻ meta SSR và truyền `initialLang` vào client.

## Files to Create/Modify
- `src/app/page.tsx` - Xử lý `searchParams.lang`, generate metadata SSR cho `ja_JP` và `vi_VN`

## Test Criteria
- [ ] Truy cập `/?lang=jp` trả về HTML có `<html lang="ja">` hoặc metadata tiếng Nhật.
- [ ] Truy cập `/?lang=jp&to=Tanaka` trả về Title chứa `田中様` và `招待状`.
- [ ] Truy cập `/` (không có param) vẫn trả về metadata Tiếng Việt `Thân gửi:...` 100% như cũ.

---
Next Phase: [phase-04-components-integration-switcher.md](file:///d:/git/wedding-site/plans/261027-1643-japanese-localization/phase-04-components-integration-switcher.md)
