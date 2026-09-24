# 📋 HANDOVER DOCUMENT — WEDDING SITE TÚ VĂN & HƯỜNG NGUYỄN

**Thời gian lưu:** 2026-09-24 21:07 (AWF 4.0.2)  
**Trạng thái dự án:** Sẵn sàng Production (0 Lỗi Build — `npm run build` PASS)

---

## 📍 Đang làm & Trạng thái:
- **Tính năng & Fix hoàn thành mới nhất:**
  1. **Đồng bộ ảnh xem trước mạng xã hội (Facebook, Zalo, Twitter, iMessage) sang `TOBI0530.webp` & nhãn thuần Việt "Xem Trước Tin Nhắn":**
     - **Nguyên nhân lệch ảnh trước đó:** Cấu hình cũ khai báo 2 ảnh `og:image` (ảnh động `/api/og` và ảnh tĩnh `TOBI0448.webp`). Zalo chỉ lấy ảnh đầu tiên trong khi Facebook scraper ưu tiên chọn ảnh tĩnh có đuôi file rõ ràng hoặc hiển thị ảnh lưu trong cache. Ngoài ra `og:url` cũ bị Next.js chuẩn hóa dẫn đến Facebook gộp link về trang chủ.
     - **Giải pháp triệt để:** Thống nhất dùng duy nhất ảnh [public/images/TOBI0530.webp](file:///Users/tuvan/Documents/wedding-site/public/images/TOBI0530.webp) cho toàn bộ thẻ OpenGraph và Twitter Card (trong cả `layout.tsx`, `page.tsx` và preview của `share/page.tsx`).
     - **Nhãn thuần Việt trang `/share`:** Đặt nhãn badge mô phỏng là **"Xem Trước Tin Nhắn"** gần gũi, tinh tế và chuẩn tiếng Việt.
     - **Tự động nhận diện Domain hiện tại (Dynamic Domain):** Thay thế domain hardcode bằng `await headers()` (`x-forwarded-host` / `host` / `x-forwarded-proto`), tự động thích ứng chính xác 100% khi chạy trên local, preview Vercel hay bất kỳ tên miền tùy chỉnh (custom domain) nào.
     - **Giữ trọn nội dung cá nhân hóa:** Tiêu đề (`og:title`) và lời mời (`og:description`) vẫn hiển thị đầy đủ tên từng khách mời (vd: *"💌 Thân gửi: [Tên khách]..."*), trong khi hình ảnh đại diện hiển thị đồng bộ 100% trên tất cả các mạng xã hội.
  2. **Đồng bộ cụm 3 nút (Nhạc, Auto-Scroll, BackToTop) & Sửa lỗi BackToTop khi đang cuộn:**
     - **Sửa lỗi BackToTop khi đang Play Scroll:** Khi bấm nút Back To Top, hệ thống gọi `pauseAutoScroll()` và chờ 1 frame để auto-scroll loop dừng hẳn trước khi gọi `window.scrollTo({ top: 0, behavior: "smooth" })`, triệt tiêu hoàn toàn xung đột bị auto-scroll đè vị trí.
     - **Đồng bộ hiển thị với Menu đáy:** Cả thanh `BottomNavigation` và cụm 3 nút FAB góc dưới phải đều cùng xuất hiện đồng thời khi `window.scrollY > 300px` và cùng ẩn đi khi cuộn lên đầu trang.
  2. **Tối ưu hóa hiệu năng toàn diện cho máy yếu & mobile 3G/4G (Performance Optimization):**
     - **Tối ưu hóa ảnh cô dâu (`public/images/bride.webp`):** Nén từ 2.0 MB (4000x6000) xuống 179 KB (720x1080), giảm 91.4% dung lượng mạng và giảm 96.8% RAM giải mã bitmap (từ ~96 MB xuống ~3 MB).
     - **Triệt tiêu Layout Thrashing trong `useAutoScroll.ts`:** Thay thế việc query DOM 4 lần/frame và ép recalculate `scrollHeight` bằng cơ chế Event-driven (`MutationObserver`, `focusin`/`focusout`) và cached metrics.
     - **Triệt tiêu Forced Synchronous Layout trong `WishesSection.tsx`:** Cache `scrollWidth / 3` trong animation loop, ngăn chặn reflow liên tục trên carousel lời chúc.
     - **Tải trễ Album Lightbox (`Gallery.tsx`):** Áp dụng `next/dynamic` cho `Lightbox`, giảm kích thước First Load JS của trang chủ từ **52.3 kB xuống 33.7 kB** (-35.6%).
     - **Giải phóng băng thông lúc mở trang (`MusicController.tsx`):** Đổi sang `preload="none"`, loại bỏ hiện tượng tải trước 6.6 MB MP3 khi chưa mở thiệp.
     - **Loại bỏ font thừa (`layout.tsx`):** Bỏ nạp 2 Google Fonts `Montserrat` (5 weights) và `Great_Vibes`.
     - **Tối ưu CSS cuộn:** Bỏ xung đột `scroll-behavior: smooth` trên `html`, bổ sung `prefers-reduced-motion: reduce`.
  2. **Cập nhật nội dung mốc "2017 – 2022" (`wedding.json` & `CoupleStory.tsx`):**
     - Cập nhật câu chuyện xa cách, trưởng thành và tìm lại nhau: *"Là một khoảng thời gian đủ dài để chúng mình đi qua những năm tháng xa cách, mỗi người một hành trình, một trải nghiệm. Để rồi sau những tháng ngày học tập, trưởng thành và thay đổi, chúng mình lại tìm thấy nhau — bình yên hơn, chín chắn hơn và sẵn sàng viết tiếp câu chuyện của hai người."*
     - Đồng bộ tiêu đề: **Trưởng thành & Tìm lại nhau** và tiêu đề phụ: **Để rồi lại tìm thấy nhau**.
  2. **Cập nhật ảnh Cầu hôn năm 2022 (`CoupleStory.tsx` & `public/images/TOBI0481.webp`):**
     - Đã nén và chuyển đổi [src/images/0481.png](file:///Users/tuvan/Documents/wedding-site/src/images/0481.png) sang WebP tối ưu.
     - Cập nhật mục "Khoảnh khắc cầu hôn" trong [wedding.json](file:///Users/tuvan/Documents/wedding-site/src/data/wedding.json).
  2. **Cập nhật ảnh chân dung Cô dâu mới (`FamilySection.tsx` & `public/images/bride.webp`):**
     - Đã chuyển đổi [src/images/bride.png](file:///Users/tuvan/Documents/wedding-site/src/images/bride.png) sang WebP tối ưu tải nhanh và hiển thị sắc nét trong phần **Hai Bên Gia Đình**.
     - Căn chỉnh tỷ lệ khung ảnh đồng bộ và cân đối với ảnh Chú rể.
  2. **Đổi thứ tự tên Dâu/Rể trong Thư mời (`InvitationSection.tsx`):**
     - **Vu Quy:** *"món quà ý nghĩa nhất dành cho **Hường & Tú**"*
     - **Thành Hôn:** *"món quà ý nghĩa nhất dành cho **Tú & Hường**"*
  2. **Mã QR tinh gọn (Chỉ hiện TÊN & STK) + Hỗ trợ tải trên iPhone (`GiftSection.tsx`, `update-qr.mjs`):**
     - **Thông tin trên ảnh QR:** Chỉ gồm **Tên người nhận** và **Số tài khoản** cùng logo ngân hàng + VietQR/Napas (Hoàn toàn không có dòng số tiền 0đ).
     - **Tải ảnh trên iPhone:** Tích hợp **Web Share API với File** mở menu chia sẻ iOS để chọn **"Lưu hình ảnh"** vào album Photos.
  2. **Ẩn nút "Lưu Vào Lịch" (`EventCard.tsx`):** Loại bỏ nút tải lịch, tối ưu nút "Chỉ Đường (Google Maps)" thành nút hành động duy nhất full-width gọn gàng và dễ thao tác trên mobile.
  3. **Cập nhật nhãn nút menu (`BottomNavigation.tsx`):** Đổi nhãn `RSVP` thành **`Xác Nhận`** đồng bộ thuần Việt với toàn bộ website.
  3. **Ẩn ô nhập lời chúc trong Form Xác nhận tham dự (`RSVPSection.tsx`):**
     - Loại bỏ textarea lời chúc khỏi form RSVP giúp form tinh gọn, nhanh chóng cho khách xác nhận.
     - Khách mời có thể gửi lời chúc qua phần riêng biệt **Sổ Lưu Bút** (`WishesSection.tsx`).
  4. **Sửa lỗi nút Bật/Tắt Nhạc nền (`MusicController.tsx`):**
     - Thêm cờ `userPausedRef` để nhận diện khi người dùng chủ động bấm tắt nhạc.
     - Triệt tiêu hoàn toàn hiện tượng `useEffect` và sự kiện click/touch trên trang kích hoạt phát lại nhạc sau khi người dùng đã tắt.
     - Lắng nghe trực tiếp các sự kiện native `play` / `pause` / `ended` trên thẻ `<audio>`.
  1. **Đổi vị trí Tên Cô Dâu & Chú Rể theo Lễ Vu Quy vs Lễ Thành Hôn:**
     - **Lễ Vu Quy (Nhà Gái - 10.10.2026 hoặc ?event=que):**
       - Tên hiển thị ưu tiên: **Cô Dâu & Chú Rể** (*Hường Nguyễn & Tú Văn* / *Hường & Tú* / *HƯỜNG NGUYỄN & TÚ VĂN*).
       - Monogram & Sáp niêm phong: **H & T**.
       - **Ẩn thông tin chuyển khoản của Chú Rể:** Chỉ hiển thị duy nhất thẻ mừng cưới của Cô Dâu (Hường Nguyễn).
     - **Lễ Thành Hôn (Nhà Trai - 12.12.2026 hoặc ?event=sg):**
       - Tên hiển thị ưu tiên: **Chú Rể & Cô Dâu** (*Tú Văn & Hường Nguyễn* / *Tú & Hường* / *TÚ VĂN & HƯỜNG NGUYỄN*).
       - Monogram & Sáp niêm phong: **T & H**.
       - **Hiện cả 2 thông tin chuyển khoản:** Hiển thị cả Chú Rể (Tú Văn) và Cô Dâu (Hường Nguyễn).
  2. **Đồng bộ hóa toàn diện mọi vị trí trên Website:**
     - Phong bì mở đầu (`WeddingOpening.tsx`)
     - Hero Section (`HeroSection.tsx`)
     - Cột Hai bên gia đình (`FamilySection.tsx`)
     - Sổ lưu bút & Form gửi lời chúc (`WishesSection.tsx`)
     - Hộp mừng cưới QR Banking (`GiftSection.tsx`)
     - Lời cảm ơn chân thành (`ThankYouSection.tsx`)
     - Server Dynamic Metadata SEO & Social Share (`app/page.tsx`)
     - Dynamic Edge Open Graph Image 1200x630 (`app/api/og/route.tsx`)
     - Cổng tạo link cá nhân hóa & Mẫu tin nhắn mời (`app/share/page.tsx`)

---

## 📁 Files Quan Trọng Cần Biết:
- `src/lib/wedding-timeline.ts`: Bộ não điều phối thông minh `getActiveWeddingStage`.
- `src/components/wedding/GiftSection.tsx`: Hộp mừng cưới tự động lọc tài khoản theo sự kiện.
- `src/components/wedding/WeddingOpening.tsx`: Phong bì thư và sáp niêm phong đổi ngôi danh xưng.
- `src/components/wedding/HeroSection.tsx`: Tiêu đề chính trang web với tên xuất hiện theo thứ tự lễ.
- `src/components/wedding/WishesSection.tsx`: Sổ lưu bút & Cinema Wishes Carousel.
- `src/components/wedding/ThankYouSection.tsx`: Chữ ký và dấu ấn kỷ niệm cuối trang.
- `src/app/share/page.tsx`: Cổng quản lý link và tạo tin nhắn gửi khách.

---

## 💡 Hướng Dẫn Session Tiếp Theo:
- Để khôi phục ngữ cảnh làm việc: Gõ `/recap`
- Để triển khai lên môi trường online: Gõ `/deploy`
- Để kiểm tra bảo mật & hiệu năng: Gõ `/audit`
