import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PositionTisch } from '../../models/position.tisch';
import { TischOutput } from '../../models/output.tisch';
import { Tisch } from '../../models/tisch';
import { Schueler } from '../../models/schueler';


@Component({
  selector: 'app-tisch-vereinfacht',
  templateUrl: './tisch-vereinfacht.component.html',
  styleUrls: ['./tisch-vereinfacht.component.css']
})
export class TischVereinfachtComponent implements OnChanges {

  constructor() { 
    this.schuelerExists = false;
  }

  
  @Input('rowZimmer') row: number
  @Input('columnZimmer')  column: number;
  @Input('tischeToSchulzimmer') tischeToSchulzimmer: Tisch[];
  @Input('schueler') schueler: Schueler[];
  @Input('schuelerIndex') schuelerIndex: number
  

  @Output() noteZimmerVereinfacht: EventEmitter<boolean> = new EventEmitter<boolean>();

  tischStyle : string
  tischSelected: boolean
  schuelerExists: boolean

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
            this.noteZimmerVereinfacht.emit(this.tischSelected);
          }

      }
      if(typeof this.schueler[this.schuelerIndex] !== 'undefined'){
        this.schuelerExists = true;
      }
      
    
  }

  ngOnChanges() {
    this.getTisch();
  }


}



