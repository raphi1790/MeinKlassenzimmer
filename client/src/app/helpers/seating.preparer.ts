import { Schueler } from "../models/schueler";
import {Tisch} from "../models/tisch";
import { Randomizer } from './randomizer';

import { Regel } from "../models/regel";
import { Preparer } from "./preparer";
import { Seating } from '../models/seating';
import * as uuidv4 from 'uuid/v4';

export class SeatingPreparer extends Preparer {
    seatings: Seating[]
    randomizer: Randomizer;

    initialize(){
        this.seatings = new Array<Seating>();
        this.randomizer = new Randomizer()
    }

    prepare(inputSchueler: Schueler[], inputRegeln: Regel[],inputTischeActive: Tisch[], inputGroupNumber=null ): Seating[]
     {
        
        if(inputSchueler === null || inputSchueler === undefined || inputSchueler.length == 0 ){
            console.log("Abbruch, da keine Schueler übergeben wurden.")
        }
        else{
            let fixedSeatingRules = inputRegeln.filter(regel => regel.type == "Fester Sitzplatz")
            let remainingSchueler = inputSchueler
            let remainingTische = inputTischeActive
            fixedSeatingRules.forEach(regel => {
                let currentSchueler = inputSchueler.filter(schueler => schueler.id == regel.schueler1Id)[0]
                let currentTisch = inputTischeActive.filter(tisch => tisch.id == regel.tischId)[0]
                this.seatings.push(new Seating({
                    id: uuidv4(),
                    schueler: currentSchueler,
                    tisch: currentTisch
                }
                ))
                remainingSchueler = remainingSchueler.filter(schueler => schueler !== currentSchueler)
                remainingTische = remainingTische.filter(tisch => tisch !== currentTisch)
            });
            // console.log("remainingSchueler", remainingSchueler)
            // console.log("remainingTische", remainingTische)
            
            let randomizedTische = this.randomizer.shuffle(remainingTische);
            for (let index = 0; index < remainingSchueler.length; index++) {
                this.seatings.push(new Seating({
                    id: uuidv4(),
                    schueler: remainingSchueler[index],
                    tisch: randomizedTische[index]
                }
                ))
                
            }
            

            

        }
        console.log("this.seatings",this.seatings)
        return this.seatings
    }
    paarungSatisfied(inputSeatings: any, inputRegeln: Regel[]):boolean{
        debugger;
        let paarungSatisfied = true
        inputRegeln.forEach(regel => {
            if (regel.type == "Unmögliche Paarung"){
                let seatingSchueler1: Seating = inputSeatings.filter(seating => seating.schueler.id == regel.schueler1Id)[0]
                let seatingSchueler2: Seating = inputSeatings.filter(seating => seating.schueler.id == regel.schueler2Id)[0]

                let rowTisch1 = seatingSchueler1.tisch.position.row;
                let rowTisch2 = seatingSchueler2.tisch.position.row;

                let columnTisch1 = seatingSchueler1.tisch.position.column;
                let columnTisch2 = seatingSchueler2.tisch.position.column;

                if((rowTisch1 == rowTisch2 && Math.abs(columnTisch1 - columnTisch2 )<=1)
                         || columnTisch1 == columnTisch2 && Math.abs(rowTisch1 - rowTisch2 )<=1 ){
                            paarungSatisfied = false;
                         }
                
                
            }

        })
        return paarungSatisfied
      
    }
    

}