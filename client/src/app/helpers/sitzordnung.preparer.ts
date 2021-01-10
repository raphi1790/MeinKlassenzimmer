import { Schueler } from "../models/schueler";
import {TischOutput} from "../models/output.tisch";
import {TischSchueler} from "../models/tisch.schueler";
import {Tisch} from "../models/tisch";
import { Randomizer } from './randomizer';
import { PositionTisch } from "../models/position.tisch";

import * as CONFIG from '../../config.json';
import { Regel } from "../models/regel";
import { Preparer } from "./preparer";
import { Sitzordnung } from '../models/sitzordnung';
import { Seating } from '../models/seating';
import * as uuidv4 from 'uuid/v4';

export class SitzordnungPreparer extends Preparer {
    sitzordnung: Sitzordnung

    preparedTischSchueler: TischSchueler[][];
    randomizer: Randomizer;

    initialize(){
        this.sitzordnung = new Sitzordnung()
        this.sitzordnung.seatings = new Array<Seating>();
        this.randomizer = new Randomizer()
    }

    prepare(inputSchueler: Schueler[], inputRegeln: Regel[],inputTischeActive: Tisch[], inputGroupNumber=null ): Sitzordnung
     {
        
        if(inputSchueler.length == 0){
            console.log("Abbruch, da keine Schueler übergeben wurden.")
        }
        else{
            let fixedSeatingRules = inputRegeln.filter(regel => regel.type == "Fester Sitzplatz")
            let pairingRules = inputRegeln.filter(regel => regel.type == "Unmögliche Paarung")
            let remainingSchueler = inputSchueler
            let remainingTische = inputTischeActive
            fixedSeatingRules.forEach(regel => {
                let currentSchueler = inputSchueler.filter(schueler => schueler.id == regel.schueler1Id)[0]
                let currentTisch = inputTischeActive.filter(tisch => tisch.id == regel.tischId)[0]
                this.sitzordnung.seatings.push(new Seating({
                    id: uuidv4(),
                    schueler: currentSchueler,
                    tisch: currentTisch
                }
                ))
                remainingSchueler = remainingSchueler.filter(schueler => schueler !== currentSchueler)
                remainingTische = remainingTische.filter(tisch => tisch !== currentTisch)
            });
            console.log("remainingSchueler", remainingSchueler)
            console.log("remainingTische", remainingTische)
            
            let randomizedTische = this.randomizer.shuffle(remainingTische);
            for (let index = 0; index < remainingSchueler.length; index++) {
                this.sitzordnung.seatings.push(new Seating({
                    id: uuidv4(),
                    schueler: remainingSchueler[index],
                    tisch: randomizedTische[index]
                }
                ))
                
            }
            

            

        }
        console.log("this.sitzordnung",this.sitzordnung)
        return this.sitzordnung
    }
    paarungSatisfied(sitzordnung: any, inputRegeln: Regel[]):boolean{
        return true
    }
    
    // initializeArrays(){
    //     debugger;
    //     this.preparedTischSchueler = [];
    //     for(var row: number = 0; row < (<any>CONFIG).numberOfRows; row++) {
    //         this.preparedTischSchueler[row] = [];
    //         for(var column: number = 0; column< (<any>CONFIG).numberOfColumns; column++) {
    //             this.preparedTischSchueler[row][column] = new TischSchueler();
    //             this.preparedTischSchueler[row][column].tischOutput = new TischOutput();
    //             this.preparedTischSchueler[row][column].tischOutput.selected = false;
    //             this.preparedTischSchueler[row][column].tischOutput.active = false;
    //             this.preparedTischSchueler[row][column].tischOutput.position = new PositionTisch(row,column);
    //             this.preparedTischSchueler[row][column].schueler = new Schueler({
    //                 id: undefined,
    //                 schulklassenId: undefined,
    //                 name:undefined,
    //                 vorname:undefined})
                
                
    //         }
    //     }

    // }
    

