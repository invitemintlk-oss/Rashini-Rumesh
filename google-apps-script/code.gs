/**
 * Rashini & Rumesh – Wedding RSVP & Wishes → Google Sheets
 *
 * Sheet: https://docs.google.com/spreadsheets/d/1cXNb77L0bonR8-c6xyqbpgczdilRY75FOkGL6PNCB7Y/edit
 *
 * The website POSTs form fields (application/x-www-form-urlencoded) with a `sheet` field:
 *   sheet=RSVP → one row in the "RSVP" tab
 *   sheet=WISH → one row in the "WISH" tab
 *
 * Setup steps: see google-apps-script/SETUP.md
 */

const SPREADSHEET_ID = '1cXNb77L0bonR8-c6xyqbpgczdilRY75FOkGL6PNCB7Y';
const TIME_ZONE = 'Asia/Colombo';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Name', 'Phone', 'Guests', 'Attendance', 'Dietary / Special Requests', 'Invited As (link)'],
    widths: [170, 220, 140, 80, 160, 300, 200],
    row: (p) => [
      now_(),
      clean_(p.name),
      // leading apostrophe keeps phone numbers like 0771234567 as text (no lost leading zero)
      p.phone ? "'" + String(p.phone).trim().slice(0, 30) : '',
      clean_(p.guests),
      clean_(p.attendance),
      clean_(p.dietaryRestrictions),
      clean_(p.invitedAs),
    ],
  },
  WISH: {
    name: 'WISH',
    headers: ['Timestamp', 'Name', 'Message'],
    widths: [170, 220, 500],
    row: (p) => [now_(), clean_(p.name), clean_(p.message)],
  },
};

/** Receives form submissions from the website. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // avoid two guests writing to the same row at the same moment

    const payload = parsePayload_(e);
    const key = String(payload.sheet || '').toUpperCase();
    const config = SHEETS[key];
    if (!config) {
      return json_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
    }
    if (!clean_(payload.name)) {
      return json_({ ok: false, error: 'Name is required.' });
    }

    const sheet = prepareSheet_(SpreadsheetApp.openById(SPREADSHEET_ID), config);
    sheet.appendRow(config.row(payload));

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    try { lock.releaseLock(); } catch (_ignored) {}
  }
}

/** Open the Web App URL in a browser to check it is running. */
function doGet() {
  return json_({ ok: true, message: 'Rashini & Rumesh wedding form endpoint is running.' });
}

/**
 * Run this once from the Apps Script editor (select "setup" → Run).
 * It asks for permission, creates the RSVP and WISH tabs, and adds the header rows.
 */
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach((k) => prepareSheet_(ss, SHEETS[k]));
  Logger.log('Ready: ' + ss.getName() + ' → tabs RSVP and WISH');
}

/** Optional: run from the editor to add a test row and confirm everything works. */
function testRsvp() {
  const res = doPost({
    parameter: {
      sheet: 'RSVP',
      name: 'Test Guest',
      phone: '0771234567',
      guests: '2',
      attendance: 'Joyfully Accept',
      dietaryRestrictions: 'Test row – you can delete this',
      invitedAs: 'Mr. Test',
    },
  });
  Logger.log(res.getContent());
}

/* ---------------- helpers ---------------- */

function prepareSheet_(ss, config) {
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) sheet = ss.insertSheet(config.name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
    const header = sheet.getRange(1, 1, 1, config.headers.length);
    header
      .setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground('#145c3c')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    config.widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, config.headers.length).setWrap(true).setVerticalAlignment('top');
  }
  return sheet;
}

function now_() {
  return Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
}

/** Trim, limit length, and stop values being treated as spreadsheet formulas. */
function clean_(value) {
  let s = String(value == null ? '' : value).trim().slice(0, 1000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function parsePayload_(e) {
  const params = (e && e.parameter) || {};
  if (Object.keys(params).length > 0) return params;

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};

  if (contents.charAt(0) === '{') {
    try {
      return JSON.parse(contents);
    } catch (_error) {
      return {};
    }
  }
  return parseQueryString_(contents);
}

function parseQueryString_(query) {
  const out = {};
  String(query).split('&').forEach((part) => {
    if (!part) return;
    const idx = part.indexOf('=');
    const key = decodeURIComponent((idx >= 0 ? part.slice(0, idx) : part).replace(/\+/g, ' '));
    const value = decodeURIComponent((idx >= 0 ? part.slice(idx + 1) : '').replace(/\+/g, ' '));
    out[key] = value;
  });
  return out;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
