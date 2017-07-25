var mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function (router, connection, md5) {
    var self = this;
    router.get("/", function (req, res) {
        res.json({ "Message": "Hello World !" });
    });

    router.get("/klassen", function (req, res) {
        var query = "SELECT * FROM ??";
        var table = ["klassen"];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.json({ "Error": false, "Message": "Success", "Klasse": rows });
            }
        });
    });

    router.get("/heroes/:id", function (req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["heroes", "id", req.params.id];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.json({ "Error": false, "Message": "Success", "Hero": rows });
            }
        });
    });

    router.post("/heroes", function (req, res) {
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["heroes", "id", "name", req.body.id, req.body.name];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.json({ "Error": false, "Message": "Hero Added !" });
            }
        });
    });

    router.put("/heroes", function (req, res) {
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["heroes", "name", req.body.name, "id", req.body.id];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.json({ "Error": false, "Message": "Updated Hero " + req.body.name });
            }
        });
    });

    router.delete("/heroes/:id", function (req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["heroes", "id", req.params.id];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                res.json({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.json({ "Error": false, "Message": "Deleted Hero with ID " + req.params.id });
            }
        });
    });
}

module.exports = REST_ROUTER;
