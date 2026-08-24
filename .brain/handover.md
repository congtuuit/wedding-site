# 📋 HANDOVER DOCUMENT — THIỆP CƯỚI TÚ VĂN & HƯỜNG NGUYỄN

**Ngày lưu:** 24.08.2026 (Phiên bản v4.0.2 - Full Features)  
**Trạng thái dự án:** ✅ **Production Ready (100% Hoàn Thiện & Đã Kiểm Thử)**  
**Dev Server:** `http://localhost:3000` | **Build:** Next.js 15 App Router (Static Prerender)

---

## 📍 TỔNG QUAN DỰ ÁN

- **Chú Rể:** Văn Công Tú (Tú Văn), Trưởng Nam. Cha: Ông Văn Công Pha, Mẹ: Bà Trần Thị Thanh Lan. Quê quán: Bà Điểm, TP. HCM.
- **Cô Dâu:** Nguyễn Thị Hường (Hường Nguyễn), Út Nữ. Cha: Ông Nguyễn Văn Dương, Mẹ: Bà Vũ Thị Chinh. Quê quán: Cát Tiên 3, Lâm Đồng.
- **Lễ Gia Tiên & Tiệc Nhà Gái:** 10.10.2026 (Cát Tiên 3, Lâm Đồng).
- **Tiệc Cưới Nhà Trai:** 12.12.2026 (TP. Hồ Chí Minh).
- **Tài Khoản Chú Rể:** VPBank `38689999996` — `VAN CONG TU` (Memo: `Mung cuoi Tu Van`).
- **Tài Khoản Cô Dâu:** Techcombank `19039619769011` — `NGUYEN THI HUONG` (Memo: `Mung cuoi Huong Nguyen`).

---

## ✅ CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN XUẤT SẮC

1. **Giao Diện Chuẩn Mobile Viewport (`max-w-[460px]`):**
   - Trên desktop/tablet: Đặt chính giữa màn hình với đổ bóng sang trọng và viền nền nhung tối `#0E0204`.
   - Trên mobile: Tràn viền 100% mượt mà tự nhiên.
2. **Màn Mở Thiệp Điện Ảnh:**
   - Thanh tiến trình loading dát vàng ~2.0s và rèm mở tách đôi trên-dưới (Top-Bottom Split 2.2s).
   - 20 điểm sao vàng lấp lánh nghệ thuật và ánh lụa vàng continuous card shimmer.
3. **Typography Không Chân & Thư Pháp Nghệ Thuật:**
   - Tiêu đề & Nội dung: `Plus Jakarta Sans` & `Be Vietnam Pro` (Font Không Chân hiện đại, chuẩn 100% dấu tiếng Việt).
   - Tên Cô Dâu Chú Rể: `Alex Brush` thư pháp lãng mạn, uyển chuyển.
4. **Hiệu Ứng Chữ Mở Đầu (Hero Staggered Text Reveal):**
   - Xuất hiện lần lượt từ 0.4s đến 2.2s sau khi mở thiệp (Save The Date → Ngày cưới → Chú rể → & → Cô dâu → Lễ Thành Hôn → Xác Nhận Tham Dự).
5. **Album Ảnh Cưới Tạp Chí & Fullscreen Lightbox:**
   - 20 ảnh WebP nén 95.4% giữ trọn độ nét cao và auto-rotate EXIF.
   - Thư viện `yet-another-react-lightbox` hỗ trợ vuốt mượt, thanh thumbnail filmstrip dưới đáy, phóng to 2 ngón (Pinch Zoom) và bộ đếm số ảnh.
6. **Hộp Mừng Cưới & Tải Mã VietQR Chuẩn NAPAS 24/7:**
   - Tự động điền số tài khoản, tên và nội dung chuyển khoản khi quét mã.
   - 2 nút "Sao Chép STK" và "Tải Mã QR" nằm cùng 1 dòng tiện lợi.
   - Popup phóng to kích thước lớn 340px kèm nút tải ảnh về máy.
7. **Script CLI Tự Động Hóa:**
   - Lệnh `npm run update:qr` để cập nhật ngân hàng, số tài khoản, tên chủ tài khoản và nội dung chuyển khoản bất kỳ lúc nào.
8. **Hiệu Suất & Điều Hướng:**
   - 60/120fps GPU acceleration, thanh Menu Dock định vị nhanh, nút Back to Top mini 36px trượt êm về đỉnh trang.

---

## 📁 CÁC FILE QUAN TRỌNG CẦN NHỚ

- `src/data/wedding.json`: Trung tâm lưu trữ toàn bộ dữ liệu (Ngày cưới, tên, lời ngỏ, sự kiện, album ảnh, tài khoản ngân hàng).
- `scripts/update-qr.mjs`: Script CLI cập nhật tài khoản và tải mã VietQR.
- `scripts/optimize-images.mjs`: Script tối ưu hóa nén ảnh WebP bằng Sharp.
- `src/components/wedding/`: Chứa toàn bộ các component giao diện thiệp cưới.
- `.brain/`: Thư mục lưu trữ tri thức dự án vĩnh viễn của Antigravity AWF.

---

## 🚀 GỢI Ý BƯỚC TIẾP THEO
- Deploy dự án lên production (Vercel / Cloudflare Pages / GitHub Pages) bằng lệnh `/deploy`.
- Để khôi phục toàn bộ ngữ cảnh trong session mới: Gõ `/recap`.
