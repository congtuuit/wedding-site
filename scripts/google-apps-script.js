/**
 * GOOGLE APPS SCRIPT - WEDDING RSVP & WISHES API
 * Tác giả: Tú Văn & Hường Nguyễn Wedding Site
 * 
 * HƯỚNG DẪN TRIỂN KHAI:
 * 1. Mở Google Sheets mới (hoặc Sheet liên kết AppSheet của bạn).
 * 2. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Dán toàn bộ mã nguồn bên dưới vào file `Code.gs`.
 * 4. Nhấn biểu tượng Lưu (Ctrl + S).
 * 5. Bấm nút "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 * 6. Chọn loại: "Ứng dụng web" (Web App).
 *    - Mô tả: Wedding Form API
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me - your_email@gmail.com)
 *    - Người có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG!
 * 7. Bấm "Triển khai" (Deploy) và cấp quyền truy cập khi được hỏi.
 * 8. Copy "URL của ứng dụng web" (Web App URL) và dán vào `webhookUrl` trong `wedding.json`.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa tránh xung đột khi nhiều người gửi cùng lúc

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var doc = SpreadsheetApp.getActiveSpreadsheet();

    if (data.type === "RSVP") {
      saveRSVP(doc, data);
    } else if (data.type === "WISH") {
      saveWish(doc, data);
    } else {
      // Mặc định nếu không có type, lưu theo cấu trúc RSVP
      saveRSVP(doc, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Ghi nhận dữ liệu thành công!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "online", message: "Wedding API đang hoạt động bình thường!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Lưu dữ liệu phản hồi tham dự (RSVP)
 */
function saveRSVP(doc, data) {
  var sheetName = "RSVP";
  var sheet = doc.getSheetByName(sheetName);

  // Tự động tạo Sheet & Tiêu đề cột nếu chưa có
  if (!sheet) {
    sheet = doc.insertSheet(sheetName);
    var headers = [
      "Thời Gian Gửi",
      "Tên Khách Mời",
      "Xác Nhận Tham Dự",
      "Sự Kiện",
      "Số Lượng Khách",
      "Lời Nhắn Gửi"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#FCECEE").setFontColor("#8C1425");
    sheet.setFrozenRows(1);
  }

  var attendingText = (data.attending === "yes" || data.attending === true) ? "Có, sẽ tham dự" : "Rất tiếc, không thể";
  var eventName = data.eventSelected || "Tiệc Cưới";
  var guestCount = data.numberOfGuests || 1;
  var message = data.message || "";
  var submittedTime = data.submittedAt ? new Date(data.submittedAt) : new Date();

  sheet.appendRow([
    Utilities.formatDate(submittedTime, "GMT+7", "dd/MM/yyyy HH:mm:ss"),
    data.guestName || "Khách Quý",
    attendingText,
    eventName,
    guestCount,
    message
  ]);
}

/**
 * Lưu dữ liệu lời chúc (Sổ Lưu Bút)
 */
function saveWish(doc, data) {
  var sheetName = "So_Luu_But";
  var sheet = doc.getSheetByName(sheetName);

  // Tự động tạo Sheet & Tiêu đề cột nếu chưa có
  if (!sheet) {
    sheet = doc.insertSheet(sheetName);
    var headers = [
      "Thời Gian Gửi",
      "Tên Người Gửi",
      "Lời Chúc Phúc"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#FCECEE").setFontColor("#8C1425");
    sheet.setFrozenRows(1);
  }

  var submittedTime = data.createdAt ? new Date(data.createdAt) : new Date();

  sheet.appendRow([
    Utilities.formatDate(submittedTime, "GMT+7", "dd/MM/yyyy HH:mm:ss"),
    data.senderName || "Khách Quý",
    data.content || ""
  ]);
}
