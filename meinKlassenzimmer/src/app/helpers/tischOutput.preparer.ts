import { Schueler } from "../models/schueler";
import {TischOutput} from "../models/output.tisch";
import {Tisch} from "../models/tisch";
import { Randomizer } from '../helpers/randomizer';
import { PositionTisch } from "../models/position.tisch";
import { Schulzimmer } from "../models/schulzimmer";

var CONFIG = require('../../../config.json');


export class TischOutputPreparer {

    updatedSchulzimmer: Schulzimmer

    /**
     *
     */
    constructor() {
               
        
    }
  

    prepareTischOutput(inputSchulzimmer: Schulzimmer ): TischOutput[][]{
        debugger;
        var preparedTischOutput : TischOutput[][];
        preparedTischOutput = [];
        for(var row: number = 0; row < CONFIG.numberOfRows; row++) {
            preparedTischOutput[row] = [];
            for(var column: number = 0; column< CONFIG.numberOfRows; column++) {
                preparedTischOutput[row][column] = new TischOutput();
                preparedTischOutput[row][column].selected = false;
                preparedTischOutput[row][column].position = new PositionTisch(row,column);
                
            }
        }
  
        for (let index = 0; index < inputSchulzimmer.tische.length; index++) {
            var row = inputSchulzimmer.tische[index].position.row;
            var column = inputSchulzimmer.tische[index].position.column;
            preparedTischOutput[row][column].selected = true;
        }
        return preparedTischOutput;
    }

    extractTischOfTischOutput(tischOutput: TischOutput, selectedSchulzimmer: Schulzimmer):Schulzimmer{
        debugger;
        this.updatedSchulzimmer = selectedSchulzimmer;
        if(tischOutput.selected){
            var tischTmp = new Tisch();
            tischTmp.position = new PositionTisch(tischOutput.position.row,tischOutput.position.column);
            this.updatedSchulzimmer.tische.push(tischTmp);

        }else{
            this.updatedSchulzimmer.tische = this.updatedSchulzimmer.tische.filter(
                item =>
                  !(item.position.row == tischOutput.position.row && item.position.column == tischOutput.position.column))
        }

        return this.updatedSchulzimmer;

    }




}