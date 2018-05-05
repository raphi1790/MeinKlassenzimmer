import { Component, OnInit, ViewEncapsulation, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { Schulzimmer } from '../../models/schulzimmer';
import { Tisch } from '../../models/tisch';
import { TischOutput } from '../../models/output.tisch';

@Component({
  selector: 'app-zimmer',
  templateUrl: './zimmer.component.html',
  styleUrls: ['./zimmer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ZimmerComponent implements  OnChanges {
  

  @Input('selectedSchulzimmer')  selectedSchulzimmer: Schulzimmer; 
  
  @Output() noteSchulzimmer: EventEmitter<Schulzimmer> = new EventEmitter<Schulzimmer>();

  zimmerRows = [0,1,2,3,4,5,6,7,8,9];
  zimmerColumns = [0,1,2,3,4,5,6,7,8,9];


  zimmer = new Schulzimmer();
  tischTmp: Tisch;
  
  
  



  constructor() { 
    this.zimmer.tische = new Array();
  }

  private writeZimmer(tischOutput:TischOutput):void {
    debugger;
    this.tischTmp = new Tisch();
    console.log("Zimmer before:");
    console.log(this.zimmer);
    this.tischTmp.position = tischOutput.position
    console.log("Zimmer after:");
    console.log(this.zimmer);
    if(tischOutput.selected){
      this.zimmer.tische.push(this.tischTmp)
    }else{
      this.zimmer.tische = this.zimmer.tische.filter(
         item =>  !(item.position.column == tischOutput.position.column && item.position.row == tischOutput.position.row)
      )
    } 

    
    console.log("Tische nach Auswahl:");
    console.log(this.zimmer.tische);


    console.log("Update Zimmer:");
    console.log(this.zimmer);
    console.log("Id of updated Zimmer:");
    console.log(this.zimmer.id);
    this.noteSchulzimmer.emit(this.zimmer);

  }

  ngOnChanges(){
    this.zimmer = this.selectedSchulzimmer;
    console.log("Zimmer beim Laden");
    console.log(this.zimmer);

  }




}

