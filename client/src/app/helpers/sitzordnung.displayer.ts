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

export class SitzordnungDisplayer  {

    preparedSeatingOutput: SeatingOutput[][];

   
   
    prepareSeatingOutput(inputSitzordnung: Sitzordnung, inputSchulzimmer: Schulzimmer ): SeatingOutput[][]{
        debugger;
        var preparedSeatingOutput : SeatingOutput[][];
        preparedSeatingOutput = [];
        for(var row: number = 0; row < (<any>CONFIG).numberOfRows; row++) {
            this.preparedSeatingOutput[row] = [];
            for(var column: number = 0; column< (<any>CONFIG).numberOfColumns; column++) {
                this.preparedSeatingOutput[row][column] = new SeatingOutput();
                this.preparedSeatingOutput[row][column].selected = false;
                this.preparedSeatingOutput[row][column].active = false;
                preparedSeatingOutput[row][column].tischNumber = null;
                this.preparedSeatingOutput[row][column].position = new PositionTisch(row,column);
                this.preparedSeatingOutput[row][column].seating = new Seating({
                    id : undefined,
                    sitzordnungId: undefined,
                    schueler : undefined,
                    tisch : undefined
                })
                
                
            }
        }
        for (let index = 0; index < inputSchulzimmer.tische.length; index++) {
            debugger;
            var row = inputSchulzimmer.tische[index].position.row;
            var column = inputSchulzimmer.tische[index].position.column;
            preparedSeatingOutput[row][column].selected = true ;
            preparedSeatingOutput[row][column].active = inputSchulzimmer.tische[index].active;
            preparedSeatingOutput[row][column].tischNumber = inputSchulzimmer.tische[index].tischNumber
            preparedSeatingOutput[row][column].tischId = inputSchulzimmer.tische[index].id;
        }
        for (let index = 0; index < inputSitzordnung.seatings.length; index++) {
            let currentSeating = inputSitzordnung.seatings[index]
            var row = currentSeating.tisch.position.row;
            var column = currentSeating.tisch.position.column;
            preparedSeatingOutput[row][column].seating = currentSeating;
        }

        return preparedSeatingOutput;
    }

  




}