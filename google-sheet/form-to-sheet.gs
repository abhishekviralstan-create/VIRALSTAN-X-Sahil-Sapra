/**
 * Saves every "Free clinic audit" form submission as a new row in this Google Sheet.
 * The sheet can be downloaded as Excel any time: File → Download → Microsoft Excel (.xlsx).
 *
 * Setup (one time, about 5 minutes):
 * 1. Create a new Google Sheet (e.g. "Clinic Leads").
 * 2. In the sheet: Extensions → Apps Script. Delete the sample code and paste this whole file. Save.
 * 3. Click Deploy → New deployment → gear icon → "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy and allow the permissions it asks for.
 * 4. Copy the "Web app URL" (ends with /exec) and paste it into
 *    src/data/content.js → CONTACT.sheetUrl. Rebuild / redeploy the website.
 *
 * If you change this script later, use Deploy → Manage deployments → Edit → New version,
 * so the same URL keeps working.
 */

const SHEET_NAME = "Leads";
const HEADERS = [
  "Date & Time",
  "Name",
  "Clinic & City",
  "Phone / WhatsApp",
  "Speciality",
  "Services needed",
  "Source page",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#ede9fe");
      sheet.setFrozenRows(1);
    }

    const p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      asText(p.name),
      asText(p.clinic),
      asText(p.phone),
      asText(p.speciality),
      asText(p.goals),
      asText(p.page),
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Store user input as plain text: keeps "+91..." phone numbers intact and
// stops anything starting with = + - @ from being run as a spreadsheet formula.
function asText(value) {
  const v = String(value || "").trim().slice(0, 500);
  return v ? "'" + v : "";
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
