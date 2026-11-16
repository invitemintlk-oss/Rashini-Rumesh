# Connect RSVP & Wishes to Google Sheets

Sheet: https://docs.google.com/spreadsheets/d/1cXNb77L0bonR8-c6xyqbpgczdilRY75FOkGL6PNCB7Y/edit

## 1. Add the script
1. Open the Google Sheet above (signed in with the account that owns it / can edit it).
2. Go to **Extensions → Apps Script**.
3. Delete everything in `Code.gs` and paste the whole of `google-apps-script/code.gs` from this project.
4. Click **Save** (💾).

## 2. Run setup once
1. In the function dropdown at the top, choose **setup** and click **Run**.
2. Click **Review permissions** → choose your Google account → **Advanced** → **Go to (project name)** → **Allow**.
3. Back in the sheet you should now see two tabs, **RSVP** and **WISH**, with green header rows.
4. (Optional) choose **testRsvp** → **Run**. A "Test Guest" row appears in RSVP — delete it afterwards.

## 3. Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the ⚙️ next to "Select type" → **Web app**.
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** and copy the **Web app URL** (it ends with `/exec`).
6. Open that URL in a browser – you should see
   `{"ok":true,"message":"Rashini & Rumesh wedding form endpoint is running."}`

## 4. Put the URL in the website (choose ONE)
**A. Easiest – paste into the code:** open `src/sheets.ts` and set
```ts
const WEB_APP_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec';
```
then commit & push – Vercel redeploys automatically.

**B. Environment variable:**
- Local: create `.env` in the project root with
  `VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXX/exec`
  and restart `npm run dev`.
- Vercel: **Project → Settings → Environment Variables** → add
  `VITE_GOOGLE_APPS_SCRIPT_URL` with the same value → **Redeploy**.

## What gets saved
| Tab  | Columns |
|------|---------|
| RSVP | Timestamp, Name, Phone, Guests, Attendance, Dietary / Special Requests, Invited As (link) |
| WISH | Timestamp, Name, Message |

"Invited As (link)" is the name from the guest's personal invitation link (e.g. *Mr. & Mrs. Perera*),
so you know whose invitation each reply came from.

## Notes
- If you change `code.gs` later: **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
  The URL stays the same.
- Times are saved in Sri Lanka time (Asia/Colombo).
