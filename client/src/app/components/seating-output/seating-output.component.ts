import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SeatingOutput } from 'src/app/models/output.seating';
import { TischSchueler } from '../../models/tisch.schueler';

@Component({
  selector: 'app-seating-output',
  templateUrl: './seating-output.component.html',
  styleUrls: ['./seating-output.component.css']
})
export class SeatingOutputComponent implements OnChanges {

  @Input('SeatingOutput') seatingOutput: SeatingOutput; 



  tischStyle : string
  tischSelected: boolean
  schuelerExists: boolean

  private getTisch():void{


    this.schuelerExists = false;
    if (this.seatingOutput.seating !== null || typeof this.seatingOutput.seating !== 'undefined'){
      this.schuelerExists = true;
    }
      
    if(this.seatingOutput.selected){
      this.tischStyle = 'selectedTischStyle';
      if(this.seatingOutput.active){
        this.tischStyle = 'activeTischStyle';
      }
    }else{
      this.tischStyle = 'unselectedTischStyle';
    }
    
  }

  ngOnChanges() {
    this.getTisch();
  }


}



