# Plan: Japanese Localization for Wedding Index Page (/?lang=jp)
Created: 2026-10-27 16:43:00+07:00
Status: ✅ Complete
Author: Hà (Antigravity Strategy Lead)

## Overview
Xây dựng phiên bản tiếng Nhật hoàn chỉnh cho trang thiệp cưới chính (Index Page `/`) khi có query parameter `?lang=jp`. 
Trước khi áp dụng ngôn ngữ mới, tiến hành **rà soát và refactor toàn bộ text cứng** (hardcoded strings) hiện có trên các component của trang index thành hệ thống Locale Dictionary có type-safe chuẩn mực, tránh phân tán và đảm bảo không phá vỡ giao diện tiếng Việt hiện tại.

## Tech Stack
- Framework: Next.js 15.5.23 (App Router, Server Components + Client Components)
- Styling: TailwindCSS v3 + Custom CSS animations
- Type Safety: TypeScript strict dictionary types (`LocaleDictionary`)
- Data: `src/data/wedding.json` (VI) & `src/data/wedding-jp.json` (JP)
- Metadata: Dynamic Server-Side generateMetadata for OpenGraph / Twitter Cards

## Phases

| Phase | Tên giai đoạn | Status | Tasks | Mô tả chính |
|:---:|:---|:---:|:---:|:---|
| 01 | **Audit & Refactor VI Hardcoded Strings** | ✅ Complete | 6/6 | Rà soát toàn bộ component trang index, tách chuỗi UI cứng vào `src/data/locales/vi.ts`, refactor component sử dụng dictionary |
| 02 | **JP Data & UI Dictionary Setup** | ✅ Complete | 5/5 | Tạo `wedding-jp.json` & `src/data/locales/jp.ts` chuẩn văn phong thiệp cưới truyền thống Nhật Bản |
| 03 | **Routing & SSR Metadata for JP** | ✅ Complete | 4/4 | Xử lý `searchParams.lang=jp` trong `src/app/page.tsx`, sinh metadata/OG tags tiếng Nhật cho SEO & share mạng xã hội |
| 04 | **Component Integration & Language Switcher** | ✅ Complete | 6/6 | Kết nối dữ liệu đa ngôn ngữ vào các section, gắn nút chuyển đổi `VI / JP` bảo lưu param `to` & `event` |
| 05 | **Validation, Typography & QA** | ✅ Complete | 5/5 | Kiểm thử build production, hiển thị typography tiếng Nhật (Kanji/Kana), kiểm tra mobile frame và responsive |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Next steps: `/next`
- Check status: `/status`
