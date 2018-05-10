import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PositionTisch } from '../../models/position.tisch';
import { TischOutput } from '../../models/output.tisch';
import { Tisch } from '../../models/tisch';


@Component({
  selector: 'app-tisch-vereinfacht',
  templateUrl: './tisch-vereinfacht.component.html',
  styleUrls: ['./tisch-vereinfacht.component.css']
})
export class TischVereinfachtComponent implements OnChanges {

  constructor() { }

  
  @Input('rowZimmer') row: number
  @Input('columnZimmer')  column: number;
  @Input('tischeToSchulzimmer') tischeToSchulzimmer: Tisch[];

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

  ngOnChanges() {
    this.getTisch();
  }


}



