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
    } else if (data.type === "LICH_TRINH") {
      saveLichTrinh(doc, data);
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

    // 2. Lấy lịch trình di chuyển (LICH_TRINH)
    if (action === "lich_trinh") {
      return getLichTrinh(doc);
    }

    // 3. Mặc định: Lấy danh sách lời chúc (Sổ lưu bút)
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

/**
 * 5. Lưu / ghi đè toàn bộ lịch trình (LICH_TRINH)
 * Cấu trúc sheet: ID | Day ID | Day Label | Day Name | Time | Title | Description | Map URL | Category | Cập nhật lúc
 */
function saveLichTrinh(doc, data) {
  var sheetName = "LICH_TRINH";
  var sheet = doc.getSheetByName(sheetName);

  // Tạo sheet mới nếu chưa có
  if (!sheet) {
    sheet = doc.insertSheet(sheetName);
  } else {
    // Xoá toàn bộ dữ liệu cũ (trừ header)
    if (sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
  }

  // Đặt header nếu chưa có
  var headers = [
    "ID",
    "Day ID",
    "Ngày (Label)",
    "Ngày (Tên)",
    "Thời Gian",
    "Tiêu Đề",
    "Mô Tả",
    "Map URL",
    "Loại (Category)",
    "Cập Nhật Lúc"
  ];

  // Ghi header nếu sheet mới hoặc trống
  var firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (!firstRow[0] || firstRow[0].toString().trim() === "") {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#FCECEE")
      .setFontColor("#8C1425");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 80);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 100);
    sheet.setColumnWidth(4, 160);
    sheet.setColumnWidth(5, 80);
    sheet.setColumnWidth(6, 280);
    sheet.setColumnWidth(7, 280);
    sheet.setColumnWidth(8, 260);
    sheet.setColumnWidth(9, 100);
    sheet.setColumnWidth(10, 160);
  }

  // Ghi các dòng dữ liệu
  var events = data.events || [];
  if (events.length === 0) return;

  // Set time column (column 5) to Text format so Google Sheet doesn't auto-convert to Date
  sheet.getRange(2, 5, Math.max(events.length, 1), 1).setNumberFormat("@");

  var now = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  var rows = events.map(function(ev) {
    return [
      ev.id || "",
      ev.dayId || "",
      ev.dayLabel || "",
      ev.dayName || "",
      "'" + (ev.time || ""), // Prefix single quote to force text
      ev.title || "",
      ev.description || "",
      ev.mapUrl || "",
      ev.category || "",
      now
    ];
  });

  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

/**
 * Đọc lịch trình từ sheet LICH_TRINH
 */
function getLichTrinh(doc) {
  var sheet = doc.getSheetByName("LICH_TRINH");
  if (!sheet || sheet.getLastRow() < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Get display values instead of raw Date objects for clean HH:mm formatting
  var values = sheet.getDataRange().getDisplayValues();
  var events = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[0]) { // Có ID
      var timeStr = row[4] ? row[4].toString().trim() : "";
      // If timeStr starts with single quote, strip it
      if (timeStr.startsWith("'")) timeStr = timeStr.substring(1);

      events.push({
        id:          row[0] ? row[0].toString().trim() : "",
        dayId:       row[1] ? row[1].toString().trim() : "",
        dayLabel:    row[2] ? row[2].toString().trim() : "",
        dayName:     row[3] ? row[3].toString().trim() : "",
        time:        timeStr,
        title:       row[5] ? row[5].toString().trim() : "",
        description: row[6] ? row[6].toString().trim() : "",
        mapUrl:      row[7] ? row[7].toString().trim() : "",
        category:    row[8] ? row[8].toString().trim() : "travel",
        updatedAt:   row[9] ? row[9].toString() : ""
      });
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", data: events }))
    .setMimeType(ContentService.MimeType.JSON);
}
