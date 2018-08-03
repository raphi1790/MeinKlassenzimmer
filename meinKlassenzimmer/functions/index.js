const express = require('express')
const app = require('./server.js')
const functions = require("firebase-functions");
var admin = require('firebase-admin');



// Initialize Firebase
var config = {
    apiKey: "AIzaSyD-yL-GatpkWfmgyioU-yiFkMiaxYqNZFM",
    authDomain: "meinklassenzimmer-184820.firebaseapp.com",
    projectId: 'meinklassenzimmer-184820',
  };
admin.initializeApp(config);

exports.myfirebasefunction= functions.https.onRequest(app);
