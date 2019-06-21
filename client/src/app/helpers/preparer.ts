import { Tisch } from "../models/tisch";
import { Schueler } from "../models/schueler";
import { Regel } from "../models/regel";

export abstract class Preparer{
    initializeArrays(){
        console.log("Nothing to initialize");
    }
    prepare(inputSchueler: Schueler[], inputRegeln: Regel[], inputTisch?: Tisch[], inputGroupType? : string, inputGroupSize?: number ){
        console.log("Nothing to prepare or calculate");
    }

    paarungSatisfied(checkingObject: any, inputRegeln: Regel[]): boolean{
        return false;
    }

    
}