var foreignKeyPreparer = require('./foreignKeyPreparer');
var mappingTableCreator = require('./mappingTableCreator');
const async = require('async');
class ParentChildInserter {
    InsertParentChild(connection, queryParent, queryChild, valuesParent, valuesParentWithOldId, valuesChildren) {
        var mappingTable = [];
        async.parallel([
            function (parallel_done) {
                if (valuesParent.length > 0) {
                    connection.query(queryParent, [valuesParent], function (err, results) {
                        if (err)
                            return parallel_done(err);
                        console.log("Inserted ParentId:");
                        console.log(results.insertId);
                        var MappingTableCreator = new mappingTableCreator();
                        mappingTable = MappingTableCreator.CreateMappingIdTable(valuesParentWithOldId, results.insertId);
                        parallel_done();
                    });
                }
                else {
                    console.log("No parent records");
                    parallel_done();
                }
            }
        ], function (err) {
            if (err)
                console.log(err);
            var ForeignKeyPreparer = new foreignKeyPreparer();
            var valuesChildrenWithForeignKey = ForeignKeyPreparer.PrepareChildWithForeignKeys(valuesChildren, mappingTable);
            console.log("Values Children:");
            console.log(valuesChildrenWithForeignKey);
            if (valuesChildrenWithForeignKey.length > 0) {
                connection.query(queryChild, [valuesChildrenWithForeignKey], function (err, results) {
                    if (err)
                        console.log(err);
                });
            }
            else {
                console.log("No children records");
            }
        });
    }
}
;
module.exports = ParentChildInserter;
//# sourceMappingURL=parentChildInserter.js.map