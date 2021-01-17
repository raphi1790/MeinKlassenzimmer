import { Schueler } from "../models/schueler";
import {TischOutput} from "../models/output.tisch";
import {TischSchueler} from "../models/tisch.schueler";
import {Tisch} from "../models/tisch";
import { Randomizer } from './randomizer';
import { PositionTisch } from "../models/position.tisch";

import * as CONFIG from '../../config.json';
import { Regel } from "../models/regel";
import { Sitzordnung } from "../models/sitzordnung";
import { Schulzimmer } from "../models/schulzimmer";
import { Preparer } from "./preparer";
import { SeatingOutput } from "../models/output.seating";
import { Seating } from '../models/seating';

export class SitzordnungRenderer  {

    preparedSeatingOutput: SeatingOutput[][];

   
   
    renderSeatingOutput(inputSeatings: Seating[], inputSchulzimmer: Schulzimmer ): SeatingOutput[][]{
        debugger;

        let numberOfRows = (<any>CONFIG).numberOfRows;
        let numberOfColumns = (<any>CONFIG).numberOfColumns;

        this.preparedSeatingOutput = [];
        for(var row: number = 0; row < numberOfRows; row++) {
            this.preparedSeatingOutput[row] = [];
            for(var column: number = 0; column< numberOfColumns; column++) {
                this.preparedSeatingOutput[row][column] = new SeatingOutput();
                this.preparedSeatingOutput[row][column].selected = false;
                this.preparedSeatingOutput[row][column].active = false;
                this.preparedSeatingOutput[row][column].tischNumber = null;
                this.preparedSeatingOutput[row][column].position = new PositionTisch(row,column);
                this.preparedSeatingOutput[row][column].seating = null;
                
                
            }
        }
        debugger;
        for (let index = 0; index < inputSchulzimmer.tische.length; index++) {
            ;
            var row = inputSchulzimmer.tische[index].position.row;
            var column = inputSchulzimmer.tische[index].position.column;
            this.preparedSeatingOutput[row][column].selected = true ;
            this.preparedSeatingOutput[row][column].active = inputSchulzimmer.tische[index].active;
            this.preparedSeatingOutput[row][column].tischNumber = inputSchulzimmer.tische[index].tischNumber
            this.preparedSeatingOutput[row][column].tischId = inputSchulzimmer.tische[index].id;
        }
        debugger;
        if(inputSeatings != (null || undefined)  ){
            for (let index = 0; index < inputSeatings.length; index++) {
                let currentSeating = inputSeatings[index]
                var row = currentSeating.tisch.position.row;
                var column = currentSeating.tisch.position.column;
                this.preparedSeatingOutput[row][column].seating = new Seating(currentSeating);
            }
        }
       
        debugger
        return this.preparedSeatingOutput;
    }

  




}