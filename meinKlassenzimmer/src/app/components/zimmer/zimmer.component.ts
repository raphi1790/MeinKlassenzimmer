import { Component, OnInit, ViewEncapsulation, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { Schulzimmer } from '../../models/schulzimmer';
import { Tisch } from '../../models/tisch';
import { TischOutput } from '../../models/tischOutput';

@Component({
  selector: 'app-zimmer',
  templateUrl: './zimmer.component.html',
  styleUrls: ['./zimmer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ZimmerComponent implements  OnChanges {
  
  @Input('schulzimmerId') schulzimmerId: number
  @Input('selectedSchulzimmer')  selectedSchulzimmer: Schulzimmer; 
  
  @Output() noteSchulzimmer: EventEmitter<Schulzimmer> = new EventEmitter<Schulzimmer>();

  zimmerRows = [0,1,2,3,4,5,6,7,8,9];
  zimmerColumns = [0,1,2,3,4,5,6,7,8,9];


  // selectedTische: boolean[][];
  zimmer = new Schulzimmer();
  tischTmp = new Tisch();
  
  



  constructor() { 
    // this.selectedTische = new Array(this.zimmerRows.length )
    // for (let index = 0; index < this.selectedTische.length; index++) {
    //   this.selectedTische[index] = new Array(this.zimmerRows.length )
    //   for (let index2 = 0; index2 < this.selectedTische[index].length; index2++) {
    //       this.selectedTische[index][index2] = false;
        
    //   }
      
    // }  

    this.zimmer.tische = new Array();
  }

  private writeZimmer(tischOutput:TischOutput):void {
    debugger;
    this.tischTmp.position = tischOutput.position
    if(tischOutput.selected){
      this.zimmer.tische.push(this.tischTmp)
    }else{
      this.zimmer.tische = this.zimmer.tische.filter(
         item => item.position !== tischOutput.position
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

