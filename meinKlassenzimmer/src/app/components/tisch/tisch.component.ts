import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PositionTisch } from '../../models/positiontisch';
import { TischOutput } from '../../models/tischOutput';
import { Tisch } from '../../models/tisch';

@Component({
  selector: 'app-tisch',
  templateUrl: './tisch.component.html',
  styleUrls: ['./tisch.component.css']
})
export class TischComponent implements OnInit {

  constructor() { }


  @Input('rowZimmer') row: number
  @Input('columnZimmer')  column: number;
  @Input('tischeToSchulzimmer') tischeToSchulzimmer: Tisch[];

  @Output() noteZimmer: EventEmitter<TischOutput> = new EventEmitter<TischOutput>();

  tisch = 'unselectedTischStyle';
  tischSelected = false;
  tischOutput = new TischOutput();

  getTisch():void{

    debugger;
      if(typeof this.tischeToSchulzimmer != 'undefined'){
          this.tischeToSchulzimmer = this.tischeToSchulzimmer.filter(
            item => 
              item.position.row === this.row && item.position.column === this.column)
          if (this.tischeToSchulzimmer.length == 1){
            this.tisch = 'selectedTischStyle'
            this.tischSelected = true;
          }

      }
      
    
}
  


  
  selectTisch(): void {
    debugger;
    this.tischOutput.position = new PositionTisch(this.row,this.column);

    if (this.tischSelected) {
      this.tisch = 'unselectedTischStyle';
      this.tischOutput.selected = false;
      this.noteZimmer.emit(this.tischOutput);
      
    } else {
      this.tisch = 'selectedTischStyle';
      this.tischOutput.selected = true;
      this.noteZimmer.emit(this.tischOutput);
    }
    this.tischSelected = !this.tischSelected;
  }

  ngOnInit() {
    this.getTisch();
  }

}
