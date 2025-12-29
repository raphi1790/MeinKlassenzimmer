# Data migration helper

This folder contains a small migration script `migrate-data.js` to copy Firestore collections from one Firebase project to another using the Firebase Admin SDK.

## What the script does
- Connects to an **old** Firebase project and a **new** Firebase project using service account JSON keys.
- Optionally discovers collections in the old project and copies documents to the new project's Firestore.
- Copies documents in batches (commits every 500 writes) to avoid exceeding write limits.
- Allows renaming collections during copy (e.g. copy `users` → `users_old`).

## Prerequisites
- Node.js (v16+ recommended, Node 22 is used in this repo)
- `firebase-admin` (the script requires this; the repo likely already has it in global/node_modules but you can install locally)
- Service account JSON key files for **both** source and target Firebase projects. You must have a service account key file for every project involved in the migration.

Place the JSON key files in this folder. Example filenames used in the script:
- `old-firebase-key.json` — service account for the source (old) project
- `new-firebase-prod-key.json` — service account for the destination (new) project

## How to call the script

1. Inspect and edit `migrate-data.js` to point to the correct service account filenames and (if needed) set the `projectId` for the new app. The script currently contains `// === ADJUST ===` markers where you should adjust values.

2. (Optional) Install dependencies locally in this folder:

```bash
cd client/data
npm ci
npm install firebase-admin --save
```

3. Run the migration:

```bash
cd client/data
node migrate-data.js
```

The script prints discovered collections and progress messages. By default the example migrates the `users` collection to `users_old` — edit the `migrate()` function to change which collections are migrated (the file contains commented examples).

## Important notes and safety
- You must provide valid service account keys for every project you connect to — the script authenticates with those JSON files.
- Verify `projectId` for the destination project in the script; an incorrect `projectId` may write to the wrong Firestore instance.
- The script performs write operations to the destination project; consider running it against a test/qual project first.
- Use the Firebase Emulator Suite to test locally where possible, but be aware the Admin SDK requires service account credentials for real projects.
- Always back up source data or test on a small subset before migrating everything.