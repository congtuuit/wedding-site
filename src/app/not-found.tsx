import Link from "next/link";
import { Heart } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-textMain px-4 text-center select-none">
      <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
        <Heart className="w-7 h-7 fill-accent/30" />
      </div>
      <h1 className="font-playfair text-4xl sm:text-5xl font-normal text-textMain mb-3">
        404 — Không Tìm Thấy Trang
      </h1>
      <p className="font-sans text-sm text-textMuted max-w-md mx-auto mb-8">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi. Hãy quay về trang thiệp cưới chính nhé!
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-all shadow-md active:scale-95"
      >
        Trang Chủ Thiệp Cưới
      </Link>
    </main>
  );
}
