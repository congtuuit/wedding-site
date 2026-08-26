# 📋 HANDOVER DOCUMENT — WEDDING SITE TÚ VĂN & HƯỜNG NGUYỄN

**Thời gian lưu:** 2026-08-26 23:22 (AWF 4.0.2)  
**Trạng thái dự án:** Sẵn sàng Production (0 Lỗi Build)

---

## 📍 Đang làm & Trạng thái:
- **Tính năng hoàn thành mới nhất:**
  1. **Carousel Lời Chúc (Wishes Section):** Tích hợp chuẩn **Cinema Auto-Scroll Engine (Subpixel Virtual Accumulator 40px/s)**, trôi đều liên tục không giật khựng, vòng lặp vô tận đối xứng 3 chiều (*Triple-Set Loop*), tự dừng 0ms khi chạm/kéo chuột và tự chạy lại sau 2.5s.
  2. **Tự Động Phát Nhạc Trên iOS Safari (iPhone):** Kích hoạt phát nhạc đồng bộ ngay khi bấm nút "Mở Thiệp" trong cùng call stack của user gesture để vượt qua 100% WebKit Autoplay Policy.
  3. **Cụm Media Controls Nổi Dọc Góc Trên Phải:** Nút Bật/Tắt Nhạc ở trên, Nút Bật/Tắt Cuộn Trang ở dưới (kích thước 40–44px touch target, độ mờ nhẹ 75%).
  4. **Favicon & Multi-Platform Dynamic App Icons:** Vector SVG `public/favicon.svg` + `src/app/icon.tsx` (32x32) + `src/app/apple-icon.tsx` (180x180).
  5. **Điều Phối Lịch Trình Đa Sự Kiện Thông Minh:** `src/lib/wedding-timeline.ts` và `src/hooks/useActiveWeddingStage.ts` tự động chuyển đổi thông tin theo ngày tới trước (Nhà Gái 10.10.2026 - Lễ Vu Quy vs Nhà Trai 12.12.2026 - Lễ Thành Hôn).

---

## 📁 Files Quan Trọng Cần Biết:
- `src/components/wedding/WishesSection.tsx`: Sổ lưu bút & Carousel trôi liên tục 40px/s.
- `src/components/wedding/MusicController.tsx`: Trình phát nhạc nền với `forwardRef` và cơ chế tương tác đồng bộ.
- `src/components/wedding/AutoScrollController.tsx`: Nút bấm bật/tắt cuộn trang điện ảnh.
- `src/hooks/useAutoScroll.ts`: Động cơ cuộn trang thông minh (Subpixel accumulator 60/120fps).
- `src/lib/wedding-timeline.ts`: Bộ logic tính toán lịch trình thông minh 10.10 vs 12.12.
- `src/app/share/page.tsx`: Cổng quản lý tạo link cá nhân hóa và giả lập Zalo/Facebook.
- `.brain/brain.json`: Bộ nhớ tri thức vĩnh viễn của dự án.
- `.brain/session.json`: Nhật ký phiên làm việc hiện tại.

---

## 💡 Hướng Dẫn Session Tiếp Theo:
- Để khôi phục nhanh ngữ cảnh làm việc: Gõ `/recap`
- Để triển khai lên môi trường online: Gõ `/deploy`
