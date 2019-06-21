import { Schueler } from "../models/schueler";
import { Randomizer } from "./randomizer";
import { Regel } from "../models/regel";
import { Preparer } from "./preparer";
import { Gruppe } from "../models/gruppe";
import { Gruppeneinteilung } from "../models/gruppeneinteilung";


export class GroupPreparer extends Preparer {
    gruppenEinteilung: Gruppeneinteilung


    initializeArrays(){
       this.gruppenEinteilung = new Gruppeneinteilung()
       this.gruppenEinteilung.gruppen = new Array<Gruppe>();
    }
    

    prepare(inputSchueler: Schueler[], inputRegeln: Regel[],inputTisch = null, inputGroupType? : string, inputGroupSize? : number): Gruppeneinteilung {
        debugger;
        if (inputSchueler.length == 0) {
            console.log("Abbruch, da keine Schueler übergeben wurden.")
        }
        else {
            let randomizer = new Randomizer();
            let randomizedSchueler = randomizer.shuffle(inputSchueler);
            let groupSize : number;

            switch (inputGroupType) {
                case "Gruppengrösse":
                    groupSize = inputGroupSize; 
                    for (let index = 0; index < randomizedSchueler.length; index += groupSize) {
                        let gruppe = new Gruppe();
                        gruppe.id = index;
                        gruppe.schueler= randomizedSchueler.slice(index, index+groupSize);
                        this.gruppenEinteilung.gruppen.push(gruppe);
                    }
                    
                    break;
                case "Gruppenanzahl":
                    for (let index = 0; index < inputGroupSize; index ++) {
                        let gruppe = new Gruppe();
                        
                        gruppe.id = index;
                        gruppe.schueler = randomizedSchueler.filter( (_, i) => i % inputGroupSize == index)
                        this.gruppenEinteilung.gruppen.push(gruppe);
                    }
                    break;
            
                default:
                    break;
            }
            
            
            
            console.log("Gruppeneinteilung");
            console.log(this.gruppenEinteilung);

        }
        return this.gruppenEinteilung;
    }


    paarungSatisfied(inputDataSource: Gruppeneinteilung,  inputRegeln: Regel[]):boolean{
        debugger;
        let paarungSatisfied = true;
        inputRegeln.forEach(regel => {
            
            let schueler1Id = regel.schueler1Id;
            let schueler2Id = regel.schueler2Id;
            let gruppe1 = inputDataSource.gruppen.filter(gruppe => gruppe.schueler.map(schueler => schueler.id).includes(schueler1Id))[0];
            let gruppe2 = inputDataSource.gruppen.filter(gruppe => gruppe.schueler.map(schueler => schueler.id).includes(schueler2Id))[0];
            if(gruppe1 == gruppe2 ){
                paarungSatisfied = false;
             }
                
        });
        return paarungSatisfied;
    }








}