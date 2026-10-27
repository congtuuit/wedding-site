# Phase 02: JP Data & UI Dictionary Setup
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Xây dựng nguồn dữ liệu nội dung tiếng Nhật hoàn chỉnh bao gồm file `src/data/wedding-jp.json` (tương ứng với `wedding.json`) và từ điển UI `src/data/locales/jp.ts` (triển khai `WeddingLocaleDictionary` từ Phase 01).
Văn phong tiếng Nhật phải chuẩn mực, trang trọng, phù hợp phong tục thiệp cưới Nhật Bản (kính ngữ 敬語, format ngày giờ năm Reiwa/Tây lịch, xưng hô tôn kính).

## Requirements
### Functional
- [x] Tạo `src/data/wedding-jp.json` với nội dung chuyển ngữ chuẩn:
  - Thông tin Chú rể (新郎: トゥ / ヴァン・コン・トゥ) & Cô dâu (新婦: フオン / グエン・ティ・フオン).
  - Thông tin bố mẹ hai bên (新郎家・新婦家 / 父・母).
  - Lời ngỏ mời cưới (ご挨拶・ご招待の辞) sâu sắc, lịch thiệp.
  - Sự kiện cưới: Lễ thành hôn & Tiệc cưới (挙式・披露宴), địa chỉ, thời gian.
  - Câu chuyện tình yêu (Our Story / ふたりの歩み) dịch sang tiếng Nhật ấm áp.
- [x] Tạo `src/data/locales/jp.ts` chuẩn hoá toàn bộ chuỗi giao diện:
  - Bì thư: 招待状を開く, 音楽を準備しています...
  - Countdown: 日, 時間, 分, 秒...
  - Nút bấm: 道順を見る, 出席の返信...
  - Form RSVP: お名前, ご出席 / ご欠席, 人数, メッセージ...
  - Lời chúc (Wishes): メッセージを送る...
  - Hộp mừng cưới (Gift): お祝いの気持ち...
  - Lời cảm ơn: 心より感謝申し上げます...
- [x] Viết helper loader `getWeddingData(lang)` và `getLocaleDictionary(lang)` hỗ trợ fallback an toàn về Tiếng Việt nếu thiếu key.

### Non-Functional
- [x] Kiểm tra font chữ tương thích với chữ Hán (Kanji), Hiragana và Katakana mượt mà.
- [x] Định dạng ngày tháng theo tiêu chuẩn Nhật: `2026年12月12日 (土)`.

## Implementation Steps
1. [x] Bước 1: Biên soạn `src/data/wedding-jp.json` khớp hoàn toàn cấu trúc `WeddingData` type.
2. [x] Bước 2: Biên soạn `src/data/locales/jp.ts` thực thi đầy đủ `WeddingLocaleDictionary`.
3. [x] Bước 3: Tạo `src/lib/i18n.ts` chứa helper `getWeddingData(lang)` và `getLocaleDictionary(lang)`.
4. [x] Bước 4: Kiểm tra type check TypeScript đảm bảo khớp 100% interface `WeddingLocaleDictionary`.

## Files to Create/Modify
- `src/data/wedding-jp.json` - Dữ liệu cưới phiên bản tiếng Nhật
- `src/data/locales/jp.ts` - Từ điển UI tiếng Nhật
- `src/lib/i18n.ts` - Helper tiện ích chọn dữ liệu theo ngôn ngữ

## Test Criteria
- [ ] Type check TypeScript không báo lỗi thiếu thuộc tính nào giữa `vi.ts` và `jp.ts`.
- [ ] Dữ liệu `wedding-jp.json` parse thành công và khớp kiểu `WeddingData`.

---
Next Phase: [phase-03-routing-metadata-ssr.md](file:///d:/git/wedding-site/plans/261027-1643-japanese-localization/phase-03-routing-metadata-ssr.md)
