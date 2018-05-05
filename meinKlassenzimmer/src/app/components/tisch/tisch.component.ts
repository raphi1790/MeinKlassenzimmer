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


  @Input('rowZimmer') row: number
  @Input('columnZimmer')  column: number;
  @Input('tischeToSchulzimmer') tischeToSchulzimmer: Tisch[];

  @Output() noteZimmer: EventEmitter<TischOutput> = new EventEmitter<TischOutput>();

  tischStyle : string
  tischSelected: boolean
  tischOutput = new TischOutput();

  getTisch():void{

    debugger;
    this.tischSelected = false;
    this.tischStyle = 'unselectedTischStyle';
      if(this.tischeToSchulzimmer.length != 0){
          this.tischeToSchulzimmer = this.tischeToSchulzimmer.filter(
            item => 
              item.position.row === this.row && item.position.column === this.column)
          if (this.tischeToSchulzimmer.length == 1){
            this.tischStyle = 'selectedTischStyle'
            this.tischSelected = true;
          }

      }
      
    
}
  
  selectTisch(): void {
    debugger;
    this.tischOutput.position = new PositionTisch(this.row,this.column);

    if (this.tischSelected) {
      this.tischStyle = 'unselectedTischStyle';
      this.tischOutput.selected = false;
      this.noteZimmer.emit(this.tischOutput);
      
    } else {
      this.tischStyle = 'selectedTischStyle';
      this.tischOutput.selected = true;
      this.noteZimmer.emit(this.tischOutput);
    }
    this.tischSelected = !this.tischSelected;
  }

  ngOnChanges() {
    this.getTisch();
  }


}
