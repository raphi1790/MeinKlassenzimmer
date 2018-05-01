class MappingTableCreator {

    CreateMappingIdTable(parentTable, lastInsertedId){
        var mappingParentChildId = [];
        for(var i = 0; i < parentTable.length; i++) {
            mappingParentChildId.push(new Array(parentTable[i][1] ,lastInsertedId));
            lastInsertedId++;
        } 
        console.log("MappingTable:");
        console.log(mappingParentChildId);   
        return mappingParentChildId;
    }
};
module.exports = MappingTableCreator;

    