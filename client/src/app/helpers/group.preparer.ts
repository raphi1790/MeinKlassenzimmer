import { Schueler } from "../models/schueler";
import { Randomizer } from "./randomizer";
import { Regel } from "../models/regel";
import { Preparer } from "./preparer";
import { Gruppe } from "../models/gruppe";
import { Gruppeneinteilung } from "../models/gruppeneinteilung";


export class GroupPreparer extends Preparer {
    gruppen: Gruppe[]


    initializeArrays(){
       this.gruppen = new Array<Gruppe>();
    }
    

    prepare(inputSchueler: Schueler[], inputRegeln: Regel[],inputTisch=null,  inputGroupNumber? : number): Gruppe[] {
        debugger;
        console.log("Start prepare GroupPreparer");
        if (inputSchueler.length == 0) {
            console.log("Abbruch, da keine Schueler übergeben wurden.")
        }
        else {
            let randomizer = new Randomizer();
            let randomizedSchueler = randomizer.shuffle(inputSchueler);

     
            for (let index = 0; index < inputGroupNumber; index ++) {
                let gruppe = new Gruppe();
                
                gruppe.id = index;
                gruppe.schueler = randomizedSchueler.filter( (_, i) => i % inputGroupNumber == index)
                this.gruppen.push(gruppe);
            }
                ;
            
                
            
            
            
            console.log("Gruppeneinteilung");
            console.log(this.gruppen);

        }
        return this.gruppen;
    }


    paarungSatisfied(inputDataSource: Gruppe[],  inputRegeln: Regel[]):boolean{
        debugger;
        let paarungSatisfied = true;
        inputRegeln.forEach(regel => {
            
            let schueler1Id = regel.schueler1Id;
            let schueler2Id = regel.schueler2Id;
            let gruppe1 = inputDataSource.filter(gruppe => gruppe.schueler.map(schueler => schueler.id).includes(schueler1Id))[0];
            let gruppe2 = inputDataSource.filter(gruppe => gruppe.schueler.map(schueler => schueler.id).includes(schueler2Id))[0];
            if(gruppe1 == gruppe2 ){
                paarungSatisfied = false;
             }
                
        });
        return paarungSatisfied;
    }








}