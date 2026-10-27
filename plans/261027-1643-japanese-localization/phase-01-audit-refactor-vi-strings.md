# Phase 01: Audit & Refactor VI Hardcoded Strings
Status: ✅ Complete
Dependencies: None

## Objective
Rà soát toàn diện tất cả các text cứng (hardcoded UI labels, placeholders, buttons, alert/toast messages, headings) trên toàn bộ component của trang Index (`src/components/wedding/*`).
Tạo một Type Dictionary chuẩn (`src/types/locale.ts`) và bộ từ điển Tiếng Việt chuẩn (`src/data/locales/vi.ts`).
Refactor các component sử dụng từ điển này, bảo đảm không thay đổi bất kỳ hành vi hay giao diện nào của bản tiếng Việt hiện tại.

## Requirements
### Functional
- [x] Định nghĩa TypeScript interface `WeddingLocaleDictionary` bao phủ toàn bộ các nhóm text (opening, hero, family, invitation, countdown, story, events, gallery, rsvp, wishes, gift, thankYou, nav, controls).
- [x] Tạo file `src/data/locales/vi.ts` triển khai đầy đủ `WeddingLocaleDictionary`.
- [x] Tạo `src/context/LocaleContext.tsx` và hook `useLocale()` hỗ trợ fallback an toàn.
- [x] Refactor các component trong `src/components/wedding/` để tiêu thụ dictionary thay vì text cố định.

### Non-Functional
- [x] Không làm thay đổi layout hay break giao diện tiếng Việt hiện tại.
- [x] Đảm bảo 100% type-safe, không dùng `any`.

## Implementation Steps
1. [x] Bước 1: Rà soát quét code toàn bộ text tiếng Việt xuất hiện trực tiếp trong JSX của `src/components/wedding/`.
2. [x] Bước 2: Tạo `src/types/locale.ts` định nghĩa schema cho `WeddingLocaleDictionary`.
3. [x] Bước 3: Tạo `src/data/locales/vi.ts` với đầy đủ các chuỗi được trích xuất.
4. [x] Bước 4: Refactor các component chính: `WeddingOpening`, `HeroSection`, `FamilySection`, `InvitationSection`, `Countdown`.
5. [x] Bước 5: Refactor các component chức năng: `EventSection`, `EventCard`, `CoupleStory`, `Gallery`, `RSVPSection`, `WishesSection`, `GiftSection`, `ThankYouSection`.
6. [x] Bước 6: Refactor các thanh điều khiển: `BottomNavigation`, `MusicController`, `AutoScrollController`.

## Files Created/Modified
- `src/types/locale.ts` - Schema type-safe cho từ điển UI
- `src/data/locales/vi.ts` - Từ điển chuỗi Tiếng Việt trích xuất
- `src/context/LocaleContext.tsx` - Context & hook `useLocale()`
- `src/components/wedding/*.tsx` - Đã refactor 100% component tiêu thụ dictionary
- `src/components/wedding/WeddingPageClient.tsx` - Đã wrap `LocaleProvider`

## Test Criteria
- [x] Chạy `npm run build` thành công, không có lỗi TypeScript hay Lint (Exit code 0).
- [x] Toàn bộ các nút bấm, tiêu đề, form RSVP, modal đều hoạt động nguyên vẹn trên giao diện Tiếng Việt.

## Files to Create/Modify
- `src/types/locale.ts` - Schema type-safe cho từ điển UI
- `src/data/locales/vi.ts` - Từ điển chuỗi Tiếng Việt trích xuất
- `src/components/wedding/*.tsx` - Refactor sử dụng dictionary

## Test Criteria
- [ ] Chạy `npm run build` thành công, không có lỗi TypeScript hay Lint.
- [ ] Mở trang chủ tiếng Việt (`/`), toàn bộ các nút bấm, tiêu đề, form RSVP, modal đều hiển thị chính xác như trước.

---
Next Phase: [phase-02-jp-data-dictionary.md](file:///d:/git/wedding-site/plans/261027-1643-japanese-localization/phase-02-jp-data-dictionary.md)
