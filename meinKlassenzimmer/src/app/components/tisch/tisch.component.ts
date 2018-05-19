import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PositionTisch } from '../../models/position.tisch';
import { TischOutput } from '../../models/output.tisch';
import { Tisch } from '../../models/tisch';

@Component({
  selector: 'app-tisch',
  templateUrl: './tisch.component.html',
  styleUrls: ['./tisch.component.css']
})
export class TischComponent implements OnChanges {

  constructor() { }


  @Input('TischOutput') tischOutput: TischOutput;

  @Output() noteSchulzimmer: EventEmitter<TischOutput> = new EventEmitter<TischOutput>();

  tischStyle : string


  getTisch():void{

    debugger;
    if(this.tischOutput.selected){
      this.tischStyle = 'selectedTischStyle';
    }else{
      this.tischStyle = 'unselectedTischStyle';
    }
  }

    
  selectTisch(): void {
    debugger;
    if (this.tischOutput.selected) {
      this.tischStyle = 'unselectedTischStyle';
      this.tischOutput.selected = false;
      this.noteSchulzimmer.emit(this.tischOutput);
      
    } else {
      this.tischStyle = 'selectedTischStyle';
      this.tischOutput.selected = true;
      this.noteSchulzimmer.emit(this.tischOutput);
    }
  }

  ngOnChanges() {
    this.getTisch();
  }


}
