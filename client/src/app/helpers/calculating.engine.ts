import * as CONFIG from '../../config.json';
import { Preparer } from './preparer.js';
import { Regel } from '../models/regel.js';
import { Schueler } from '../models/schueler.js';
import { Tisch } from '../models/tisch.js';

export class CalculatingEngine{

    resultObject : any;
    

    calculate(inputPreparer : Preparer, inputSchueler: Schueler[], inputRegeln: Regel[], inputTisch?: Tisch[], inputGroupType? : string, inputGroupSize?: number ): any{
        debugger;
        let countAttemp = 0;
        let maximalNumberOfAttemps = (<any>CONFIG).numberOfAttemps ;
        console.log(maximalNumberOfAttemps);
        
        let regelnPaarung = inputRegeln.filter(regel => regel.type == "Unmögliche Paarung")
        do {
            inputPreparer.initializeArrays();
            this.resultObject = inputPreparer.prepare(inputSchueler, inputRegeln,inputTisch,inputGroupType,inputGroupSize)           
            countAttemp++

        } while (countAttemp <= maximalNumberOfAttemps && !inputPreparer.paarungSatisfied(this.resultObject,regelnPaarung) );

        return (inputPreparer.paarungSatisfied(this.resultObject,regelnPaarung))? this.resultObject: undefined;
        
    }
}