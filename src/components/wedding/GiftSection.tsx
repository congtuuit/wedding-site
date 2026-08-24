"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WeddingData } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Copy, Check, QrCode, Gift, Download, X } from "lucide-react";

interface GiftSectionProps {
  gift: WeddingData["gift"];
}

export const GiftSection: React.FC<GiftSectionProps> = ({ gift }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<WeddingData["gift"]["accounts"][0] | null>(null);

  const handleCopy = (accountNumber: string, index: number) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 3000);
  };

  const handleDownloadQr = async (qrUrl: string, fileName: string, index?: number) => {
    if (typeof index === "number") {
      setDownloadingIndex(index);
    }
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback direct download
      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = fileName;
      link.target = "_blank";
      link.click();
    } finally {
      setTimeout(() => {
        setDownloadingIndex(null);
      }, 1500);
    }
  };

  return (
    <section id="gift" className="w-full py-16 px-3 sm:px-4 bg-background text-textMain relative">
      <div className="max-w-xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#8C1425]/10 text-[#8C1425] mb-3">
          <Gift className="w-5 h-5" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl text-textMain font-normal tracking-wide mt-1">
          {gift.headline}
        </h2>
        <p className="text-xs text-textMuted font-sans max-w-sm mx-auto mt-2 leading-relaxed">
          {gift.subline}
        </p>

        <SectionDivider variant="botanical" className="my-4" />

        {/* Banking Cards (Clean Vertical Stack inside Mobile Frame) */}
        <div className="flex flex-col gap-5 mt-6">
          {gift.accounts.map((account, index) => {
            const isGroom = account.role === "groom";
            const downloadFileName = isGroom
              ? "QR-Mung-Cuoi-Chu-Re-Tu-Van.png"
              : "QR-Mung-Cuoi-Co-Dau-Huong-Nguyen.png";

            return (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-3xl bg-surface border border-borderLight shadow-[0_4px_24px_rgba(140,20,37,0.05)] hover:shadow-md transition-all duration-300 relative text-center space-y-4"
              >
                {/* Role Badge */}
                <div>
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase ${
                      isGroom
                        ? "bg-[#8C1425]/10 text-[#8C1425]"
                        : "bg-[#D4AF37]/15 text-[#9A7A22]"
                    }`}
                  >
                    {account.title}
                  </span>
                </div>

                {/* QR Code Container (Click to enlarge) */}
                <div
                  onClick={() => setSelectedAccount(account)}
                  className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto p-2.5 rounded-2xl bg-white border border-borderLight shadow-sm cursor-pointer group hover:scale-[1.02] transition-transform"
                >
                  <Image
                    src={account.qrImage}
                    alt={`QR ${account.ownerName}`}
                    fill
                    sizes="208px"
                    className="object-contain p-1"
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-xs font-sans">
                    <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      <QrCode className="w-3.5 h-3.5" />
                      Phóng to
                    </span>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-1 text-sm font-sans">
                  <p className="text-xs text-textMuted uppercase tracking-wider font-medium">
                    {account.bankName}
                  </p>
                  <p className="font-heading text-xl sm:text-2xl font-bold text-[#8C1425] tracking-wider">
                    {account.accountNumber}
                  </p>
                  <p className="text-xs uppercase font-medium text-textMain tracking-wider">
                    Chủ TK: {account.ownerName}
                  </p>
                </div>

                {/* Action Buttons: Copy STK & Download QR (Always 1 Line) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(account.accountNumber, index)}
                    className={`inline-flex items-center justify-center gap-1 py-2 px-2 rounded-full font-sans text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 min-h-[38px] cursor-pointer whitespace-nowrap overflow-hidden ${
                      copiedIndex === index
                        ? "bg-[#8C1425] text-white shadow-md"
                        : "bg-white text-[#8C1425] border border-[#8C1425]/30 hover:bg-[#8C1425]/5 active:scale-95"
                    }`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Đã Chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#8C1425] flex-shrink-0" />
                        <span>Sao Chép STK</span>
                      </>
                    )}
                  </button>

                  {/* Download QR Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadQr(account.qrImage, downloadFileName, index)}
                    className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-full bg-[#8C1425] hover:bg-[#700F1D] text-white font-sans text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md active:scale-95 min-h-[38px] cursor-pointer whitespace-nowrap overflow-hidden"
                  >
                    <Download className={`w-3.5 h-3.5 flex-shrink-0 ${downloadingIndex === index ? "animate-bounce" : ""}`} />
                    <span>{downloadingIndex === index ? "Đang Tải..." : "Tải Mã QR"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Modal Lightbox */}
      {selectedAccount && (
        <div
          onClick={() => setSelectedAccount(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full bg-white p-6 rounded-3xl shadow-2xl text-center space-y-4"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedAccount(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="font-heading text-base text-[#280E12] font-semibold">
              {selectedAccount.title}
            </p>

            <div className="relative w-full aspect-square max-w-[280px] mx-auto p-2.5 bg-white rounded-2xl border border-borderLight shadow-sm">
              <Image
                src={selectedAccount.qrImage}
                alt="QR Code Phóng To"
                fill
                sizes="280px"
                className="object-contain"
              />
            </div>

            <div className="space-y-1 text-xs text-textMuted font-sans">
              <p className="font-semibold text-textMain text-sm">{selectedAccount.bankName}</p>
              <p className="font-mono text-base font-bold text-[#8C1425]">{selectedAccount.accountNumber}</p>
              <p className="uppercase">{selectedAccount.ownerName}</p>
            </div>

            {/* Download Button in Modal */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  handleDownloadQr(
                    selectedAccount.qrImage,
                    selectedAccount.role === "groom"
                      ? "QR-Mung-Cuoi-Chu-Re-Tu-Van.png"
                      : "QR-Mung-Cuoi-Co-Dau-Huong-Nguyen.png"
                  )
                }
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#8C1425] hover:bg-[#700F1D] text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải Mã QR Về Máy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
