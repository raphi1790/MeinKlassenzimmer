import * as CONFIG from '../../config.json';
import { Preparer } from './preparer.js';
import { TischSchueler } from 'app/models/tisch.schueler.js';
import { Regel } from 'app/models/regel.js';
import { Schueler } from 'app/models/schueler.js';
import { Tisch } from 'app/models/tisch.js';
import { TischSchuelerPreparer } from './tischSchueler.preparer.js';
import { GroupPreparer } from './group.preparer.js';

export class CalculatingEngine{

    resultObject : any;
    

    calculate(inputPreparer : Preparer, inputSchueler: Schueler[], inputRegeln: Regel[], inputTisch?: Tisch[], inputGroupType? : string, inputGroupSize?: number ): any{
        debugger;
        let countAttemp = 0;
        let maximalNumberOfAttemps = (<any>CONFIG).numberOfAttemps ;
        let regelnPaarung = inputRegeln.filter(regel => regel.type == "Unmögliche Paarung")
        do {
            inputPreparer.initializeArrays();
            if (inputPreparer.constructor.name === "TischSchuelerPreparer"){
                console.log("TischSchuelerPreparer");
                this.resultObject = inputPreparer.prepare(inputSchueler, inputRegeln,inputTisch)
            }
            if (inputPreparer.constructor.name === "GroupPreparer"){
                debugger;
                console.log("GroupPreparer");
                this.resultObject = inputPreparer.prepare(inputSchueler, inputRegeln,null, inputGroupType, inputGroupSize);
            }
            
            countAttemp++
        } while (countAttemp <= maximalNumberOfAttemps && !inputPreparer.paarungSatisfied(this.resultObject,regelnPaarung) );

        return (inputPreparer.paarungSatisfied(this.resultObject,regelnPaarung))? this.resultObject: undefined;
        
    }
}