const admin = require('firebase-admin');

// OLD Firebase Configuration
const oldServiceAccount = require('./old-firebase-key.json');
const oldApp = admin.initializeApp({
  credential: admin.credential.cert(oldServiceAccount),
  // Nur wenn du die alte projectId explizit angeben willst:
  // projectId: 'your-old-project-id'
}, 'old');

// NEW Firebase Configuration
const newServiceAccount = require('./new-firebase-qual-key.json');
const newApp = admin.initializeApp({
  credential: admin.credential.cert(newServiceAccount),
  projectId: 'meinklassenzimmer-qual'  // Deine neue Project ID
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