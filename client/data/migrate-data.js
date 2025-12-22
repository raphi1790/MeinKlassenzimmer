const admin = require('firebase-admin');

// === ADJUST ===
// OLD Firebase Configuration
// - Set `oldServiceAccount` to the path of the old project's service account JSON
// - If the old project requires an explicit projectId, uncomment and set it below
const oldServiceAccount = require('./old-firebase-key.json');
const oldApp = admin.initializeApp({
  credential: admin.credential.cert(oldServiceAccount),
  // Nur wenn du die alte projectId explizit angeben willst:
  // projectId: 'your-old-project-id'
}, 'old');

// === ADJUST ===
// NEW Firebase Configuration
// - Replace `new-firebase-prod-key.json` with your new project's service account
// - Update `projectId` to your new Firebase project ID (this is important for Firestore)
const newServiceAccount = require('./new-firebase-prod-key.json');
const newApp = admin.initializeApp({
  credential: admin.credential.cert(newServiceAccount),
  projectId: 'meinklassenzimmer-prod'  // Deine neue Project ID - === ADJUST ===
}, 'new');

const oldDb = oldApp.firestore();
const newDb = newApp.firestore();

async function migrateAndRenameCollection(oldCollectionName, newCollectionName) {
  console.log(`\n📦 Starting migration: ${oldCollectionName} → ${newCollectionName}`);
  
  try {
    const snapshot = await oldDb.collection(oldCollectionName).get();
    
    if (snapshot.empty) {
      console.log(`  ⚠️  No documents found in ${oldCollectionName}`);
      return;
    }
    
    console.log(`  Found ${snapshot.size} documents`);
    
    const batch = newDb.batch();
    let count = 0;
    let batchCount = 0;
    
    for (const doc of snapshot.docs) {
      const docRef = newDb.collection(newCollectionName).doc(doc.id);
      batch.set(docRef, doc.data());
      count++;
      batchCount++;
      
      if (batchCount === 500) {
        await batch.commit();
        console.log(`  ✅ Committed batch (${count} documents so far)`);
        batchCount = 0;
      }
    }
    
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`  ✅ Completed: ${count} documents migrated to ${newCollectionName}`);
  } catch (error) {
    console.error(`  ❌ Error migrating ${oldCollectionName}:`, error);
    throw error;
  }
}

async function listAllCollections() {
  console.log('\n🔍 Discovering collections in old database...');
  try {
    const collections = await oldDb.listCollections();
    const collectionNames = collections.map(col => col.id);
    console.log(`  Found collections: ${collectionNames.join(', ')}`);
    return collectionNames;
  } catch (error) {
    console.error('  ❌ Error listing collections:', error);
    return [];
  }
}

async function migrate() {
  console.log('🚀 Starting Firestore migration...');
  console.log(`📤 From: OLD Firebase Project`);
  // === ADJUST ===
  // Update the printed target project name below for clearer console output if needed.
  // This does NOT affect the actual destination — that is determined by `newServiceAccount` and `projectId` above.
  console.log(`📥 To: meinklassenzimmer-qual\n`);
  
  try {
    // Option 1: Automatically discover and migrate ALL collections
    const collections = await listAllCollections();
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found to migrate');
      process.exit(0);
    }
    
    // Migrate each collection
    // for (const collectionName of collections) {
    //   await migrateAndRenameCollection(collectionName);
    // }
    
    // Option 2: Manually specify collections (comment out Option 1 and uncomment this)

    // === ADJUST ===
    // Collections to migrate:
    // - Edit or add `migrateAndRenameCollection(oldName, newName)` calls for the collections you want to copy.
    // - The second argument `newName` is optional — omit it to keep the same collection name in the target.
    // - Example: await migrateAndRenameCollection('users', 'users_old'); // renames 'users' -> 'users_old'
    // - The script currently migrates `users` to `users_old` as an example below.
    await migrateAndRenameCollection('users', 'users_old');
    // await migrateAndRenameCollection('test');
    // await migrateAndRenameCollection('schulklassen');
    // await migrateAndRenameCollection('klassenlisten');
    // await migrateAndRenameCollection('schulzimmer');
    // await migrateAndRenameCollection('regeln');
    // await migrateAndRenameCollection('sitzordnungen');
  
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('✅ Please verify the data in your Firebase Console');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run migration
migrate();