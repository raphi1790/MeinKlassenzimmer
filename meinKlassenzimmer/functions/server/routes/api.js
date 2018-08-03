const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const mysql = require("mysql");
const jwtDecode = require('jwt-decode');
const async = require('async');
var connection = require('../../dbconnection');
var parentChildInserter = require('./helper/parentChildInserter');


app.use(cors());
/* GET home page. */

var persondId;
var ParentChildInserter = new parentChildInserter(); 



const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://meinklassenzimmer.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'https://api.meinKlassenzimmer.ch',
    issuer: `https://meinklassenzimmer.auth0.com/`,
    algorithms: ['RS256'],
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            setPersonValues(req);
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }

});

function  setPersonValues(req) {
    //set personId
    var personIdSub;
    var personIdArray;
    personIdSub = jwtDecode(req.headers.authorization.split(' ')[1]).sub;
    personIdArray = personIdSub.split("|").map(val => String(val));
    personId = personIdArray[1];

}


const checkScopes = jwtAuthz(['admin:admin']);

router.get('/public', function (req, res) {
    res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
});

router.get('/private', checkJwt, checkScopes, function (req, res) {
    res.json({ message: "Hello from a private endpoint! You need to be authenticated and have a scope of admin:admin to see this." });
});


router.get("/", function (req, res) {
    res.json({ "Message": "Hello World !" });
});

router.get("/person", checkJwt, function (req, res) {
    var query = "SELECT * FROM  Person WHERE PersonId =?";
    var table = [personId];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error loading Person from Database", "Original": err });
        } else {
            res.json({ "Error": false, "Message": "Success", "Person": rows });

        }
    });
});


router.post("/person", checkJwt, function (req, res) {
    debugger;
    var query = "INSERT INTO ??(??,??,??,??, ??) VALUES (?,?,?,?,?)";
    var table = ["Person","PersonId","Geschlecht", "Name", "Vorname", "Nickname" ,personId,req.body.geschlecht, req.body.name,req.body.vorname,req.body.nickname];
    query = mysql.format(query, table);
    
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing adding Person " ,"Original":err });
        } else {
            res.json({ "Message": "Person added", "Id": rows.insertId, "PersonId": personId });
        }
    });
});

router.put("/person/:id", checkJwt, function (req, res) {
    var query = "UPDATE Person SET Geschlecht = ?, Name = ?, Vorname = ?, Nickname = ? Where PersonId = ? ";
    var table = [req.body.geschlecht, req.body.name,req.body.vorname,req.body.nickname,personId];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": err });
        } else {
            res.json({ "Error": false, "Message": "Update Person successful", "Person": rows });

        }
    });
});

router.get("/schulzimmer", checkJwt, function (req, res) {
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
                parallel_done();
            });
        },
        function(parallel_done) {
            connection.query(queryTische, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.Tische = results;
                parallel_done();
            });
        }
     ], function(err) {
          if (err) console.log(err);
          res.send(return_data);
     });


});

router.post("/schulzimmer", checkJwt, function (req, res) {
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

router.get("/schulklasse", checkJwt, function (req, res) {
    var sqlSchueler = "SELECT * FROM ?? t WHERE ?? in (SELECT ?? from ?? s where ?? = ?)";
    var tableSchueler = ["schueler","t.SchulklassenId","s.Id","schulklasse", "s.PersonId", personId];
    var sqlSchulklasse = "SELECT * FROM ?? s WHERE ??=?";
    var tableSchulklasse = ["schulklasse", "s.PersonId", personId];

    querySchulklasse = mysql.format(sqlSchulklasse, tableSchulklasse);
    querySchueler = mysql.format(sqlSchueler, tableSchueler)
    
    var return_data = {};

    async.parallel([
        function(parallel_done) {
            connection.query(querySchulklasse, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.Schulklassen = results;
                parallel_done();
            });
        },
        function(parallel_done) {
            connection.query(querySchueler, {}, function(err, results) {
                if (err) return parallel_done(err);
                return_data.Schueler = results;
                parallel_done();
            });
        }
     ], function(err) {
          if (err) console.log(err);
          res.send(return_data);
     });


});

router.post("/schulklasse", checkJwt, function (req, res) {
    var sqlDeleteSchueler = "DELETE FROM ?? WHERE ?? in (SELECT ?? from ??  where ?? = ?)";
    var valuesDeleteSchueler = ["schueler","SchulklassenId","Id","schulklasse", "PersonId", personId];

    var sqlDeleteSchulklasse = "DELETE FROM ?? where ?? = ?";
    var valuesDeleteSchulklasse = ["schulklasse","PersonId", personId];

    queryDeleteSchueler = mysql.format(sqlDeleteSchueler, valuesDeleteSchueler);
    queryDeleteSchulklasse = mysql.format(sqlDeleteSchulklasse, valuesDeleteSchulklasse)


    var queryInsertSchulklasse = "INSERT INTO schulklasse (PersonId, Name) VALUES ?";
    var queryInsertSchueler = "INSERT INTO schueler (SchulklassenId,Name,Vorname) VALUES ?";
    var valuesInsertSchulklasse = [];
    var valuesInsertSchulklasseWithId = [];

    var valuesInsertSchueler= [];

    for(var i = 0; i < req.body.length; i++) {
        var obj = req.body[i];
        valuesInsertSchulklasse.push(new Array(personId,req.body[i].name));
        valuesInsertSchulklasseWithId.push(new Array(personId,req.body[i].id, req.body[i].name));
        for(var j=0; j<req.body[i].schueler.length; j++){
            valuesInsertSchueler.push(new Array(req.body[i].id,req.body[i].schueler[j].vorname, req.body[i].schueler[j].name) );
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