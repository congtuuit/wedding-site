# Changelog — Dự Án Thiệp Cưới Tú Văn & Hường Nguyễn

Toàn bộ lịch sử các tính năng, nâng cấp giao diện và tối ưu hóa hệ thống.

---

## [v1.2.1] - 2026-09-08

### 🗓️ Tối Ưu Thẻ Sự Kiện (EventCard) (Updated)
- **Ẩn nút "Lưu Vào Lịch":** Loại bỏ nút tải file `.ics` lịch cưới trong thẻ sự kiện ([EventCard.tsx](file:///Users/tuvan/Documents/wedding-site/src/components/wedding/EventCard.tsx)), chuyển nút **"Chỉ Đường (Google Maps)"** thành nút bấm chính full-width trực quan, dễ thao tác.

### 📝 Tinh Gọn Form Xác Nhận Tham Dự & Menu Điều Hướng (Updated)
- **Đổi nhãn Menu:** Đổi chữ `RSVP` trên thanh Menu điều hướng nổi dưới đáy (`BottomNavigation.tsx`) thành tiếng Việt chuẩn: **`Xác Nhận`**.
- **Ẩn ô nhập Lời chúc trong Form RSVP:** Giản lược form xác nhận tham dự thành 3 bước nhanh (Họ tên, Khả năng tham dự, Số lượng người), tách biệt hoàn toàn với phần **Sổ Lưu Bút & Gửi Lời Chúc** (`WishesSection`) phía trên để tránh trùng lặp.

### 🎵 Sửa Lỗi Tắt/Bật Nhạc Nền (Fixed)
- **Khắc phục xung đột Autoplay & User Gesture:** Sửa lỗi nút âm thanh không thể tắt nhạc do `useEffect` tự động kích hoạt lại `play()` khi `isPlaying` chuyển thành `false`.
- **Cơ chế User Paused Intent (`userPausedRef`):** Ghi nhận trạng thái người dùng chủ động tắt nhạc, ngăn chặn các sự kiện chạm màn hình / cuộn trang hoặc chuyển tab tự kích hoạt phát lại nhạc khi người dùng đã bấm tắt.
- **Lắng nghe sự kiện Audio chuẩn native:** Đồng bộ hóa trạng thái nút với các sự kiện `play`, `pause`, `ended` của thẻ `<audio>`.

---

## [v1.2.0] - 2026-08-26

### 🔄 Điều Phối Lịch Trình Đa Sự Kiện Thông Minh (Added)
- **Smart Timeline Stage Resolver:** Tự động phát hiện ngày hiện tại so với 10.10.2026 (Nhà Gái - Lễ Vu Quy tại Lâm Đồng) và 12.12.2026 (Nhà Trai - Lễ Thành Hôn tại TP.HCM).
- Tự động cập nhật tiêu đề bìa thư, huy hiệu nghi lễ, thời gian đếm ngược, thông tin sự kiện, lời ngỏ và ảnh đại diện Open Graph theo sự kiện tới trước.
- **Cổng Tạo Link Chia Sẻ (`/share`):** Hỗ trợ chuyển đổi chọn sự kiện (Vu Quy vs Thành Hôn) để sinh link cá nhân hóa và mẫu tin nhắn tương ứng.

### 📱 Cinema Auto-Scroll Engine & Tối Ưu Mobile (Enhanced)
- **Engine Cuộn Trang Tọa Độ Số Thực (Subpixel Floating Point Accumulator):** Triệt tiêu hoàn toàn hiện tượng khựng/giật giật trên màn hình 120Hz ProMotion của iPhone iOS Safari. Tự động tạm dừng khi nhập form, xem ảnh, chạm tay và tiếp tục sau 8s.
- **Carousel Lời Chúc Tự Động Cuộn Siêu Mượt:** Áp dụng chuẩn Engine cuộn liên tục 40px/s với vòng lặp vô tận 3 chiều (*Triple-Set Loop*), tự dừng 0ms khi chạm tay và tiếp tục sau 2.5s.
- **Cụm Media Controls Nổi Dọc Góc Trên Phải:** Bố cục dọc tinh tế gồm nút Bật/Tắt Nhạc phía trên và nút Bật/Tắt Cuộn Trang phía dưới, kích thước 40-44px touch target với hiệu ứng kính mờ và độ trong suốt 75%.

### 🎵 iOS Safari WebKit Autoplay Fix (Fixed)
- **Kích Hoạt Âm Thanh Đồng Bộ:** Gọi `musicRef.current.play()` trực tiếp trong call stack sự kiện bấm "Mở Thiệp" để vượt qua rào cản chính sách WebKit Autoplay Policy của Apple.
- Thẻ `<audio>` luôn được tải trước và duy trì trong DOM (`preload="auto"`, `playsInline`).

### 🎨 Favicon & Biểu Tượng Ứng Dụng (Added)
- Tạo Vector SVG `public/favicon.svg` với chữ lồng **T ♡ H**, nhẫn vàng 24K và trái tim ruby.
- Sinh động biểu tượng App Icon đa nền tảng qua `src/app/icon.tsx` (32x32) và `src/app/apple-icon.tsx` (180x180 Apple Touch Icon).

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
