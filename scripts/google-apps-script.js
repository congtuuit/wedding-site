/**
 * GOOGLE APPS SCRIPT - WEDDING RSVP, WISHES & GUEST LINKS API
 * Tác giả: Tú Văn & Hường Nguyễn Wedding Site
 * 
 * HƯỚNG DẪN TRIỂN KHAI / CẬP NHẬT:
 * 1. Mở Google Sheets liên kết của bạn.
 * 2. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Dán đè toàn bộ mã nguồn bên dưới vào file `Code.gs`.
 * 4. Nhấn biểu tượng Lưu (Ctrl + S).
 * 5. Bấm nút "Triển khai" (Deploy) -> "Quản lý bản triển khai" (Manage deployments).
 * 6. Nhấn biểu tượng cây bút (Chỉnh sửa) -> Chọn "Phiên bản: Bản phát hành mới" (New version).
 * 7. Bấm "Triển khai" (Deploy) -> Bấm "Xong" (Done).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa 10s tránh xung đột

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var doc = SpreadsheetApp.getActiveSpreadsheet();

    if (data.type === "RSVP") {
      saveRSVP(doc, data);
    } else if (data.type === "WISH") {
      saveWish(doc, data);
    } else if (data.type === "GUEST_LINK") {
      saveGuestLink(doc, data);
    } else if (data.type === "BULK_GUEST_LINKS") {
      saveBulkGuestLinks(doc, data);
    } else {
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
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "wishes";

    // 1. Lấy danh sách khách mời đã tạo link
    if (action === "guests") {
      return getGuestLinks(doc);
    }

    // 2. Mặc định: Lấy danh sách lời chúc (Sổ lưu bút)
    return getWishesList(doc);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 1. Lưu phản hồi xác nhận tham dự (RSVP)
 */
function saveRSVP(doc, data) {
  var sheetName = "RSVP";
  var sheet = doc.getSheetByName(sheetName);

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
 * 2. Lưu lời chúc phúc (Sổ Lưu Bút)
 */
function saveWish(doc, data) {
  var sheetName = "So_Luu_But";
  var sheet = doc.getSheetByName(sheetName);

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

/**
 * 3. Lưu 1 link khách mời (Danh Sách Khách Mời)
 */
function saveGuestLink(doc, data) {
  var sheet = getOrCreateGuestSheet(doc);
  var submittedTime = data.createdAt ? new Date(data.createdAt) : new Date();
  var name = (data.name || "").trim();
  var link = (data.link || "").trim();

  if (!name) return;

  sheet.appendRow([
    Utilities.formatDate(submittedTime, "GMT+7", "dd/MM/yyyy HH:mm:ss"),
    name,
    link
  ]);
}

/**
 * 4. Lưu hàng loạt link khách mời
 */
function saveBulkGuestLinks(doc, data) {
  var sheet = getOrCreateGuestSheet(doc);
  var list = data.guests || [];
  if (!list || list.length === 0) return;

  var rows = [];
  var now = new Date();
  var timeStr = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm:ss");

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (item.name) {
      rows.push([
        timeStr,
        item.name.trim(),
        (item.link || "").trim()
      ]);
    }
  }

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 3).setValues(rows);
  }
}

/**
 * Lấy danh sách link khách mời từ Sheet
 */
function getGuestLinks(doc) {
  var sheet = doc.getSheetByName("Danh_Sach_Khach_Moi");
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var values = sheet.getDataRange().getValues();
  var guests = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[1]) {
      guests.push({
        id: "guest-" + i,
        createdAt: row[0] ? row[0].toString() : "",
        name: row[1].toString().trim(),
        link: row[2] ? row[2].toString().trim() : ""
      });
    }
  }

  guests.reverse(); // Mới nhất lên đầu

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", data: guests }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Lấy danh sách lời chúc từ Sheet
 */
function getWishesList(doc) {
  var sheet = doc.getSheetByName("So_Luu_But");
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var values = sheet.getDataRange().getValues();
  var wishes = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var timeStr = row[0] ? row[0].toString() : "";
    var sender = row[1] ? row[1].toString().trim() : "";
    var wishText = row[2] ? row[2].toString().trim() : "";

    if (sender && wishText) {
      wishes.push({
        id: "sheet-wish-" + i,
        createdAt: timeStr,
        senderName: sender,
        content: wishText
      });
    }
  }

  wishes.reverse();

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", data: wishes }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Tạo hoặc lấy Sheet Danh_Sach_Khach_Moi
 */
function getOrCreateGuestSheet(doc) {
  var sheetName = "Danh_Sach_Khach_Moi";
  var sheet = doc.getSheetByName(sheetName);

  if (!sheet) {
    sheet = doc.insertSheet(sheetName);
    var headers = [
      "Thời Gian Tạo",
      "Tên Khách Mời",
      "Link Thiệp Mời"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#FCECEE").setFontColor("#8C1425");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(3, 350);
  }

  return sheet;
}
