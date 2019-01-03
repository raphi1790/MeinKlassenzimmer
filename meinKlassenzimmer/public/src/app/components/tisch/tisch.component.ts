import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TischOutput } from '../../models/output.tisch';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { Regel } from 'app/models/regel';
import { RegelChecker } from 'app/helpers/regel.checker';

@Component({
  selector: 'app-tisch',
  templateUrl: './tisch.component.html',
  styleUrls: ['./tisch.component.css'],
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'}
  ]
})
export class TischComponent implements OnChanges {
  regelChecker: RegelChecker;


  constructor() {
    this.regelChecker = new RegelChecker();
   }


  @Input('TischOutput') tischOutput: TischOutput;
  @Input('currentTableNumber') currentTableNumber: number;
  @Input('regelnToPerson') regelnToPerson: Regel[];

  @Output() noteSchulzimmer: EventEmitter<TischOutput> = new EventEmitter<TischOutput>();
  @Output() noteSchulzimmerTableNumber: EventEmitter<number> = new EventEmitter<number>();

  tischStyle : string
  tischActive: boolean;
  tischDisabled: boolean;
  tableNumber: number;


  getTisch():void{

    debugger;
    console.log("Get Tisch")
    this.tableNumber = this.tischOutput.tableNumber;
      console.log("tableNumber: " + this.tableNumber );
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
      this.tableNumber = null;
    }


  }

    
  selectTisch(): void {
    debugger;
    console.log("Selektieren Tisch")
    if (this.tischOutput.selected) {
      if(!this.regelChecker.regelExistsToTischId(this.tischOutput.tischId, this.regelnToPerson)){
        this.tischStyle = 'unselectedTischStyle';
        this.tischOutput.selected = false;
        this.tischActive = false;
        this.tischDisabled = true;
        this.tischOutput.tableNumber = null; 
        this.tableNumber = null;
        this.tischOutput.active = this.tischActive;
        this.noteSchulzimmer.emit(this.tischOutput);
        this.noteSchulzimmerTableNumber.emit(this.currentTableNumber);
      }
      else{
        window.confirm("Es existieren noch Regeln zu diesem Tisch, weshalb er nicht gelöscht werden kann. Bitte lösche zuerst die entsprechende Regeln.");
      }
     
    } else {
      this.tischStyle = 'selectedTischStyle';
      this.tischOutput.selected = true;
      this.tischActive = true;
      this.tischDisabled = false;
      this.currentTableNumber++ ;
      this.tischOutput.tableNumber = this.currentTableNumber; 
      this.tischOutput.active = this.tischActive;
      this.noteSchulzimmer.emit(this.tischOutput);
      this.noteSchulzimmerTableNumber.emit(this.currentTableNumber);


    }
    
  }

  activateTisch():void{
    debugger;
    if(!this.tischDisabled){
      if(this.tischActive){
        if(!this.regelChecker.regelExistsToTischId(this.tischOutput.tischId, this.regelnToPerson)){
          this.tischActive = false;
          this.tischOutput.active = this.tischActive;
          this.noteSchulzimmer.emit(this.tischOutput);
        }else{
          window.confirm("Es existieren noch Regeln zu diesem Tisch, weshalb er nicht deaktiviert werden kann. Bitte lösche zuerst die entsprechende Regeln.");
        }
        
  
      }
      else{
        this.tischActive =  true;
        this.tischOutput.active = this.tischActive;
        this.noteSchulzimmer.emit(this.tischOutput);
      
      }
    }
    
    
   
  }

  ngOnChanges() {
    this.getTisch();
  }


}
