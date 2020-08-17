import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TischOutput } from '../../models/output.tisch';
import { MAT_CHECKBOX_CLICK_ACTION, MatDialogRef, MatDialog } from '@angular/material';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
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
  @Input('currentTischNumber') currentTischNumber: number;
  @Input('regelnToPerson') regelnToPerson: Regel[];

  @Output() noteSchulzimmer: EventEmitter<TischOutput> = new EventEmitter<TischOutput>();
  @Output() noteSchulzimmerTischNumber: EventEmitter<number> = new EventEmitter<number>();

  tischStyle : string
  tischActive: boolean;
  tischDisabled: boolean;
  tischNumber: number;
  regelInfoDialogRef: MatDialogRef<RegelInfoDialogComponent>;


  getTisch():void{

    debugger;
    // console.log("Get Tisch")
    this.tischNumber = this.tischOutput.tischNumber;
      // console.log("tischNumber: " + this.tischNumber );
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
      this.tischNumber = null;
    }


  }

    
  selectTisch(): void {
    debugger;
    // console.log("Selektieren Tisch")
    if (this.tischOutput.selected) {
      if(!this.regelChecker.regelExistsToTischId(this.tischOutput.tischId, this.regelnToPerson)){
        this.tischStyle = 'unselectedTischStyle';
        this.tischOutput.selected = false;
        this.tischActive = false;
        this.tischDisabled = true;
        this.tischOutput.tischNumber = null; 
        this.tischNumber = null;
        this.tischOutput.active = this.tischActive;
        this.noteSchulzimmer.emit(this.tischOutput);
        this.noteSchulzimmerTischNumber.emit(this.currentTischNumber);
      }
      else{
        this.regelInfoDialogRef = this.dialog.open(RegelInfoDialogComponent, {
          height: '210px',
          width: '550px',
        });
      }
     
    } else {
      this.tischStyle = 'selectedTischStyle';
      this.tischOutput.selected = true;
      this.tischActive = true;
      this.tischDisabled = false;
      this.currentTischNumber++ ;
      this.tischOutput.tischNumber = this.currentTischNumber; 
      this.tischOutput.active = this.tischActive;
      this.noteSchulzimmer.emit(this.tischOutput);
      this.noteSchulzimmerTischNumber.emit(this.currentTischNumber);


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
