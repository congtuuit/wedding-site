# 📋 HANDOVER DOCUMENT — THIỆP CƯỚI TÚ VĂN & HƯỜNG NGUYỄN

**Ngày lưu:** 26.08.2026 (Phiên bản v1.2.0 - Smart Timeline & Dynamic Event Switching)  
**Trạng thái dự án:** ✅ **Production Ready (100% Hoàn Thiện & Đã Build Thành Công)**  
**Dev Server:** `http://localhost:3000` | **Build:** Next.js 15 App Router

---

## 📍 TỔNG QUAN DỰ ÁN

- **Chú Rể:** Văn Công Tú (Tú Văn), Trưởng Nam. Cha: Ông Văn Công Pha, Mẹ: Bà Trần Thị Thanh Lan. Quê quán: Bà Điểm, TP. HCM.
- **Cô Dâu:** Nguyễn Thị Hường (Hường Nguyễn), Út Nữ. Cha: Ông Nguyễn Văn Dương, Mẹ: Bà Vũ Thị Chinh. Quê quán: Cát Tiên 3, Lâm Đồng.
- **Tiệc 1 (Nhà Gái - Lễ Vu Quy):** 10.10.2026 (Cát Tiên 3, Lâm Đồng).
- **Tiệc 2 (Nhà Trai - Lễ Thành Hôn):** 12.12.2026 (The ADORA Center, Tân Bình, TP. HCM).

---

## 🚀 TÍNH NĂNG MỚI VỪA HOÀN THIỆN: LOGIC NGÀY GIỜ & SỰ KIỆN THÔNG MINH (v1.2.0)

1. **Tự Động Chuyển Đổi Tiến Trình Theo Thời Gian Thực:**
   - **Giai đoạn 1 (Hiện tại -> Hết 10.10.2026):** Tự động hiển thị ngày `10 . 10 . 2026`, tiêu đề `Lễ Vu Quy`, đếm ngược tới `10.10.2026 09:00`, ưu tiên cột Nhà Gái và tab Nhà Gái lên đầu.
   - **Giai đoạn 2 (Từ 11.10.2026 -> Hết 12.12.2026):** Tự động chuyển sang ngày `12 . 12 . 2026`, tiêu đề `Lễ Thành Hôn`, đếm ngược tới `12.12.2026 18:00`, ưu tiên Nhà Trai.
   - **Giai đoạn 3 (Sau 12.12.2026):** Giữ nguyên thông tin sau cùng và thông báo ngày vui trọn vẹn.
2. **Hỗ Trợ Chỉ Định Riêng Trong `/share`:**
   - Tạo link có thể chọn `Tự động`, `Nhà Gái (?event=que)` hoặc `Nhà Trai (?event=sg)`.
   - Cập nhật mẫu tin nhắn và ảnh Open Graph Preview tương ứng.

1. **Hiển Thị Tên Khách & Lời Mời Trên Mạng Xã Hội (Facebook, Zalo, Telegram, Messenger):**
   - Khi gửi đường link ví dụ `https://tu-huong-wedding.vercel.app/?to=RW0gRHV5w6puICsgTlQ=`:
     - **Tiêu đề (OG Title):** `💌 Thân gửi: Em Duyên + NT | Thư Mời Thành Hôn Tú Văn & Hường Nguyễn`
     - **Mô tả (OG Description):** `Trân trọng kính mời Em Duyên + NT đến chung vui trong ngày hạnh phúc của Tú Văn & Hường Nguyễn vào ngày 12.12.2026.`
     - **Ảnh đại diện thiệp (OG Image 1200x630):** Render tự động từ endpoint `/api/og?to=...` với viền vàng dát kim, in hoa chữ **TÚ VĂN & HƯỜNG NGUYỄN** cùng dòng chữ nổi bật **"Thân gửi: Em Duyên + NT"**.
2. **Chuẩn Danh Xưng "Thân gửi":**
   - Đã đồng bộ chữ xưng hô sang `"Thân gửi: [Tên khách]"` trên phong bì, phần lời ngỏ trong thiệp, thẻ metadata và ảnh chia sẻ.
3. **Khung Giả Lập Mạng Xã Hội Trong `/share`:**
   - Trang tạo link đã có khung mô phỏng trực tiếp xem trước hiển thị khi dán link vào Zalo/Messenger/Facebook.

---

## 🧪 HƯỚNG DẪN KIỂM TRA LINK SAU KHI DEPLOY

1. **Facebook Debugger:**
   - Truy cập: `https://developers.facebook.com/tools/debug/`
   - Dán link: `https://tu-huong-wedding.vercel.app/?to=RW0gRHV5w6puICsgTlQ=`
   - Bấm **Scrape Again** để Facebook cập nhật bản preview mới nhất.
2. **Zalo Debugger:**
   - Truy cập: `https://developers.zalo.me/tools/debug-sharing`
   - Dán link và bấm **Kiểm tra** để xem bản hiển thị trên Zalo.
3. **Gửi tin nhắn trực tiếp:**
   - Dán link vào khung chat Zalo / Messenger, thẻ xem trước sẽ tự động xuất hiện.

---

## 📁 CÁC FILE QUAN TRỌNG

- `src/app/page.tsx`: Server Component trích xuất `searchParams` và tạo `generateMetadata`.
- `src/app/api/og/route.tsx`: Edge runtime endpoint sinh ảnh Open Graph 1200x630px.
- `src/components/wedding/WeddingPageClient.tsx`: Toàn bộ tương tác client-side của thiệp cưới.
- `src/components/wedding/InvitationSection.tsx`: Lời ngỏ và danh xưng "Thân gửi".
- `src/app/share/page.tsx`: Trang quản lý tạo link & giả lập chia sẻ.
- `src/data/wedding.json`: Dữ liệu ngày cưới, địa điểm, STK ngân hàng.
- `.brain/`: Eternal context system của Antigravity AWF.
