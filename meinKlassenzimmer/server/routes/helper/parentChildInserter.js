var foreignKeyPreparer = require('./foreignKeyPreparer');
var mappingTableCreator = require('./mappingTableCreator');
const async = require('async');




class ParentChildInserter{

    InsertParentChild(connection, queryParent, queryChild, valuesParent,valuesParentWithOldId,valuesChildren){
        var mappingTable =[];
        async.parallel([
            function(parallel_done) {
                connection.query(queryParent,[valuesParent], function(err, results) {
                    if (err) return parallel_done(err);
                    console.log("Inserted ParentId:");
                    console.log(results.insertId);
                    var MappingTableCreator = new mappingTableCreator();
                    mappingTable = MappingTableCreator.CreateMappingIdTable(valuesParentWithOldId, results.insertId);
                    parallel_done();
                    

                })
            }

        ],function(err) {
            if (err) console.log(err);
            var ForeignKeyPreparer = new foreignKeyPreparer();
            var valuesChildrenWithForeignKey = ForeignKeyPreparer.PrepareChildWithForeignKeys(valuesChildren, mappingTable);
            console.log("Values Children:")
            console.log(valuesChildrenWithForeignKey);
            connection.query(queryChild,[valuesChildrenWithForeignKey], function(err, results) {
                if (err) console.log(err);
         
    
               
            })
            
        })



    }
    
    

};
module.exports = ParentChildInserter;
