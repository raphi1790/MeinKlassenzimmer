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
export class ZimmerComponent implements OnInit, OnChanges {
  
  @Input('schulzimmerId') schulzimmerId: number
  @Input('schulzimmerToPerson')  schulzimmerToPerson: Schulzimmer[]; 
  
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

  getSchuelerToKlassenid(id: number):void{

    debugger;
      
    this.zimmer = this.schulzimmerToPerson.filter(
          item => 
            item.id === id )[0]
    
    
}

  private writeZimmer(tischOutput:TischOutput):void {
    this.tischTmp.position = tischOutput.position
    if(tischOutput.selected){
      // this.selectedTische[tischOutput.position.row][tischOutput.position.column] = true;
      this.zimmer.tische.push(this.tischTmp)
    }else{
      // this.selectedTische[tischOutput.position.row][tischOutput.position.column] = false;
      this.zimmer.tische.filter(function(tisch) {
        return tisch.position !== tischOutput.position} )
    } 
    console.log(this.zimmer.tische);

  }

  ngOnInit() {
    this.getSchuelerToKlassenid(this.schulzimmerId);
  }
  ngOnChanges(){
    this.noteSchulzimmer.emit(this.zimmer);

  }

}

