// Sends RSVP / wishes to the Google Sheet through the Google Apps Script web app
// (see google-apps-script/code.gs and google-apps-script/SETUP.md).
//
// Hard-coded Web App URL (ends with /exec). It always wins, so an old VITE_GOOGLE_APPS_SCRIPT_URL left
// in .env or Vercel settings (e.g. from another couple's project) can't send RSVPs to the wrong sheet.
const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycby2aBIFOPsLYhIghjEZIESWn0mfqgYkZvjSB43Q6cv1VkDZ9X-VyoZO_LlEwGvOX84/exec';

export const GOOGLE_SCRIPT_URL: string =
  WEB_APP_URL || (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined)?.trim() || '';

export type SheetName = 'RSVP' | 'WISH';

/**
 * Posts one row to the given sheet tab.
 *
 * Uses application/x-www-form-urlencoded (URLSearchParams) so Apps Script receives the fields in
 * `e.parameter`. `no-cors` is required because Apps Script web apps don't return CORS headers, so the
 * response can't be read — a resolved promise means the request reached Google.
 */
export async function sendToSheet(sheet: SheetName, fields: Record<string, string>): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured (see src/sheets.ts).');
  }

  const body = new URLSearchParams({ sheet, ...fields });

  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body,
  });
}
