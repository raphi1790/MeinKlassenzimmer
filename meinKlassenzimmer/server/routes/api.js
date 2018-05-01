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
var parentChildInserter = require('./parentChildInserter');


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
    var queryTische = "SELECT * FROM ?? t WHERE ?? in (SELECT ?? from ?? s where ?? = ?)";
    var tableTisch = ["tisch","t.SchulzimmerId","s.Id","schulzimmer", "s.PersonId", personId];
    var querySchulzimmer = "SELECT * FROM ?? s WHERE ??=? Group By ??";
    var tableSchulzimmer = ["schulzimmer", "s.PersonId", personId, "s.Id"];

    querySchulzimmer = mysql.format(querySchulzimmer, tableSchulzimmer);
    queryTische = mysql.format(queryTische, tableTisch)
    
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
    var sqlDeleteTische = "DELETE FROM ?? WHERE ?? in (SELECT ?? from ??  where ?? = ?)";
    var valuesDeleteTische = ["tisch","SchulzimmerId","Id","schulzimmer", "PersonId", personId];

    var sqlDeleteSchulzimmer = "DELETE FROM ?? where ?? = ?";
    var valuesDeleteSchulzimmer = ["schulzimmer","PersonId", personId];

    queryDeleteTische = mysql.format(sqlDeleteTische, valuesDeleteTische);
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





router.delete("/schulzimmer/:id", checkJwt, function (req, res) {
    var query = "DELETE from schulzimmer WHERE id=?";
    var table = [req.params.id];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing MySQL query","Original":err });
        } else {
            res.json({ "Error": false, "Message": "Deleted Schulzimmer with ID " + req.params.id });
        }
    });
});

router.get("/tisch/:id", checkJwt, function (req, res) {
    var query = "SELECT * FROM tisch WHERE schulzimmerId =? ";
    var table = [req.params.id];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": err });
        } else {
            res.json({ "Error": false, "Message": "Success", "Tische": rows });

        }
    });
});

router.post("/tisch", function (req, res) {
    var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
    var table = ["tisch", "schulzimmerId", "RowNumber", "ColumnNumber",  req.body.SchulzimmerId, req.body.RowNumber ,req.body.ColumnNumber];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing adding of Tisch query", "Original":err });
        } else {
            res.json({"Message": "Tisch added", "TischId": rows.insertId});
        }
    });
});

router.delete("/tisch/:id", checkJwt, function (req, res) {
    var query = "DELETE from tisch WHERE id=?";
    var table = [req.params.id];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing MySQL query","Original":err });
        } else {
            res.json({ "Error": false, "Message": "Deleted Tisch with ID " + req.params.id });
        }
    });
});




module.exports = router;