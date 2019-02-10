import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TischOutput } from '../../models/output.tisch';
import { MAT_CHECKBOX_CLICK_ACTION, MatDialogRef, MatDialog } from '@angular/material';
import { Regel } from 'app/models/regel';
import { RegelChecker } from 'app/helpers/regel.checker';
import { RegelInfoDialogComponent } from '../regel-info-dialog/regel-info-dialog.component';

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


  constructor(public dialog: MatDialog) {
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
  regelInfoDialogRef: MatDialogRef<RegelInfoDialogComponent>;


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
        this.regelInfoDialogRef = this.dialog.open(RegelInfoDialogComponent, {
          height: '180px',
          width: '510px',
        });
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
          this.regelInfoDialogRef = this.dialog.open(RegelInfoDialogComponent, {
            height: '180px',
            width: '510px',
          });
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
