import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PositionTisch } from '../../models/position.tisch';
import { TischOutput } from '../../models/output.tisch';
import { Tisch } from '../../models/tisch';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';

@Component({
  selector: 'app-tisch',
  templateUrl: './tisch.component.html',
  styleUrls: ['./tisch.component.css'],
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'}
  ]
})
export class TischComponent implements OnChanges {

  constructor() { }


  @Input('TischOutput') tischOutput: TischOutput;

  @Output() noteSchulzimmer: EventEmitter<TischOutput> = new EventEmitter<TischOutput>();

  tischStyle : string
  tischActive: boolean;
  tischDisabled: boolean;


  getTisch():void{

    debugger;
    console.log("Get Tisch")
    if(this.tischOutput.selected){
      this.tischStyle = 'selectedTischStyle';
      if(this.tischOutput.active){
        this.tischActive = true;
        this.tischDisabled = false;
      }
      else{
        this.tischActive = false;
        this.tischDisabled = false;
      }
      
    }else{
      this.tischStyle = 'unselectedTischStyle';
      this.tischActive = false;
      this.tischDisabled = true;
    }
  }

    
  selectTisch(): void {
    debugger;
    console.log("Selektieren Tisch")
    if (this.tischOutput.selected) {
      this.tischStyle = 'unselectedTischStyle';
      this.tischOutput.selected = false;
      this.tischActive = false;
      this.tischDisabled = true;
     
      
    } else {
      this.tischStyle = 'selectedTischStyle';
      this.tischOutput.selected = true;
      this.tischActive = true;
      this.tischDisabled = false;
      
      
    
    }
    this.tischOutput.active = this.tischActive;
    this.noteSchulzimmer.emit(this.tischOutput);
  }

  activateTisch():void{
    debugger;
    if(!this.tischDisabled){
      if(this.tischActive){
        this.tischActive = false;
        console.log("Tisch-Checkbox (Active): "+ this.tischActive);
        console.log("Tisch-Checkbox (Disabled): "+ this.tischDisabled);
  
      }
      else{
        this.tischActive =  true;
        console.log("Tisch-Checkbox (Active): "+ this.tischActive);
        console.log("Tisch-Checkbox (Disabled): "+ this.tischDisabled);
      }
    }
    this.tischOutput.active = this.tischActive;
    this.noteSchulzimmer.emit(this.tischOutput);
    
   
  }

  ngOnChanges() {
    this.getTisch();
  }


}
