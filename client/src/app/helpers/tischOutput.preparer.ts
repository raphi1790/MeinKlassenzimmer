import {TischOutput} from "../models/output.tisch";
import {Tisch} from "../models/tisch";
import { Randomizer } from '../helpers/randomizer';
import { PositionTisch } from "../models/position.tisch";
import { Schulzimmer } from "../models/schulzimmer";
import * as uuidv4 from 'uuid/v4';
import * as CONFIG from '../../config.json';


export class TischOutputPreparer {

    updatedSchulzimmer: Schulzimmer;
    currentTableNumber: number;

    /**
     *
     */
    constructor() {
               
        
    }
  

    prepareTischOutput(inputSchulzimmer: Schulzimmer ): TischOutput[][]{
        debugger;
        var preparedTischOutput : TischOutput[][];
        preparedTischOutput = [];
        for(var row: number = 0; row < (<any>CONFIG).numberOfRows; row++) {
            preparedTischOutput[row] = [];
            for(var column: number = 0; column< (<any>CONFIG).numberOfColumns; column++) {
                preparedTischOutput[row][column] = new TischOutput();
                preparedTischOutput[row][column].selected = false;
                preparedTischOutput[row][column].active = false;
                preparedTischOutput[row][column].tableNumber = null;
                preparedTischOutput[row][column].tischId = null;
                preparedTischOutput[row][column].position = new PositionTisch(row,column);
                
            }
        }
  
        for (let index = 0; index < inputSchulzimmer.tische.length; index++) {
            var row = inputSchulzimmer.tische[index].position.row;
            var column = inputSchulzimmer.tische[index].position.column;
            preparedTischOutput[row][column].selected = true ;
            preparedTischOutput[row][column].active = inputSchulzimmer.tische[index].active;
            preparedTischOutput[row][column].tableNumber = inputSchulzimmer.tische[index].tableNumber
            preparedTischOutput[row][column].tischId = inputSchulzimmer.tische[index].id;
        }

        return preparedTischOutput;
    }

    extractTischOfTischOutput(tischOutput: TischOutput, selectedSchulzimmer: Schulzimmer):Schulzimmer{
        debugger;
        this.updatedSchulzimmer = selectedSchulzimmer;
        this.updatedSchulzimmer.tische = this.updatedSchulzimmer.tische.filter(
            item =>
              !(item.position.row == tischOutput.position.row && item.position.column == tischOutput.position.column))
        
        if(tischOutput.selected){
            var tischTmp = new Tisch();
            tischTmp.id = uuidv4();
            tischTmp.schulzimmerId = this.updatedSchulzimmer.id;
            tischTmp.position = new PositionTisch(tischOutput.position.row,tischOutput.position.column);
            tischTmp.active = tischOutput.active;
            tischTmp.tableNumber = tischOutput.tableNumber;
            this.updatedSchulzimmer.tische.push(tischTmp);
        }

        return this.updatedSchulzimmer;
    }
    

    




}