const express = require('express');
const app = require('./server.js')
const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("../keys/serviceAccountKey");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});






exports.myfirebasefunction= functions.https.onRequest(app);
