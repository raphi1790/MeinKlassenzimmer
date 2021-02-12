import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TischOutput } from '../../models/output.tisch';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { SitzordnungenRemover } from 'src/app/helpers/sitzordnungen.remover';

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
  sitzordnungRemover: SitzordnungenRemover;


  constructor(public dialog: MatDialog) {
    this.regelChecker = new RegelChecker();
    this.sitzordnungRemover = new SitzordnungenRemover()
   
   }


  @Input('TischOutput') tischOutput: TischOutput;
  @Input('currentTischNumber') currentTischNumber: number;
  @Input('regelnToPerson') regelnToPerson: Regel[];
  @Input('sitzordnungenToPerson') sitzordnungenToPerson: Sitzordnung[]

  @Output() noteSchulzimmer: EventEmitter<TischOutput> = new EventEmitter<TischOutput>();
  @Output() noteSchulzimmerTischNumber: EventEmitter<number> = new EventEmitter<number>();
  @Output() noteSitzordnungen: EventEmitter<Sitzordnung[]> = new EventEmitter<Sitzordnung[]>();

  tischStyle : string
  tischActive: boolean;
  tischDisabled: boolean;
  tischNumber: number;
  infoDialogRef: MatDialogRef<InfoDialogComponent>;


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
        // remove Tisch from Sitzordnungen
        
        this.sitzordnungenToPerson = this.sitzordnungRemover.removeTischFromSeating(this.tischOutput, this.sitzordnungenToPerson)
        this.noteSitzordnungen.emit(this.sitzordnungenToPerson)

      }
      else{
        this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
          width: '550px',
          data: {text: "Es existieren noch Regeln zu diesem Objekt, weshalb es nicht gelöscht werden kann. Bitte lösche zuerst die entsprechenden Regeln."}
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
          // remove Tisch from Sitzordnungen
          this.sitzordnungenToPerson = this.sitzordnungRemover.removeTischFromSeating(this.tischOutput, this.sitzordnungenToPerson)
          this.noteSitzordnungen.emit(this.sitzordnungenToPerson)
        }else{
          this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
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
