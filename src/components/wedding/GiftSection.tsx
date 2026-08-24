"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WeddingData } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Copy, Check, QrCode, Gift } from "lucide-react";

interface GiftSectionProps {
  gift: WeddingData["gift"];
}

export const GiftSection: React.FC<GiftSectionProps> = ({ gift }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const handleCopy = (accountNumber: string, index: number) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 3000);
  };

  return (
    <section id="gift" className="w-full py-20 px-4 bg-background text-textMain relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8C1425]/10 text-[#8C1425] mb-4">
          <Gift className="w-6 h-6" />
        </div>
        <h2 className="font-playfair text-3xl sm:text-5xl text-textMain font-normal tracking-wide">
          {gift.headline}
        </h2>
        <p className="text-xs sm:text-sm text-textMuted font-sans max-w-md mx-auto mt-3 leading-relaxed">
          {gift.subline}
        </p>

        <SectionDivider variant="botanical" />

        {/* Banking Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {gift.accounts.map((account, index) => {
            const isGroom = account.role === "groom";

            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-surface border border-borderLight shadow-[0_6px_30px_rgba(140,20,37,0.05)] hover:shadow-xl transition-all duration-300 relative text-center space-y-6"
              >
                {/* Title */}
                <span
                  className={`inline-block px-4 py-1 rounded-full text-xs font-sans font-semibold tracking-wider uppercase ${
                    isGroom
                      ? "bg-[#8C1425]/10 text-[#8C1425]"
                      : "bg-[#D4AF37]/15 text-[#9A7A22]"
                  }`}
                >
                  {account.title}
                </span>

                {/* QR Code Container */}
                <div
                  onClick={() => setSelectedQr(account.qrImage)}
                  className="relative w-44 h-44 mx-auto p-2.5 rounded-2xl bg-white border border-borderLight shadow-sm cursor-pointer group hover:scale-105 transition-transform"
                >
                  <Image
                    src={account.qrImage}
                    alt={`QR ${account.ownerName}`}
                    fill
                    sizes="176px"
                    className="object-contain p-1"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-xs font-sans">
                    <span className="flex items-center gap-1.5 bg-black/60 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                      <QrCode className="w-3.5 h-3.5" />
                      Phóng to
                    </span>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-1.5 text-sm font-sans">
                  <p className="text-xs text-textMuted uppercase tracking-wider font-medium">
                    {account.bankName}
                  </p>
                  <p className="font-playfair text-2xl font-semibold text-[#8C1425] tracking-wide">
                    {account.accountNumber}
                  </p>
                  <p className="text-xs uppercase font-medium text-textMain tracking-wider">
                    Chủ TK: {account.ownerName}
                  </p>
                </div>

                {/* Copy Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleCopy(account.accountNumber, index)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 min-h-[44px] cursor-pointer ${
                      copiedIndex === index
                        ? "bg-[#8C1425] text-white shadow-md"
                        : "bg-white text-[#8C1425] border border-[#8C1425]/30 hover:bg-[#8C1425]/5 active:scale-95"
                    }`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã Sao Chép Số Tài Khoản</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#8C1425]" />
                        <span>Sao Chép Số Tài Khoản</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Modal Lightbox */}
      {selectedQr && (
        <div
          onClick={() => setSelectedQr(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-sm w-full bg-white p-6 rounded-3xl shadow-2xl text-center space-y-4">
            <p className="font-playfair text-xl text-[#280E12] font-medium">
              Quét Mã QR Ngân Hàng
            </p>
            <div className="relative w-full aspect-square">
              <Image
                src={selectedQr}
                alt="QR Code Phóng To"
                fill
                sizes="350px"
                className="object-contain"
              />
            </div>
            <p className="text-xs text-textMuted font-sans">
              Chạm vào bất kỳ đâu để đóng
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
