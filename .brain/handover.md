# 📋 HANDOVER DOCUMENT — THIỆP CƯỚI TÚ VĂN & HƯỜNG NGUYỄN

**Ngày lưu:** 25.08.2026 (Phiên bản v1.1.0 - Dynamic SEO & Full Production)  
**Trạng thái dự án:** ✅ **Production Ready (100% Hoàn Thiện & Đã Build Thành Công)**  
**Dev Server:** `http://localhost:3000` | **Build:** Next.js 15 App Router (Server-Rendered Dynamic Metadata + Static Chunks)

---

## 📍 TỔNG QUAN DỰ ÁN

- **Chú Rể:** Văn Công Tú (Tú Văn), Trưởng Nam. Cha: Ông Văn Công Pha, Mẹ: Bà Trần Thị Thanh Lan. Quê quán: Bà Điểm, TP. HCM.
- **Cô Dâu:** Nguyễn Thị Hường (Hường Nguyễn), Út Nữ. Cha: Ông Nguyễn Văn Dương, Mẹ: Bà Vũ Thị Chinh. Quê quán: Cát Tiên 3, Lâm Đồng.
- **Lễ Gia Tiên & Tiệc Nhà Gái:** 10.10.2026 (Cát Tiên 3, Lâm Đồng).
- **Tiệc Cưới Nhà Trai:** 12.12.2026 (The ADORA Center, 431 Đ. Hoàng Văn Thụ, Tân Bình, TP. HCM).
- **Tài Khoản Chú Rể:** VPBank `38689999996` — `VAN CONG TU` (Memo: `Mung cuoi Tu Van`).
- **Tài Khoản Cô Dâu:** Techcombank `19039619769011` — `NGUYEN THI HUONG` (Memo: `Mung cuoi Huong Nguyen`).

---

## 🚀 TÍNH NĂNG MỚI VỪA HOÀN THIỆN: DYNAMIC SEO & SOCIAL SHARE PREVIEW

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
