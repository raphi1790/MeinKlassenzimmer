const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const mysql = require("mysql");
const jwtDecode = require('jwt-decode');
var connection = require('../../dbconnection');


app.use(cors());
/* GET home page. */

var persondId;

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
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Person", "PersonId", personId];
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

router.get("/schulklasse", checkJwt, function (req, res) {
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["schulklasse", "personId", personId];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": err });
        } else {
            res.json({ "Error": false, "Message": "Success", "Schulklasse": rows });

        }
    });
});

router.post("/schulklasse", checkJwt, function (req, res) {
    debugger;
    var query = "INSERT INTO schulklasse(personid,name) VALUES (?,?)";
    var table = [personId , req.body.name];
    query = mysql.format(query, table);
    
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing adding of Schulklasse query " ,"Original":err });
        } else {
            res.json({ "Message": "Klasse added", "KlassenId": rows.insertId });
        }
    });
});
router.delete("/schulklassen/:id", checkJwt, function (req, res) {
    var query = "DELETE from schulklasse WHERE id=?";
    var table = [req.params.id];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing MySQL query","Original":err });
        } else {
            res.json({ "Error": false, "Message": "Deleted Schulklasse with ID " + req.params.id });
        }
    });
});

router.get("/schueler", checkJwt, function (req, res) {
    var query = "SELECT * FROM schueler WHERE klassenId IN (SELECT Id FROM schulklasse WHERE personId=?) ";
    var table = [personId];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing MySQL query","Original":err });
        } else {
            res.json({ "Error": false, "Message": "Success", "Schueler": rows });
        }
    }); 
});

router.post("/schueler", function (req, res) {
    var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
    var table = ["schueler", "klassenid", "vorname", "name",  req.body.klassenid,req.body.vorname,req.body.name];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing adding of Schueler query", "Original":err });
        } else {
            res.json({"Message": "Schueler added", "SchuelerId": rows.insertId});
        }
    });
});

router.delete("/schueler/:id", function (req, res) {
    var query = "DELETE from ?? WHERE ??=?";
    var table = ["schueler", "id", req.params.id];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            res.json({ "Error": true, "Message": "Error executing MySQL query","Original":err });
        } else {
            res.json({ "Error": false, "Message": "Deleted Schueler with ID " + req.params.id });
        }
    });
});



module.exports = router;