import { Schueler } from "../models/schueler";
import {TischOutput} from "../models/output.tisch";
import {TischSchueler} from "../models/tisch.schueler";
import {Tisch} from "../models/tisch";
import { Randomizer } from '../helpers/randomizer';
import { PositionTisch } from "../models/position.tisch";

import * as CONFIG from '../../config.json';
import { Regel } from "app/models/regel";

export class TischSchuelerPreparer {

    randomizer: Randomizer;
    preparedTischSchueler: TischSchueler[][];

    /**
     *
     */
    constructor() {
        debugger;
        this.randomizer = new Randomizer();
        this.preparedTischSchueler = [];
        for(var row: number = 0; row < (<any>CONFIG).numberOfRows; row++) {
            this.preparedTischSchueler[row] = [];
            for(var column: number = 0; column< (<any>CONFIG).numberOfColumns; column++) {
                this.preparedTischSchueler[row][column] = new TischSchueler();
                this.preparedTischSchueler[row][column].tischOutput = new TischOutput();
                this.preparedTischSchueler[row][column].tischOutput.selected = false;
                this.preparedTischSchueler[row][column].tischOutput.active = false;
                this.preparedTischSchueler[row][column].tischOutput.position = new PositionTisch(row,column);
                this.preparedTischSchueler[row][column].schueler = new Schueler();
                
            }
        }
        
    }
  

    prepareTischSchuelerCombination(inputSelectedTische: Tisch[], inputSchueler: Schueler[], inputRegeln: Regel[] ): TischSchueler[][]{
        debugger;
        var schuelerRandomizedPrepared: Schueler[];
        var indexSchueler = 0;
        let fixedTische = inputSelectedTische.filter(item => inputRegeln.map(regel => regel.tischId).includes(item.id) );
        let flexibleTische = inputSelectedTische.filter(item => !inputRegeln.map(regel => regel.tischId).includes(item.id) )
        let flexibleActiveTische = flexibleTische.filter(tisch => tisch.active == true);
        let flexibleSchueler = inputSchueler.filter(item => !inputRegeln.map(regel => regel.schueler1Id).includes(item.id) );
        schuelerRandomizedPrepared = this.randomizer.randomizeSchueler(flexibleSchueler, flexibleActiveTische.length);
        const checkTischFixedExists = tischIdParam => fixedTische.some( ({id}) => id == tischIdParam)
        for (let index = 0; index < inputSelectedTische.length; index++) {
            var row = inputSelectedTische[index].position.row;
            var column = inputSelectedTische[index].position.column;
            this.preparedTischSchueler[row][column].tischOutput.selected = true;
            if(inputSelectedTische[index].active == true){
                this.preparedTischSchueler[row][column].tischOutput.active = true;
                if(checkTischFixedExists(inputSelectedTische[index].id)){
                    let regelToFixedTisch = inputRegeln.filter(item => item.tischId == inputSelectedTische[index].id)[0];
                    let fixedSchueler = inputSchueler.filter(item => item.id == regelToFixedTisch.schueler1Id  )[0];
                    this.preparedTischSchueler[row][column].schueler.nameKurz = fixedSchueler.nameKurz
                    this.preparedTischSchueler[row][column].schueler.vorname = fixedSchueler.vorname;

                }else{
                    if(typeof schuelerRandomizedPrepared[indexSchueler] !== 'undefined' ){
                        this.preparedTischSchueler[row][column].schueler.nameKurz = schuelerRandomizedPrepared[indexSchueler].nameKurz;
                        this.preparedTischSchueler[row][column].schueler.vorname = schuelerRandomizedPrepared[indexSchueler].vorname;
                    }
                    indexSchueler++;

                }
                
                
            }

        }
        return this.preparedTischSchueler;
    }




}