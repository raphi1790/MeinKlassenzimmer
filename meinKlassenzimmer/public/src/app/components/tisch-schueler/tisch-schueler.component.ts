import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PositionTisch } from '../../models/position.tisch';
import { TischOutput } from '../../models/output.tisch';
import { Tisch } from '../../models/tisch';
import { Schueler } from '../../models/schueler';
import { TischSchueler } from '../../models/tisch.schueler';

@Component({
  selector: 'app-tisch-schueler',
  templateUrl: './tisch-schueler.component.html',
  styleUrls: ['./tisch-schueler.component.css']
})
export class TischSchuelerComponent implements OnChanges {

  @Input('TischSchuelerCombination') tischSchuelerCombination: TischSchueler; 



  tischStyle : string
  tischSelected: boolean
  schuelerExists: boolean

  getTisch():void{

    this.schuelerExists = false;
    if(this.tischSchuelerCombination.tischOutput.selected){
      this.tischStyle = 'selectedTischStyle'
    }else{
      this.tischStyle = 'unselectedTischStyle';
    }
    if(typeof this.tischSchuelerCombination.schueler !== 'undefined'){
      this.schuelerExists = true;
    }
    

  }

  ngOnChanges() {
    this.getTisch();
  }


}



