# Technical Specification: Japanese Localization (/?lang=jp)

## 1. Executive Summary
Thêm phiên bản tiếng Nhật cho trang Index (`/`) của website thiệp cưới Tú Văn & Hường Nguyễn thông qua query parameter `?lang=jp`. 
Dự án bao gồm:
- Rà soát và tái cấu trúc (refactor) toàn bộ text cứng trên các component sang hệ thống từ điển có kiểu dữ liệu an toàn.
- Cung cấp nội dung chuyển ngữ tiếng Nhật theo đúng chuẩn mực thiệp cưới Nhật Bản (kính ngữ trang trọng).
- Tích hợp SSR Metadata động cho `?lang=jp` phục vụ SEO và hiển thị card chia sẻ mạng xã hội (đặc biệt là LINE, Messenger).
- Nút chuyển đổi nhanh ngôn ngữ (Language Switcher) tiện dụng.

## 2. Architecture & Data Design

### 2.1. File Structure
```
src/
├── data/
│   ├── wedding.json            # Dữ liệu thiệp tiếng Việt (Gốc)
│   ├── wedding-jp.json         # Dữ liệu thiệp tiếng Nhật
│   └── locales/
│       ├── vi.ts               # Từ điển UI tiếng Việt (sau khi refactor text cứng)
│       └── jp.ts               # Từ điển UI tiếng Nhật
├── types/
│   ├── locale.ts               # Type definition cho WeddingLocaleDictionary
│   └── wedding.ts              # (Hiện có)
├── lib/
│   └── i18n.ts                 # Helper phân giải data & dictionary theo locale
└── components/
    └── wedding/
        ├── LanguageSwitcher.tsx # Nút chuyển đổi ngôn ngữ
        └── ...                  # 18 component được refactor dùng dictionary
```

### 2.2. Query Parameters Contract
- URL: `/?lang=jp` hoặc `/?to=Tên+Khách&lang=jp&event=nha-trai`
- `lang`:
  - `jp`: Chế độ tiếng Nhật (dữ liệu `wedding-jp.json` + từ điển `jp.ts`, SSR metadata `ja_JP`).
  - Mặc định / không truyền / khác `jp`: Chế độ tiếng Việt (dữ liệu `wedding.json` + từ điển `vi.ts`, SSR metadata `vi_VN`).

## 3. UI Refactoring Checklist
Trước khi áp dụng tiếng Nhật, các component sau cần được trích xuất text cứng:
1. `WeddingOpening.tsx`: Tiêu đề bì thư, thông điệp mời, nhãn nút mở, nút bật/tắt nhạc.
2. `HeroSection.tsx`: Tiêu đề, ngày cưới, subtitle.
3. `FamilySection.tsx`: Nhà Trai, Nhà Gái, vai vế cha mẹ, thứ tự con cái, địa chỉ.
4. `InvitationSection.tsx`: Lời ngỏ, thư mời tân hôn.
5. `Countdown.tsx`: Nhãn Ngày - Giờ - Phút - Giây.
6. `CoupleStory.tsx`: Tiêu đề, các mốc thời gian, nút xem thêm.
7. `EventSection.tsx` & `EventCard.tsx`: Tên sự kiện, thời gian, địa điểm, nút Google Maps, Add to Calendar.
8. `Gallery.tsx`: Tiêu đề album ảnh, nút xem thêm.
9. `RSVPSection.tsx`: Tiêu đề, placeholder, radio chọn tham dự, nút submit, thông báo trạng thái.
10. `WishesSection.tsx`: Tiêu đề, placeholder form lời chúc, danh sách lời chúc, nút gửi.
11. `GiftSection.tsx`: Tiêu đề hộp mừng cưới, số tài khoản, QR code, nút sao chép, toast notification.
12. `ThankYouSection.tsx`: Lời tri ân, chữ ký.
13. `BottomNavigation.tsx`: Nhãn 6 tab điều hướng dưới đáy.
14. `MusicController.tsx` & `AutoScrollController.tsx`: Tooltip, trạng thái bật/tắt.

## 4. Quality & Performance Checklist
- [x] Không tăng bundle size đáng kể (dictionary viết dạng file tĩnh TS tree-shakeable).
- [x] Không reload page khi đổi ngôn ngữ bằng client state.
- [x] Đảm bảo font rendering tốt cho chữ Kanji/Kana.
