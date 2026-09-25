#!/usr/bin/env node

/**
 * CLI Script: Tự động tải mã VietQR chuẩn và cập nhật thông tin Ngân hàng vào wedding.json
 * 
 * Cách dùng 1 (Interactive Menu):
 *   npm run update:qr
 * 
 * Cách dùng 2 (Truyền tham số nhanh):
 *   node scripts/update-qr.mjs --groom-bank VPBank --groom-acc 38689999996 --groom-name "VAN CONG TU" --groom-memo "Mung cuoi Tu Van" --bride-bank Techcombank --bride-acc 19039619769011 --bride-name "NGUYEN THI HUONG" --bride-memo "Mung cuoi Huong Nguyen" --yes
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const WEDDING_JSON_PATH = path.join(rootDir, "src", "data", "wedding.json");
const IMAGES_DIR = path.join(rootDir, "public", "images");

// Danh bạ ngân hàng Việt Nam phổ biến
const BANK_DIRECTORY = {
  vpb: { code: "VPBank", shortName: "VPB", fullName: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)" },
  vpbank: { code: "VPBank", shortName: "VPB", fullName: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)" },
  tcb: { code: "Techcombank", shortName: "TCB", fullName: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)" },
  techcombank: { code: "Techcombank", shortName: "TCB", fullName: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)" },
  vcb: { code: "Vietcombank", shortName: "VCB", fullName: "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)" },
  vietcombank: { code: "Vietcombank", shortName: "VCB", fullName: "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)" },
  mb: { code: "MBBank", shortName: "MB", fullName: "Ngân hàng TMCP Quân Đội (MBBank)" },
  mbbank: { code: "MBBank", shortName: "MB", fullName: "Ngân hàng TMCP Quân Đội (MBBank)" },
  bidv: { code: "BIDV", shortName: "BIDV", fullName: "Ngân hàng TMCP Đầu Tư và Phát Triển Việt Nam (BIDV)" },
  ctg: { code: "VietinBank", shortName: "CTG", fullName: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)" },
  vietinbank: { code: "VietinBank", shortName: "CTG", fullName: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)" },
  acb: { code: "ACB", shortName: "ACB", fullName: "Ngân hàng TMCP Á Châu (ACB)" },
  tpb: { code: "TPBank", shortName: "TPB", fullName: "Ngân hàng TMCP Tiên Phong (TPBank)" },
  tpbank: { code: "TPBank", shortName: "TPB", fullName: "Ngân hàng TMCP Tiên Phong (TPBank)" },
  stb: { code: "Sacombank", shortName: "STB", fullName: "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)" },
  sacombank: { code: "Sacombank", shortName: "STB", fullName: "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)" },
  vib: { code: "VIB", shortName: "VIB", fullName: "Ngân hàng TMCP Quốc Tế (VIB)" },
  hdb: { code: "HDBank", shortName: "HDB", fullName: "Ngân hàng TMCP Phát Triển TP.HCM (HDBank)" },
  hdbank: { code: "HDBank", shortName: "HDB", fullName: "Ngân hàng TMCP Phát Triển TP.HCM (HDBank)" },
  shb: { code: "SHB", shortName: "SHB", fullName: "Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)" },
  msb: { code: "MSB", shortName: "MSB", fullName: "Ngân hàng TMCP Hàng Hải (MSB)" },
  ocb: { code: "OCB", shortName: "OCB", fullName: "Ngân hàng TMCP Phương Đông (OCB)" },
  cake: { code: "CAKE", shortName: "CAKE", fullName: "Ngân hàng số Cake by VPBank" },
  timo: { code: "TIMO", shortName: "TIMO", fullName: "Ngân hàng số Timo by BVBank" },
};

function getBankInfo(input) {
  const normalized = (input || "").toLowerCase().replace(/[\s-_]/g, "");
  if (BANK_DIRECTORY[normalized]) {
    return BANK_DIRECTORY[normalized];
  }
  return {
    code: input,
    shortName: input,
    fullName: input,
  };
}

async function downloadVietQR(bankCode, accountNumber, accountName, memo, outputPath) {
  const encodedName = encodeURIComponent(accountName.trim());
  const url = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?accountName=${encodedName}`;

  console.log(`⏳ Đang tải mã VietQR: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Không thể tải mã QR từ VietQR (${response.statusText})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const sharp = (await import("sharp")).default;
    const processedBuffer = await sharp(buffer)
      .extract({ left: 0, top: 0, width: 540, height: 585 })
      .extend({ bottom: 20, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer();

    fs.writeFileSync(outputPath, processedBuffer);
    console.log(`✅ Đã lưu ảnh QR (chỉ TÊN & STK) thành công: ${outputPath} (${(processedBuffer.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.log("Sharp process fallback:", err.message);
    fs.writeFileSync(outputPath, buffer);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].substring(2);
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
      parsed[key] = val;
    }
  }
  return parsed;
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("\n=======================================================");
  console.log("  💐 CẬP NHẬT TÀI KHOẢN NGÂN HÀNG & MÃ VIETQR TỰ ĐỘNG  ");
  console.log("=======================================================\n");

  if (!fs.existsSync(WEDDING_JSON_PATH)) {
    console.error(`❌ Không tìm thấy file wedding.json tại: ${WEDDING_JSON_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const weddingData = JSON.parse(fs.readFileSync(WEDDING_JSON_PATH, "utf-8"));
  const existingGroom = weddingData.gift?.accounts?.find((a) => a.role === "groom") || {};
  const existingBride = weddingData.gift?.accounts?.find((a) => a.role === "bride") || {};

  const cliArgs = parseArgs();
  const isAutoYes = cliArgs["yes"] || cliArgs["y"] || false;

  // 1. Groom Info
  console.log("🤵 THÔNG TIN CHÚ RỂ:");
  const groomBankInput = cliArgs["groom-bank"] || (isAutoYes ? (existingGroom.bankCode || "VPBank") : (await prompt(`- Ngân hàng chú rể [${existingGroom.bankCode || "VPBank"}]: `))) || existingGroom.bankCode || "VPBank";
  const groomBank = getBankInfo(groomBankInput);
  const groomAcc = cliArgs["groom-acc"] || (isAutoYes ? (existingGroom.accountNumber || "38689999996") : (await prompt(`- Số tài khoản chú rể [${existingGroom.accountNumber || "38689999996"}]: `))) || existingGroom.accountNumber || "38689999996";
  const groomName = cliArgs["groom-name"] || (isAutoYes ? (existingGroom.ownerName || "VAN CONG TU") : (await prompt(`- Tên chủ tài khoản chú rể [${existingGroom.ownerName || "VAN CONG TU"}]: `))) || existingGroom.ownerName || "VAN CONG TU";
  const groomMemo = cliArgs["groom-memo"] || (isAutoYes ? (existingGroom.memo || "Mung cuoi Tu Huong") : (await prompt(`- Nội dung chuyển khoản mặc định [${existingGroom.memo || "Mung cuoi Tu Huong"}]: `))) || existingGroom.memo || "Mung cuoi Tu Huong";

  // 2. Bride Info
  console.log("\n👰 THÔNG TIN CÔ DÂU:");
  const brideBankInput = cliArgs["bride-bank"] || (isAutoYes ? (existingBride.bankCode || "Techcombank") : (await prompt(`- Ngân hàng cô dâu [${existingBride.bankCode || "Techcombank"}]: `))) || existingBride.bankCode || "Techcombank";
  const brideBank = getBankInfo(brideBankInput);
  const brideAcc = cliArgs["bride-acc"] || (isAutoYes ? (existingBride.accountNumber || "19039619769011") : (await prompt(`- Số tài khoản cô dâu [${existingBride.accountNumber || "19039619769011"}]: `))) || existingBride.accountNumber || "19039619769011";
  const brideName = cliArgs["bride-name"] || (isAutoYes ? (existingBride.ownerName || "NGUYEN THI HUONG") : (await prompt(`- Tên chủ tài khoản cô dâu [${existingBride.ownerName || "NGUYEN THI HUONG"}]: `))) || existingBride.ownerName || "NGUYEN THI HUONG";
  const brideMemo = cliArgs["bride-memo"] || (isAutoYes ? (existingBride.memo || "Mung cuoi Tu Huong") : (await prompt(`- Nội dung chuyển khoản mặc định [${existingBride.memo || "Mung cuoi Tu Huong"}]: `))) || existingBride.memo || "Mung cuoi Tu Huong";

  console.log("\n-------------------------------------------------------");
  console.log("🔄 Đang xử lý tải mã VietQR và cập nhật cơ sở dữ liệu...");

  const groomQrPath = path.join(IMAGES_DIR, "qr-groom.png");
  const brideQrPath = path.join(IMAGES_DIR, "qr-bride.png");

  try {
    await downloadVietQR(groomBank.code, groomAcc, groomName, groomMemo, groomQrPath);
    await downloadVietQR(brideBank.code, brideAcc, brideName, brideMemo, brideQrPath);

    // Cập nhật wedding.json
    weddingData.gift = weddingData.gift || {};
    weddingData.gift.accounts = [
      {
        role: "groom",
        title: "MỪNG CƯỚI CHÚ RỂ",
        ownerName: groomName.toUpperCase(),
        bankName: groomBank.fullName,
        bankCode: groomBank.code,
        accountNumber: groomAcc,
        memo: groomMemo,
        qrImage: "/images/qr-groom.png",
      },
      {
        role: "bride",
        title: "MỪNG CƯỚI CÔ DÂU",
        ownerName: brideName.toUpperCase(),
        bankName: brideBank.fullName,
        bankCode: brideBank.code,
        accountNumber: brideAcc,
        memo: brideMemo,
        qrImage: "/images/qr-bride.png",
      },
    ];

    fs.writeFileSync(WEDDING_JSON_PATH, JSON.stringify(weddingData, null, 2), "utf-8");
    console.log(`\n🎉 ĐÃ CẬP NHẬT THÀNH CÔNG ${WEDDING_JSON_PATH}`);
    console.log("=======================================================\n");
  } catch (err) {
    console.error("❌ Xảy ra lỗi khi tạo mã QR:", err.message);
    process.exit(1);
  }
}

main();
