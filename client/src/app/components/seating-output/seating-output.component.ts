import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SeatingOutput } from 'src/app/models/output.seating';
import { Schueler } from 'src/app/models/schueler';
import { Seating } from 'src/app/models/seating';
import { TischSchueler } from '../../models/tisch.schueler';

@Component({
  selector: 'app-seating-output',
  templateUrl: './seating-output.component.html',
  styleUrls: ['./seating-output.component.css']
})
export class SeatingOutputComponent implements OnChanges {

  @Input('seatingOutput') seatingOutput: SeatingOutput; 
  @Input('relevantSchueler') relevantSchueler: Schueler[];



  tischStyle : string
  tischSelected: boolean
  schuelerExists: boolean

  private renderSeatingOutput():void{

    debugger;
    this.schuelerExists = false;
    if (this.seatingOutput.seating != null ){
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

  getSchuelerFirstName(seating: Seating):String{
    let schuelerFirstName = this.relevantSchueler.filter(schueler => schueler.id == seating.schueler.id)[0].vorname
    return schuelerFirstName
  }

  getSchuelerName(seating: Seating):String{
    let schuelerName = this.relevantSchueler.filter(schueler => schueler.id == seating.schueler.id)[0].name
    return schuelerName.substring(0,5)
  }

  ngOnChanges() {
    this.renderSeatingOutput();
  }


}