    // prepare(inputSchueler: Schueler[], inputRegeln: Regel[],inputSelectedTische: Tisch[], inputGroupType = null, inputGroupSize = null ): any{
    //     debugger;
    //     // console.log("Start prepare TischSchuelerPreparer");
    //     var schuelerRandomizedPrepared: Schueler[];
    //     var indexSchueler = 0;
    //     let regelnSitzplatz = inputRegeln.filter(regel => regel.type == "Fester Sitzplatz");
    //     let regelnPaarung =  inputRegeln.filter(regel => regel.type == "Unmögliche Paarung");
    //     let fixedTische = inputSelectedTische.filter(item => inputRegeln.map(regel => regel.tischId).includes(item.id) );
    //     let flexibleTische = inputSelectedTische.filter(item => !regelnSitzplatz.map(regel => regel.tischId).includes(item.id) )
    //     let flexibleActiveTische = flexibleTische.filter(tisch => tisch.active == true);
    //     let flexibleSchueler = inputSchueler.filter(item => !regelnSitzplatz.map(regel => regel.schueler1Id).includes(item.id) );
        
        
    //     const checkTischFixedExists = tischIdParam => fixedTische.some( ({id}) => id == tischIdParam);
        
    //     let randomizer = new Randomizer();
    //     schuelerRandomizedPrepared = randomizer.randomizeSchueler(flexibleSchueler, flexibleActiveTische.length);
    //     for (let index = 0; index < inputSelectedTische.length; index++) {
    //         var row = inputSelectedTische[index].position.row;
    //         var column = inputSelectedTische[index].position.column;
    //         this.preparedTischSchueler[row][column].tischOutput.selected = true;
    //         if(inputSelectedTische[index].active == true){
    //             this.preparedTischSchueler[row][column].tischOutput.active = true;
    //             if(checkTischFixedExists(inputSelectedTische[index].id)){
    //                 let regelToFixedTisch = regelnSitzplatz.filter(item => item.tischId == inputSelectedTische[index].id)[0];
    //                 let fixedSchueler = inputSchueler.filter(item => item.id == regelToFixedTisch.schueler1Id  )[0];
    //                 this.preparedTischSchueler[row][column].schueler = new Schueler({
    //                     id:fixedSchueler.id,
    //                     vorname:fixedSchueler.vorname,
    //                     name: fixedSchueler.name,
    //                     schulklassenId: fixedSchueler.schulklassenId
    //                 })
    //             }else{
    //                 if(typeof schuelerRandomizedPrepared[indexSchueler] !== 'undefined' ){
    //                     this.preparedTischSchueler[row][column].schueler = new Schueler({
    //                         id:schuelerRandomizedPrepared[indexSchueler].id,
    //                         vorname:schuelerRandomizedPrepared[indexSchueler].vorname,
    //                         name: schuelerRandomizedPrepared[indexSchueler].name,
    //                         schulklassenId: schuelerRandomizedPrepared[indexSchueler].schulklassenId
    //                     })
    //                 }
    //                 indexSchueler++;

    //             }
                
                
    //         }
    //     }
           
    //     return this.preparedTischSchueler
       
        
    // }

    // paarungSatisfied(inputTischSchueler: TischSchueler[][], inputRegeln: Regel[]):boolean{
    //     debugger;
    //     // console.log("inputTischSchueler in paarungSatisfied");
    //     // console.log(inputTischSchueler)
    //     let tischSchuelerArray = this.to1DArray(inputTischSchueler);
    //     let paarungSatisfied = true;
    //     inputRegeln.forEach(regel => {
    //         let schueler1Id = regel.schueler1Id;
    //         let schueler2Id = regel.schueler2Id;
    //         let tischToSchueler1 = tischSchuelerArray.filter(item => item.schueler.id == schueler1Id);
    //         let tischToSchueler2 = tischSchuelerArray.filter(item => item.schueler.id == schueler2Id);
    //         let rowTisch1 = tischToSchueler1[0].tischOutput.position.row;
    //         let rowTisch2 = tischToSchueler2[0].tischOutput.position.row;
    //         let columnTisch1 = tischToSchueler1[0].tischOutput.position.column;
    //         let columnTisch2 = tischToSchueler2[0].tischOutput.position.column;
    //         if((rowTisch1 == rowTisch2 && Math.abs(columnTisch1 - columnTisch2 )<=1)
    //          || columnTisch1 == columnTisch2 && Math.abs(rowTisch1 - rowTisch2 )<=1 ){
    //             paarungSatisfied = false;
    //          }
                
    //     });
    //     return paarungSatisfied;
    // }
 




}