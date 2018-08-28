const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const mysql = require("mysql");
const async = require('async');
var connection = require('../../dbconnection');
var admin = require("firebase-admin");
var parentChildInserter = require('./helper/parentChildInserter');

 



app.use(cors());


/* GET home page. */


var ParentChildInserter = new parentChildInserter(); 
var personId;


const validateFirebaseIdToken = async (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');
  
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      res.status(403).send('Unauthorized');
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }
  
    try {
      console.log(idToken);
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      console.log('ID Token correctly decoded', decodedIdToken);
      setPersonValues(decodedIdToken.sub)
      next();
      return;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
      return;
    }
  };
  
  function  setPersonValues(req) {
    //set personId
    personId = req;
    return personId
  }

router.get("/schulzimmer", validateFirebaseIdToken, function (req, res) {
    var sqlTische = "SELECT * FROM ?? t WHERE ?? in (SELECT ?? from ?? s where ?? = ?)";
    var tableTisch = ["tisch","t.SchulzimmerId","s.Id","schulzimmer", "s.PersonId", personId];
    var sqlSchulzimmer = "SELECT * FROM ?? s WHERE ??=?";
    var tableSchulzimmer = ["schulzimmer", "s.PersonId", personId];

    querySchulzimmer = mysql.format(sqlSchulzimmer, tableSchulzimmer);
    queryTische = mysql.format(sqlTische, tableTisch)
    
    var return_data = {};

    async.parallel([
        function(parallel_done) {
            connection.query(querySchulzimmer, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.Schulzimmer = results;
                console.log("Schulzimmer-Query");
                console.log(querySchulzimmer);
                console.log(results);
                parallel_done();
            });
        },
        function(parallel_done) {
            connection.query(queryTische, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.Tische = results;
                console.log("Tisch-Query");
                console.log(queryTische);
                console.log(results);
                parallel_done();
            });
        }
     ], function(err) {
          if (err) console.log(err);
          res.send(return_data);
     });


});

router.post("/schulzimmer", validateFirebaseIdToken, function (req, res) {
    var sqlDeleteTisch = "DELETE FROM ?? WHERE ?? in (SELECT ?? from ??  where ?? = ?)";
    var valuesDeleteTisch = ["tisch","SchulzimmerId","Id","schulzimmer", "PersonId", personId];

    var sqlDeleteSchulzimmer = "DELETE FROM ?? where ?? = ?";
    var valuesDeleteSchulzimmer = ["schulzimmer","PersonId", personId];

    queryDeleteTische = mysql.format(sqlDeleteTisch, valuesDeleteTisch);
    queryDeleteSchulzimmer = mysql.format(sqlDeleteSchulzimmer, valuesDeleteSchulzimmer)


    var queryInsertSchulzimmer = "INSERT INTO schulzimmer (PersonId, Name) VALUES ?";
    var queryInsertTisch = "INSERT INTO tisch (SchulzimmerId,RowNumber,ColumnNumber) VALUES ?";
    var valuesInsertSchulzimmer = [];
    var valuesInsertSchulzimmerWithId = [];

    var valuesInsertTisch = [];

    for(var i = 0; i < req.body.length; i++) {
        var obj = req.body[i];
        valuesInsertSchulzimmer.push(new Array(personId,req.body[i].name));
        valuesInsertSchulzimmerWithId.push(new Array(personId,req.body[i].id, req.body[i].name));
        for(var j=0; j<req.body[i].tische.length; j++){
            valuesInsertTisch.push(new Array(req.body[i].id,req.body[i].tische[j].position.row, req.body[i].tische[j].position.column) );
        }
        console.log("Object:");
        console.log(obj);
    }

    return_data={};
    async.parallel([
        function(parallel_done) {
            connection.query(queryDeleteTische, {}, function(err, results) {
                if (err) return parallel_done(err);
                console.log("Tisch deleted");
                parallel_done();
                
            });

            
        },
        function(parallel_done) {
            connection.query(queryDeleteSchulzimmer, {}, function(err, results) {
                if (err) return parallel_done(err);
                console.log("Schulzimmer deleted");
                parallel_done();
                
            });

            
        }
        
    ], function(err) {
        if (err) console.log(err);
        ParentChildInserter.InsertParentChild(connection, queryInsertSchulzimmer, queryInsertTisch, valuesInsertSchulzimmer,valuesInsertSchulzimmerWithId,valuesInsertTisch)
        res.send(return_data);
   });
   
});

