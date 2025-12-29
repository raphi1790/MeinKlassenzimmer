# MeinKlassenzimmer

## Introduction

MeinKlassenzimmer is a web application to manage classroom seating, student lists, rules and class layouts. The frontend is an Angular app located in the `client` folder and is hosted on Firebase Hosting. The project includes local emulator support and GitHub Actions workflows to deploy to qualification (`qual`) and production (`prod`) Firebase projects.

## Prerequisites
- **Node:** Install Node.js 22.x (tested with Node 22)
- **Firebase CLI:** Install `firebase-tools` (for emulators and deploys)
- **npm / pnpm / yarn:** Use `npm` (commands below use `npm`)

## Quick links
- **Frontend source:** [client](client)
- **Data migration helper:** [client/data/README.md](client/data/README.md)
- **Firebase config:** [firebase.json](firebase.json)
- **Deployment workflow:** [.github/workflows/deployment.yml](.github/workflows/deployment.yml)

## Run locally

### 1) Install dependencies for the frontend

```bash
cd client
npm ci
```

### 2) Build/watch in development

```bash
npx ng build --configuration=development --watch
```

If you need the `qual` environment (e.g., to test authentication flows):

```bash
npx ng build --configuration=qual --watch
```

### 3) Start Firebase emulators (Firestore / Auth if configured)

```bash
firebase emulators:start
```

### Notes
- The app's built output is written to `client/dist/browser` (see `firebase.json`).
- Use `npm run build` from `client` for the production build step when running CI locally.

## Deploying with GitHub Actions

This repo includes a manual deploy workflow at `.github/workflows/deployment.yml`. The workflow is designed to deploy a tagged commit to either the `qual` or `prod` Firebase project.

### Setup required in GitHub
- Create two Environments in the repository settings: `qual` and `prod`.
- For each environment add a secret named `FIREBASE_SA` containing the JSON service account key.
- Add a repository variable `FIREBASE_PROJECT_ID` (or set per-environment as needed) with the target Firebase project id.

### How the workflow works (summary)
- The workflow is triggered manually (`workflow_dispatch`) and expects `tag` and `environment` inputs.
- It checks out the repository at the provided tag, sets up Node 22, installs dependencies in `client`, injects the deploy tag into `src/environments/environment.prod.ts`, builds the Angular app, and runs `npx firebase-tools deploy --project "$PROJECT_ID" --only hosting` using the provided service account.

See the workflow file for full steps: [.github/workflows/deployment.yml](.github/workflows/deployment.yml)

## Hosting

- Firebase Hosting is configured to serve the Angular build output from `client/dist/browser` (see [firebase.json](firebase.json)).

## Firestore Security (production)

When deploying to production, secure your Firestore database using the rule set below. The project includes a migration collection `users_old` which is used only during migration; it should be read-only for users.

### Recommended production rules (apply in the Firebase console or include in your rules file)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 1. MAIN USER DATA
    // A user can only read/write their own document in the 'users' collection.
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 2. MIGRATION DATA (users_old)
    // AuthService may query this collection by email during login.
    match /users_old/{docId} {
      allow read: if request.auth != null && request.auth.token.email == resource.data.email;
      allow write: if false; // Old data should be read-only
    }

    // 3. GLOBAL SAFETY NET
    // Deny all other access to any other collections by default.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Important production notes
- Ensure your Firebase Authentication is configured and only verified accounts can access data.
- Test security rules locally using the Firebase Emulator Suite and the `emulators` UI before applying to production.

## Where to look in this repo
- Client app & build: [client](client)
- Firebase hosting config: [firebase.json](firebase.json)
- GitHub Actions workflow: [.github/workflows/deployment.yml](.github/workflows/deployment.yml)




