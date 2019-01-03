import { Schueler } from "app/models/schueler";

import { Regel } from "app/models/regel";
import { Schulklasse } from "app/models/schulklasse";
import { Tisch } from "app/models/tisch";
import { Schulzimmer } from "app/models/schulzimmer";

export class RegelChecker{

    regelExistsToSchueler(inputSchueler: Schueler, inputRegeln: Regel[]): boolean{
        debugger;
        return inputRegeln.some(regel => regel.schueler1Id === inputSchueler.id)
    }

    regelExistsToSchulklasse(inputKlasse: Schulklasse, inputRegeln: Regel[]): boolean{
        debugger;
        let regelExistsToKlasse = false;
        inputKlasse.schueler.forEach(schueler => {
            if(this.regelExistsToSchueler(schueler,inputRegeln)){
                regelExistsToKlasse= true;
            }
        });
        return regelExistsToKlasse
    }
    regelExistsToTischId(inputTischId: string, inputRegeln: Regel[]): boolean{
        debugger;
        return inputRegeln.some(regel => regel.tischId === inputTischId)
    }
    regelExistsToSchulzimmer(inputZimmer: Schulzimmer, inputRegeln: Regel[]): boolean{
        debugger;
        let regelExistsToZimmer = false;
        inputZimmer.tische.forEach(tisch => {
            if(this.regelExistsToTischId(tisch.id ,inputRegeln)){
                regelExistsToZimmer= true;
            }
        });
        return regelExistsToZimmer
    }
}