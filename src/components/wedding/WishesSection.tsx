"use client";

import React, { useState, useEffect } from "react";
import { WishData, getWishes, addWish } from "@/lib/rsvp";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Heart, MessageSquarePlus, Send, Sparkles } from "lucide-react";

interface WishesSectionProps {
  initialGuestName: string;
  isPersonalized: boolean;
  webhookUrl?: string;
}

export const WishesSection: React.FC<WishesSectionProps> = ({
  initialGuestName,
  isPersonalized,
  webhookUrl,
}) => {
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [senderName, setSenderName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);

  useEffect(() => {
    setWishes(getWishes());
    if (isPersonalized && initialGuestName) {
      setSenderName(initialGuestName);
    }
  }, [initialGuestName, isPersonalized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const newWish = await addWish(
      {
        senderName: senderName.trim() || "Khách quý",
        content: content.trim(),
      },
      webhookUrl
    );

    setWishes((prev) => [newWish, ...prev]);
    setContent("");
    setIsSubmitting(false);
    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 4000);
  };

  return (
    <section id="wishes" className="w-full py-20 px-4 bg-surface text-textMain relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-accent font-semibold">
          Sổ Lưu Bút
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide mt-1.5">
          Gửi Lời Chúc Phúc
        </h2>
        <p className="text-xs text-textMuted font-sans max-w-md mx-auto mt-1.5">
          Từng lời chúc của bạn là món quà ý nghĩa nhất cho ngày trọng đại
        </p>

        <SectionDivider variant="botanical" className="my-4" />

        {/* Submit Wish Box */}
        <div className="max-w-xl mx-auto mt-10 p-6 sm:p-8 rounded-3xl bg-background border border-borderLight shadow-sm text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-textMuted mb-1.5">
                Tên của bạn
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-4 py-3 rounded-xl bg-surface border border-borderLight focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-textMain font-sans"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-textMuted mb-1.5">
                Lời chúc gửi tới Tú & Hường
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết lời chúc thân thương tại đây..."
                className="w-full px-4 py-3 rounded-xl bg-surface border border-borderLight focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-textMain font-sans resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {showSuccessBadge ? (
                <span className="text-xs text-accent font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Đã gửi lời chúc thành công!</span>
                </span>
              ) : (
                <span className="text-[11px] text-textMuted font-sans">
                  Lời chúc sẽ hiển thị ngay bên dưới
                </span>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-sans text-xs font-semibold tracking-wider uppercase hover:bg-accent/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 min-h-[44px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Lời Chúc</span>
              </button>
            </div>
          </form>
        </div>

        {/* Wishes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 max-h-[500px] overflow-y-auto pr-1">
          {wishes.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-background border border-borderLight/80 text-left shadow-sm hover:shadow-md transition-shadow relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-serif text-lg text-textMain font-medium">
                  {item.senderName}
                </p>
                <Heart className="w-4 h-4 text-accentGold fill-accentGold/20 flex-shrink-0" />
              </div>
              <p className="font-sans text-xs sm:text-sm text-textMuted leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
