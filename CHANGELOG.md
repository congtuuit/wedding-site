# Changelog — Dự Án Thiệp Cưới Tú Văn & Hường Nguyễn

Toàn bộ lịch sử các tính năng, nâng cấp giao diện và tối ưu hóa hệ thống.

---

## [v1.1.0] - 2026-08-25

### ✨ Dynamic SEO & Social Media Share Preview (Added)
- **Server-Side Dynamic Metadata (Next.js 15):** Tách `src/app/page.tsx` thành Server Component và xuất `generateMetadata({ searchParams })` để trích xuất tham số `?to=...`, `?guest=...`, `?k=...` (hỗ trợ cả Base64 Unicode và Plain text có dấu tiếng Việt).
- **Dynamic Open Graph Meta Tags:** Tự động tạo thẻ `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">` tương ứng với từng khách mời khi dán link qua Facebook, Zalo, Telegram, Messenger, iMessage.
- **Tiêu Đề & Lời Nhắn Thân Mật:** Đổi chuẩn danh xưng sang *"Thân gửi: [Tên khách mời]"* trang trọng, ấm cúng.
- **Dynamic OG Image Generator (`/api/og`):** Sử dụng `ImageResponse` từ `next/og` để tự động render ảnh xem trước kích thước chuẩn 1200x630 phong cách hoàng gia, in nổi bật tên khách mời và thông tin ngày cưới.
- **Giả Lập Xem Trước Trên Mạng Xã Hội:** Bổ sung khung mô phỏng trực quan giao diện tin nhắn Zalo / Facebook / Messenger ngay trong trang quản lý tạo link `/share`.

---

## [v1.0.0] - 2026-08-24

### ✨ Tính Năng Mới Thêm Vào (Added)
- **Màn Mở Thiệp Rèm Tách Đôi:** Thanh tiến trình game loading dát vàng ~2.0s kết hợp rèm mở tách trên-dưới (2.2s) kèm 20 điểm sao vàng lấp lánh nghệ thuật.
- **Hiệu Ứng Chữ Mở Đầu Điện Ảnh:** Chuỗi xuất hiện chữ so le 0.4s - 2.2s (Save The Date → Ngày cưới → Tú Văn → & → Hường Nguyễn → Lễ Thành Hôn → Xác Nhận Tham Dự).
- **Thư Viện Lightbox Album Ảnh:** Tích hợp `yet-another-react-lightbox` với thanh thumbnail filmstrip dưới đáy, vuốt chuyển ảnh mượt mà, bộ đếm ảnh và pinch zoom.
- **Hộp Mừng Cưới & Tải Mã VietQR:** Tự động tạo mã VietQR chuẩn liên ngân hàng NAPAS 24/7 (VPBank & Techcombank) kèm tính năng tải ảnh QR về điện thoại/máy tính.
- **Script CLI Tự Động Hóa:** Thêm lệnh `npm run update:qr` để cập nhật ngân hàng, số tài khoản, tên và nội dung chuyển khoản tự động.
- **Nút Back To Top & Menu Dock:** Nút Back to Top mini 36px trượt êm ái về đầu trang + Menu Dock điều hướng nhanh.
- **Tối Ưu Ảnh WebP:** Nén toàn bộ 20 ảnh cưới từ 149.25 MB xuống 6.92 MB (tiết kiệm 95.4% dung lượng) và tự động xoay chuẩn theo góc chụp EXIF.

### 🎨 Cải Tiến Giao Diện & Typography (Changed)
- **Khung Giao Diện Mobile Frame:** Cố định `max-w-[460px]` căn giữa trên màn hình Tablet & Desktop với hiệu ứng đổ bóng sâu và viền nền nhung tối `#0E0204`.
- **Hệ Thống Font Không Chân (Sans-Serif):** Áp dụng `Plus Jakarta Sans` và `Be Vietnam Pro` mang lại phong cách hiện đại, thanh thoát và chuẩn 100% tiếng Việt.
- **Font Thư Pháp Tên Cô Dâu Chú Rể:** Áp dụng `Alex Brush` uyển chuyển, mềm mại và lãng mạn.
- **Phần Hai Bên Gia Đình:** Tinh gọn kích thước font chữ và khoảng cách, giữ 2 cột Nhà Trai & Nhà Gái hiển thị song song ngay ngắn.
- **Tiêu Đề Dòng Thời Gian:** Cập nhật thành *"Hành Trình Yêu Thương"* với nét chữ thanh mảnh (`font-light`).
- **Nút Hành Động QR:** Sắp xếp 2 nút "Sao Chép STK" và "Tải Mã QR" nằm cùng 1 hàng duy nhất trên mọi thiết bị.

### ⚡ Hiệu Suất & Tối Ưu (Performance & Optimization)
- Khóa cứng và tự động reset vị trí cuộn trang về `(0, 0)` khi mở thiệp.
- Kích hoạt GPU Hardware Acceleration (`translate3d`) cho chuyển động 60fps/120fps mượt mà.
- Lưu trữ toàn bộ tri thức dự án vào hệ thống Eternal Memory `.brain/` (AWF 4.0.2).
