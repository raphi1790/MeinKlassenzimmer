import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SpeichernInfoDialogComponent } from '../speichern-info-dialog/speichern-info-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-speichern',
  templateUrl: './speichern.component.html',
  styleUrls: ['./speichern.component.css']
})
export class SpeichernComponent implements OnInit, OnChanges {

  constructor(public dialog: MatDialog) { }

  @Output() saveData: EventEmitter<null> = new EventEmitter();
  @Output() cancelData: EventEmitter<null> = new EventEmitter();
  @Input('savingIsActive')  savingIsActive: boolean;

  saveActionIsNotNecessary = false;
  speichernInfoDialogRef: MatDialogRef<SpeichernInfoDialogComponent>;



  save(){
    if(this.savingIsActive){
      this.saveData.emit();
    }else{
      this.saveActionIsNotNecessary = true;
     
    }

    

  }
  cancel(){
    debugger;
     this.speichernInfoDialogRef = this.dialog.open(SpeichernInfoDialogComponent, {
        height: '180px',
        width: '430px',
      });
      this.speichernInfoDialogRef.afterClosed().subscribe(result => {
        if(result){
          this.cancelData.emit();
        }
      });
      
  }
  ngOnInit() {
  }

  ngOnChanges(){
    debugger;
    if(this.savingIsActive){
      this.saveActionIsNotNecessary = false;
    }
    
  }

}
