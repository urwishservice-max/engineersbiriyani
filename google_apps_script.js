/**
 * ====================================================================================
 * ENGINEER'S BIRIYANI - GOOGLE APPS SCRIPT WEB APP
 * ====================================================================================
 * Instructions:
 * 1. Open Google Sheets ("Engineer's Biriyani Orders").
 * 2. In the top menu, click: Extensions -> Apps Script.
 * 3. Replace the code in editor with THIS ENTIRE FILE.
 * 4. Click the "Save" (floppy disk) icon.
 * 5. Click "Deploy" -> "Manage deployments".
 * 6. Click the pencil (edit) icon, select Version: "New version", and click "Deploy".
 * ====================================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    // Auto-create and format table header if the sheet is fresh
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Order ID",
        "Date & Time",
        "Customer Name",
        "Phone Number",
        "Delivery Location",
        "Product",
        "Quantity",
        "Total (₹)",
        "Payment Status",
        "Payment Screenshot URL",
        "Direct WhatsApp Link"
      ];
      sheet.appendRow(headers);

      // Beautify headers
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#FFB800");
      headerRange.setFontColor("#000000");
      sheet.setFrozenRows(1);
    }

    var cleanPhone = (data.customerPhone || "").toString().replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }
    var waUrl = cleanPhone ? "https://wa.me/" + cleanPhone : "";

    // Check if this Order ID already exists in Column A to prevent duplicates
    var existingRow = -1;
    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && data.orderId) {
      var orderIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < orderIds.length; i++) {
        if (orderIds[i][0] === data.orderId) {
          existingRow = i + 2;
          break;
        }
      }
    }

    if (existingRow > 0) {
      // UPDATE EXISTING ROW (Prevents Duplicate Rows!)
      sheet.getRange(existingRow, 9).setValue(data.paymentStatus || "PAID & SCREENSHOT_UPLOADED");
      if (data.screenshotUrl) {
        sheet.getRange(existingRow, 10).setValue(data.screenshotUrl);
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, updatedRow: existingRow }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Insert new row
    var newRow = [
      data.orderId || "",
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.customerName || "",
      data.customerPhone || "",
      data.location || "",
      data.productName || "",
      data.quantity || 1,
      data.totalAmount || 0,
      data.paymentStatus || "PAID & SCREENSHOT_UPLOADED",
      data.screenshotUrl || "Pending Upload",
      waUrl
    ];

    sheet.appendRow(newRow);

    // Format new row
    var currentRow = sheet.getLastRow();
    sheet.getRange(currentRow, 1).setFontFamily("Roboto Mono").setFontWeight("bold");
    sheet.getRange(currentRow, 8).setNumberFormat("₹#,##0");

    return ContentService.createTextOutput(JSON.stringify({ success: true, row: currentRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Engineer's Biriyani Google Sheet Webhook is active and running!"
  })).setMimeType(ContentService.MimeType.JSON);
}
