class ForeignKeyPreparer{

    PrepareChildWithForeignKeys(InputChildrenValues, mappingIdTable){
        var childrenValuesCorrectForeignKey = [];
        console.log("InputChildrenValues");
        console.log(InputChildrenValues);
        for (let i = 0; i < mappingIdTable.length; i++) {           
            var childrenToParent = InputChildrenValues.filter(arr => arr[0] == mappingIdTable[i][0]);
            childrenToParent.forEach(element => {
                element[0] = mappingIdTable[i][1];
                childrenValuesCorrectForeignKey.push(element);
            });
        }
        console.log("Corrected ChildrenValues");
        console.log(childrenValuesCorrectForeignKey);
        return childrenValuesCorrectForeignKey;
    }
};

module.exports = ForeignKeyPreparer;