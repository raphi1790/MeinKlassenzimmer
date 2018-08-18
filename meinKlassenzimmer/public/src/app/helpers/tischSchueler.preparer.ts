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
                this.preparedTischSchueler[row][column].tischOutput.position = new PositionTisch(row,column);
                this.preparedTischSchueler[row][column].schueler = new Schueler();
                
            }
        }
        
    }
  

    prepareTischSchuelerCombination(inputTische: Tisch[], inputSchueler: Schueler[] ): TischSchueler[][]{
        
        debugger;
        var preparedTischSchueler : TischSchueler[][];
        var schuelerPrepared: Schueler[];
        schuelerPrepared = this.randomizer.randomizeSchueler(inputSchueler, inputTische.length);
  
        for (let index = 0; index < inputTische.length; index++) {
            var row = inputTische[index].position.row;
            var column = inputTische[index].position.column;
            this.preparedTischSchueler[row][column].tischOutput.selected = true;
            if(typeof schuelerPrepared[index] !== 'undefined' ){
                this.preparedTischSchueler[row][column].schueler.name = schuelerPrepared[index].name;
                this.preparedTischSchueler[row][column].schueler.vorname = schuelerPrepared[index].vorname;

            }

        }
        return this.preparedTischSchueler;
    }




}