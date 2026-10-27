# Phase 04: Component Integration & Language Switcher
Status: ✅ Complete
Dependencies: Phase 03

## Objective
Kết nối hệ thống đa ngôn ngữ vào Client Component `WeddingPageClient.tsx` và toàn bộ các section.
Thiết kế và triển khai nút chuyển đổi ngôn ngữ tinh tế (Language Switcher: `🇻🇳 VI | 🇯🇵 JP`) cho phép khách bấm đổi qua lại tức thì mà vẫn giữ nguyên các tham số `to`, `event` trên URL.

## Requirements
### Functional
- [x] Cập nhật `WeddingPageClient`:
  - Tiếp nhận prop `lang` từ server.
  - Cung cấp context `LocaleContext` và truyền data (`weddingData` tương ứng) và `dict` (`WeddingLocaleDictionary` tương ứng) cho các component.
- [x] Xây dựng component `LanguageSwitcher`:
  - Nằm ở vị trí trang nhã ở góc trên cùng của khung thiệp (`max-w-[480px]`).
  - Có icon cờ `🇻🇳` và `🇯🇵` với hiệu ứng chuyển đổi mượt mà.
  - Khi click chuyển ngôn ngữ, cập nhật URL (thêm hoặc bỏ `lang=jp`) bằng `window.history.replaceState` giữ nguyên vị trí cuộn và query `to`, `event`.
- [x] Kiểm tra hiển thị nội dung tiếng Nhật trên từng section:
  - `WeddingOpening`: Hiệu ứng phong bì thư mở ra, chữ tiếng Nhật trang trọng.
  - `HeroSection`: Tagline tiếng Nhật, tên cô dâu chú rể.
  - `FamilySection`: Xưng hô gia đình chuẩn Nhật.
  - `InvitationSection`: Đoạn văn mời cưới ấm áp.
  - `Countdown`: Bộ đếm ngày cưới hiển thị nhãn 日 / 時間 / 分 / 秒.
  - `CoupleStory`: Các cột mốc tình yêu.
  - `EventSection`: Lễ gia tiên & Tiệc cưới, link Google Map, Add to Calendar.
  - `RSVPSection`: Form xác nhận tham dự.
  - `WishesSection`: Gửi lời chúc và danh sách lời chúc.
  - `GiftSection`: Hộp mừng cưới (hỗ trợ hiển thị ghi chú thích hợp cho khách Nhật).
  - `ThankYouSection`: Lời cảm ơn.
  - `BottomNavigation`: Nhãn menu tiếng Nhật.

### Non-Functional
- [x] Trải nghiệm chuyển đổi ngôn ngữ tức thì, không gây lag giật hay vỡ layout.
- [x] Không làm reload lại toàn bộ trang.

## Implementation Steps
1. [x] Bước 1: Tạo `LanguageSwitcher.tsx` với giao diện nhỏ gọn, sang trọng.
2. [x] Bước 2: Tích hợp `LocaleProvider` và state language vào `WeddingPageClient`.
3. [x] Bước 3: Cập nhật các section để hiển thị dữ liệu theo đúng `lang`.
4. [x] Bước 4: Kiểm tra sự bảo lưu các search params khác khi chuyển đổi ngôn ngữ.

## Files to Create/Modify
- `src/components/wedding/LanguageSwitcher.tsx` - Nút chuyển đổi ngôn ngữ
- `src/components/wedding/WeddingPageClient.tsx` - Quản lý state ngôn ngữ và phân phối data
- `src/components/wedding/*.tsx` - Tiếp nhận prop/context đa ngôn ngữ

## Test Criteria
- [ ] Bấm nút `JP` chuyển toàn bộ giao diện index sang tiếng Nhật, URL có `?lang=jp`.
- [ ] Bấm nút `VI` chuyển toàn bộ giao diện index về tiếng Việt, URL mất `lang=jp`.
- [ ] Với link có `to=Nam`: chuyển sang JP thì URL là `?to=Nam&lang=jp`, chuyển về VI là `?to=Nam`.

---
Next Phase: [phase-05-testing-qa.md](file:///d:/git/wedding-site/plans/261027-1643-japanese-localization/phase-05-testing-qa.md)
