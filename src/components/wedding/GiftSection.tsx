"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WeddingData } from "@/types/wedding";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Copy, Check, QrCode, Gift, Download, X } from "lucide-react";
import { generateBankingMemo } from "@/lib/banking";

interface GiftSectionProps {
  gift: WeddingData["gift"];
  stageKey?: "que" | "sg";
  guestName?: string;
}

interface SelectedModalData {
  account: WeddingData["gift"]["accounts"][0];
  qrSrc: string;
  memo: string;
}

export const GiftSection: React.FC<GiftSectionProps> = ({
  gift,
  stageKey = "sg",
  guestName,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedMemoIndex, setCopiedMemoIndex] = useState<number | null>(null);
  const [copiedModalMemo, setCopiedModalMemo] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<SelectedModalData | null>(null);

  const isVuQuy = stageKey === "que";
  const displayAccounts = gift.accounts.filter((account) => {
    if (isVuQuy) {
      // Lễ Vu Quy: Ẩn thông tin chuyển khoản của Chú Rể, chỉ hiển thị Cô Dâu
      return account.role !== "groom";
    }
    // Lễ Thành Hôn: Hiện cả 2 thông tin chuyển khoản (Chú Rể & Cô Dâu)
    return true;
  });

  const isPersonalized = Boolean(
    guestName && guestName !== "Bạn & Người Thương" && guestName.trim() !== ""
  );

  const handleCopy = (text: string, onSuccess: () => void) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    onSuccess();
  };

  const handleCopyAccount = (accountNumber: string, index: number) => {
    handleCopy(accountNumber, () => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 3000);
    });
  };

  const handleCopyMemo = (memo: string, index: number) => {
    handleCopy(memo, () => {
      setCopiedMemoIndex(index);
      setTimeout(() => setCopiedMemoIndex(null), 3000);
    });
  };

  const handleCopyModalMemo = (memo: string) => {
    handleCopy(memo, () => {
      setCopiedModalMemo(true);
      setTimeout(() => setCopiedModalMemo(false), 3000);
    });
  };

  const handleDownloadQr = async (
    qrUrl: string,
    fileName: string,
    index?: number,
  ) => {
    if (typeof index === "number") {
      setDownloadingIndex(index);
    }
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();

      // 1. Web Share API with File (Optimized for iPhone / iOS Safari — opens Native Share Sheet with "Lưu hình ảnh" / Save Image)
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        typeof File !== "undefined"
      ) {
        try {
          const file = new File([blob], fileName, {
            type: blob.type || "image/png",
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Mã QR Mừng Cưới",
              text: "Mã QR Mừng Cưới Tú Văn & Hường Nguyễn",
            });
            return;
          }
        } catch (shareErr) {
          // If the user dismissed or cancelled the share sheet, return gracefully
          if (shareErr instanceof Error && shareErr.name === "AbortError") {
            return;
          }
          console.log("Web Share API fallback:", shareErr);
        }
      }

      // 2. Standard Blob Link Download (Desktop & Android)
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 3. Fallback for iOS Safari when <a> download is ignored by WebKit
      const isIOS =
        typeof window !== "undefined" &&
        (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

      if (isIOS) {
        window.open(blobUrl, "_blank");
      }

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 3000);
    } catch (err) {
      console.error("QR Download fallback:", err);
      // Fallback direct link
      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = fileName;
      link.target = "_blank";
      link.click();
    } finally {
      setTimeout(() => {
        setDownloadingIndex(null);
      }, 1000);
    }
  };

  return (
    <section
      id="gift"
      className="w-full py-16 px-3 sm:px-4 bg-background text-textMain relative"
    >
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
          {displayAccounts.map((account, index) => {
            const isGroom = account.role === "groom";
            const downloadFileName = isGroom
              ? "QR-Mung-Cuoi-Chu-Re-Tu-Van.png"
              : "QR-Mung-Cuoi-Co-Dau-Huong-Nguyen.png";

            const memo = generateBankingMemo(
              account.memo,
              guestName,
              account.role as "groom" | "bride",
              (account as { memoTemplate?: string }).memoTemplate
            );

            const qrVersion = gift.qrVersion || "1";
            const qrSrc = isPersonalized
              ? `/api/qr?role=${account.role}&guest=${encodeURIComponent(guestName!.trim())}&v=${qrVersion}`
              : account.qrImage;

            return (
              <div
                key={account.accountNumber || index}
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
                  onClick={() =>
                    setSelectedAccount({
                      account,
                      qrSrc,
                      memo,
                    })
                  }
                  className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto p-2.5 rounded-2xl bg-white border border-borderLight shadow-sm cursor-pointer group hover:scale-[1.02] transition-transform"
                >
                  <Image
                    src={qrSrc}
                    alt={`QR ${account.ownerName}`}
                    fill
                    sizes="208px"
                    className="object-contain p-1"
                    unoptimized={isPersonalized}
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-xs font-sans">
                    <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
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
                  <p className="font-heading text-xl sm:text-2xl font-bold text-[#8C1425] tracking-wider">
                    {account.accountNumber}
                  </p>
                  <p className="text-xs uppercase font-medium text-textMain tracking-wider">
                    Chủ TK: {account.ownerName}
                  </p>

                  {/* Personalized Banking Memo Info */}
                  <div className="mt-3 pt-2.5 border-t border-borderLight/80 flex items-center justify-between text-xs bg-[#8C1425]/[0.03] border border-[#8C1425]/10 rounded-2xl px-3 py-2">
                    <div className="text-left overflow-hidden mr-2">
                      <span className="text-[10px] uppercase tracking-wider text-textMuted font-medium block">
                        Nội dung CK:
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#8C1425] truncate block">
                        {memo}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyMemo(memo, index)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#8C1425] hover:text-[#700F1D] font-semibold bg-white border border-[#8C1425]/20 hover:border-[#8C1425]/40 px-2.5 py-1 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
                    >
                      {copiedMemoIndex === index ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#8C1425]" />
                          <span>Chép ND</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Copy STK & Download QR (Always 1 Line) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(account.accountNumber, index)}
                    className={`inline-flex items-center justify-center gap-1 py-2 px-2 rounded-full font-sans text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 min-h-[38px] cursor-pointer whitespace-nowrap overflow-hidden ${
                      copiedIndex === index
                        ? "bg-[#8C1425] text-white shadow-md"
                        : "bg-white text-[#8C1425] border border-[#8C1425]/30 hover:bg-[#8C1425]/5 active:scale-95"
                    }`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Đã Chép STK</span>
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
                    onClick={() =>
                      handleDownloadQr(qrSrc, downloadFileName, index)
                    }
                    className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-full bg-[#8C1425] hover:bg-[#700F1D] text-white font-sans text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md active:scale-95 min-h-[38px] cursor-pointer whitespace-nowrap overflow-hidden"
                  >
                    <Download
                      className={`w-3.5 h-3.5 flex-shrink-0 ${downloadingIndex === index ? "animate-bounce" : ""}`}
                    />
                    <span>
                      {downloadingIndex === index ? "Đang Tải..." : "Tải Mã QR"}
                    </span>
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
              {selectedAccount.account.title}
            </p>

            <div className="relative w-full aspect-square max-w-[280px] mx-auto p-2.5 bg-white rounded-2xl border border-borderLight shadow-sm">
              <Image
                src={selectedAccount.qrSrc}
                alt="QR Code Phóng To"
                fill
                sizes="280px"
                className="object-contain"
                unoptimized={isPersonalized}
              />
            </div>

            <div className="space-y-1 text-xs text-textMuted font-sans">
              <p className="font-semibold text-textMain text-sm">
                {selectedAccount.account.bankName}
              </p>
              <p className="font-mono text-base font-bold text-[#8C1425]">
                {selectedAccount.account.accountNumber}
              </p>
              <p className="uppercase">{selectedAccount.account.ownerName}</p>

              {/* Personalized Memo in Modal */}
              <div className="mt-3 pt-2 border-t border-borderLight/80 flex items-center justify-between text-xs bg-[#8C1425]/[0.03] border border-[#8C1425]/10 rounded-2xl px-3 py-2">
                <div className="text-left overflow-hidden mr-2">
                  <span className="text-[10px] uppercase tracking-wider text-textMuted font-medium block">
                    Nội dung CK:
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#8C1425] truncate block">
                    {selectedAccount.memo}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyModalMemo(selectedAccount.memo)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#8C1425] hover:text-[#700F1D] font-semibold bg-white border border-[#8C1425]/20 px-2.5 py-1 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {copiedModalMemo ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#8C1425]" />
                      <span>Chép ND</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Download Button in Modal */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleDownloadQr(
                    selectedAccount.qrSrc,
                    selectedAccount.account.role === "groom"
                      ? "QR-Mung-Cuoi-Chu-Re-Tu-Van.png"
                      : "QR-Mung-Cuoi-Co-Dau-Huong-Nguyen.png",
                  )
                }
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#8C1425] hover:bg-[#700F1D] text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải Mã QR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