router.get("/schulklasse", validateFirebaseIdToken , function (req, res) {
    var sqlSchueler = "SELECT t.Id, t.SchulklassenId, t.Name, t.Vorname, t.NameKurz FROM ?? t WHERE ?? in (SELECT ?? from ?? s where ?? = ?)";
    var tableSchueler = ["schueler","t.SchulklassenId","s.Id","schulklasse", "s.PersonId", personId];
    var sqlSchulklasse = "SELECT s.Id, s.PersonId, s.Name FROM ?? s WHERE ??=?";
    var tableSchulklasse = ["schulklasse", "s.PersonId", personId];

    querySchulklasse = mysql.format(sqlSchulklasse, tableSchulklasse);
    querySchueler = mysql.format(sqlSchueler, tableSchueler)
    
    var return_data = {};

    async.parallel([
        function(parallel_done) {
            connection.query(querySchulklasse, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.Schulklassen = results;
                console.log("Schulklasse-Query");
                console.log(querySchulklasse);
                console.log(results);
                parallel_done();
            });
        },
        function(parallel_done) {
            connection.query(querySchueler, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.Schueler = results;
                console.log("Schueler-Query");
                console.log(querySchueler);
                console.log(results);
                parallel_done();
            });
        }
     ], function(err) {
          if (err) console.log(err);
          res.send(return_data);
     });


});

router.post("/schulklasse", validateFirebaseIdToken,  function (req, res) {
    var sqlDeleteSchueler = "DELETE FROM ?? WHERE ?? in (SELECT ?? from ??  where ?? = ?)";
    var valuesDeleteSchueler = ["schueler","SchulklassenId","Id","schulklasse", "PersonId", personId];

    var sqlDeleteSchulklasse = "DELETE FROM ?? where ?? = ?";
    var valuesDeleteSchulklasse = ["schulklasse","PersonId", personId];

    queryDeleteSchueler = mysql.format(sqlDeleteSchueler, valuesDeleteSchueler);
    queryDeleteSchulklasse = mysql.format(sqlDeleteSchulklasse, valuesDeleteSchulklasse)


    var queryInsertSchulklasse = "INSERT INTO schulklasse (PersonId, Name) VALUES ?";
    var queryInsertSchueler = "INSERT INTO schueler (SchulklassenId,Name,Vorname, NameKurz) VALUES ?";
    var valuesInsertSchulklasse = [];
    var valuesInsertSchulklasseWithId = [];

    var valuesInsertSchueler= [];

    for(var i = 0; i < req.body.length; i++) {
        var obj = req.body[i];
        valuesInsertSchulklasse.push(new Array(personId,req.body[i].name));
        valuesInsertSchulklasseWithId.push(new Array(personId,req.body[i].id, req.body[i].name));
        for(var j=0; j<req.body[i].schueler.length; j++){
            valuesInsertSchueler.push(new Array(req.body[i].id,req.body[i].schueler[j].name,req.body[i].schueler[j].vorname, req.body[i].schueler[j].nameKurz) );
        }
        console.log("Object:");
        console.log(obj);
    }

    return_data={};
    async.parallel([
        function(parallel_done) {
            connection.query(queryDeleteSchueler, {}, function(err, results) {
                if (err) return parallel_done(err);
                console.log("Schueler deleted");
                parallel_done();
                
            });

            
        },
        function(parallel_done) {
            connection.query(queryDeleteSchulklasse, {}, function(err, results) {
                if (err) return parallel_done(err);
                console.log("Schulklasse deleted");
                parallel_done();
                
            });

            
        }
        
    ], function(err) {
        if (err) console.log(err);
        ParentChildInserter.InsertParentChild(connection, queryInsertSchulklasse, queryInsertSchueler, valuesInsertSchulklasse,valuesInsertSchulklasseWithId,valuesInsertSchueler)
        res.send(return_data);
   });
   
});







module.exports = router;