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
var name;
var vorname;
var nickname;
var gender;

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
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        setPersonValues(req);
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }

});

function setPersonValues(req) {
    //set personId
    var personIdSub;
    var personIdArray;
    personIdSub = jwtDecode(req.headers.authorization.split(' ')[1]).sub;
    console.log(personIdSub);
    personIdArray= personIdSub.split("|").map(val => String(val) + 1);
    personId = personIdArray[1];

    //set other values
    console.log(jwtDecode(req.headers.authorization.split(' ')[1]));
    var name = jwtDecode(req.headers.authorization.split(' ')[1]).family_name;
    var vorname = jwtDecode(req.headers.authorization.split(' ')[1]).given_name;
    var nickname = jwtDecode(req.headers.authorization.split(' ')[1]).nickname;
    var gender = jwtDecode(req.headers.authorization.split(' ')[1]).gender;
    console.log("personId" +personId);
    // console.log(name);
    // console.log(vorname);
    // console.log(nickname);
    // console.log(gender);
}


const checkScopes = jwtAuthz(['admin:admin']);

  router.get('/public', function(req, res) {
    res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
  });

  router.get('/private',checkJwt, checkScopes,  function(req, res) {
    res.json({ message: "Hello from a private endpoint! You need to be authenticated and have a scope of admin:admin to see this." });
  });

 
  router.get("/", function (req, res) {
      res.json({ "Message": "Hello World !" });
  });

  router.get("/klassen", checkJwt, function (req, res) {
      
    
      var query = "SELECT * FROM ??WHERE ??=?";
      var table = ["klassen","personId", personId];
      query = mysql.format(query, table);
      connection.query(query, function (err, rows) {
          if (err) {
              res.json({ "Error": true, "Message": err });
          } else {
              res.json({ "Error": false, "Message": "Success", "Klasse": rows });
              
          }
      });
  });



  router.get("/schueler", function (req, res) {
      var query = "SELECT * FROM ??";
      var table = ["schueler"];
      query = mysql.format(query, table);
      connection.query(query, function (err, rows) {
          if (err) {
              res.json({ "Error": true, "Message": "Error executing MySQL query" });
          } else {
              res.json({ "Error": false, "Message": "Success", "Schueler": rows });
          }
      });
  });

module.exports = router;