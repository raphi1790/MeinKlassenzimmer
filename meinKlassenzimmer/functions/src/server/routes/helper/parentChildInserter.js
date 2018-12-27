var foreignKeyPreparer = require('./foreignKeyPreparer');
var mappingTableCreator = require('./mappingTableCreator');
const async = require('async');




class ParentChildInserter{

    InsertParentChild(connection, queryParent, queryChild, valuesParent,valuesChildren){
        async.parallel([
            function(parallel_done) {
                if(valuesParent.length > 0){
                    connection.query(queryParent,[valuesParent], function(err, results) {
                        if (err) return parallel_done(err);
                        console.log("Inserted ParentId:");
                        console.log(results);
                        parallel_done();
                    })
                }
                else{
                    console.log("No parent records");
                    parallel_done();
                    
                }
                
                
            }

        ],function(err) {
            if (err) console.log(err);
            console.log("Values Children:")
            console.log(valuesChildren);
            if (valuesChildren.length > 0){
                connection.query(queryChild,[valuesChildren], function(err, results) {
                    if (err) console.log(err);
                })
            }else{
                console.log("No children records");
            }
        })



    }
    
    

};
module.exports = ParentChildInserter;
