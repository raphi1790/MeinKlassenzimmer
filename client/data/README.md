Firestore migration instructions
===============================

Purpose
-------
This README explains how to migrate documents from the old Firestore project to the new project using the `migrate-data.js` script in this folder.

Prerequisites
-------------
- Node.js (14+ recommended) installed
- `firebase-admin` installed in the project (run `npm install firebase-admin` from project root or this folder)
- Two service-account JSON files present in this folder (or adjust the paths in the script):
  - `old-firebase-key.json` (service account for the old project)
  - `new-firebase-prod-key.json` (service account for the new project)

Obtaining the service-account JSON keys
--------------------------------------
- Go to the Firebase Console for the project you need a key for: https://console.firebase.google.com/
- Select the project, then open Project Settings (gear icon) → "Service accounts" tab.
- Under "Firebase Admin SDK" click "Generate new private key" and confirm. A JSON file will be downloaded.
- Rename the downloaded file to match the script expectations (for example `old-firebase-key.json` or `new-firebase-prod-key.json`) and place it into the `client/data` folder, or update the `require()` path in `migrate-data.js`.
- Keep these files secret — do NOT commit them to source control. Add them to `.gitignore` if necessary.

Notes on permissions and safety
-------------------------------
- You need a Firebase project role that can create service account keys (Project Owner or Service Account Admin).
- For safer operations consider creating a dedicated service account with limited permissions (only Firestore access) rather than using a wide-scoped owner key.
- If you prefer not to store JSON files in the repo, you can set environment variables or a small config file and modify `migrate-data.js` to read from those instead.

What to change in the script (`migrate-data.js`)
-----------------------------------------------
The script contains clearly marked sections you may need to adjust. Look for comment markers that start with `=== ADJUST ===`.

Key items to review and edit:
- Service account file paths:
  - `oldServiceAccount` — path to old project's service account JSON
  - `newServiceAccount` — path to new project's service account JSON
- New project ID:
  - `projectId` value passed to the new app initialization (example: `meinklassenzimmer-prod`)
- Collections to migrate:
  - The script supports auto-discovery (`listAllCollections()`), or manual migration calls like `migrateAndRenameCollection('users', 'users_old')`.
  - Edit the manual list block to include the collections you want to migrate. The second argument is optional and lets you rename the collection in the target DB.
- Batch size / commit threshold:
  - The script currently commits batches every 500 documents; you can change this number in the script if needed.

Running the migration
---------------------
From the project root:

```bash
cd /Users/raphscho/Documents/Projects/MeinKlassenzimmer
npm install firebase-admin
node client/data/migrate-data.js
```

Or run from the data folder:

```bash
cd /Users/raphscho/Documents/Projects/MeinKlassenzimmer/client/data
npm install firebase-admin
node migrate-data.js
```

Recommendations
---------------
- Run the script first against a non-production target to verify results.
- Backup your data or export important collections before migrating.
- Verify document counts in the Firebase Console after migration.
