import { Schueler } from "../models/schueler";
import {TischOutput} from "../models/output.tisch";
import {TischSchueler} from "../models/tisch.schueler";
import {Tisch} from "../models/tisch";
import { Randomizer } from '../helpers/randomizer';
import { PositionTisch } from "../models/position.tisch";

import * as CONFIG from '../../config.json';

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
  

    prepareTischSchuelerCombination(inputSelectedTische: Tisch[], inputSchueler: Schueler[] ): TischSchueler[][]{
        
        debugger;
        var schuelerPrepared: Schueler[];
        var indexSchueler = 0;
        var activeTische = inputSelectedTische.filter(item => item.active == true);
        schuelerPrepared = this.randomizer.randomizeSchueler(inputSchueler, activeTische.length);
        for (let index = 0; index < inputSelectedTische.length; index++) {
            var row = inputSelectedTische[index].position.row;
            var column = inputSelectedTische[index].position.column;
            this.preparedTischSchueler[row][column].tischOutput.selected = true;
            if(inputSelectedTische[index].active == true){
                this.preparedTischSchueler[row][column].tischOutput.active = true;
                if(typeof schuelerPrepared[indexSchueler] !== 'undefined' ){
                    this.preparedTischSchueler[row][column].schueler.nameKurz = schuelerPrepared[indexSchueler].nameKurz;
                    this.preparedTischSchueler[row][column].schueler.vorname = schuelerPrepared[indexSchueler].vorname;
                }
                indexSchueler++;
            }

        }
        return this.preparedTischSchueler;
    }




}