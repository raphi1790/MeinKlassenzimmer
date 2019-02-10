import { Component, OnInit,  Input, OnChanges, EventEmitter, Output, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {Schulklasse} from 'app/models/schulklasse';
import {Schueler} from 'app/models/schueler';
import { MatTable,MatPaginator, MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';
import { Regel } from 'app/models/regel';
import { RegelChecker } from 'app/helpers/regel.checker';
import { RegelInfoDialogComponent } from '../regel-info-dialog/regel-info-dialog.component';




@Component({
  selector: 'app-schueler',
  templateUrl: './schueler.component.html',
  styleUrls: ['./schueler.component.css']
})
export class SchuelerComponent implements OnChanges{
  regelChecker: RegelChecker;


  constructor(private ref: ChangeDetectorRef, public dialog: MatDialog) {
    this.schulklasse.schueler = new Array();
    this.regelChecker = new RegelChecker();
    this.anzahlSchueler = 0;

  }
  @Input('selectedSchulklasse')  selectedSchulklasse: Schulklasse;
  @Input('regelnToPerson') regelnToPerson: Regel[];
  @Output() noteSchulklasse: EventEmitter<Schulklasse> = new EventEmitter<Schulklasse>();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  schulklasse = new Schulklasse();
  displayedColumns = ['vorname', 'name', 'symbol'];
  dataSource = new MatTableDataSource<Schueler>();
  neuerSchuelerVorname: string; 
  neuerSchuelerName: string;
  neuerSchuelerVornameForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  anzahlSchueler: number;
  regelInfoDialogRef: MatDialogRef<RegelInfoDialogComponent>;

  getErrorMessageNeuerSchuelerVorname() {
    return this.neuerSchuelerVornameForm.hasError('required') ? 'Wert erforderlich' :
        this.neuerSchuelerVornameForm.hasError('minlength') ? 'Vorname zu kurz' :
            '';
  }
 

  deleteSchueler(deletedSchueler: Schueler):void{
    debugger;
    if(!this.regelChecker.regelExistsToSchueler(deletedSchueler, this.regelnToPerson)){
      this.schulklasse.schueler = this.schulklasse.schueler.filter(
        item => item.id != deletedSchueler.id
      );
  
      console.log("Klasse nach Update (Delete):");
      console.log(this.schulklasse);
      this.dataSource.data = this.schulklasse.schueler;
      this.noteSchulklasse.emit(this.schulklasse);
      this.anzahlSchueler--;
    }else{
      this.regelInfoDialogRef = this.dialog.open(RegelInfoDialogComponent, {
        height: '180px',
        width: '510px',
      });

    }
    
  
    
  };

  addSchueler():void {
    debugger;
    var schuelerTmp = new Schueler();
    schuelerTmp.id = uuidv4();
    schuelerTmp.schulklassenId = this.schulklasse.id;
    schuelerTmp.vorname = this.neuerSchuelerVorname;
    schuelerTmp.name = this.neuerSchuelerName;

    this.schulklasse.schueler.push(schuelerTmp);
    this.anzahlSchueler++;
    
    this.dataSource.data = this.schulklasse.schueler;

    console.log("Klasse nach Update (Adding):");
    console.log(this.schulklasse);

 
    this.noteSchulklasse.emit(this.schulklasse);
    this.neuerSchuelerVorname = null;
    this.neuerSchuelerName = null;

    this.neuerSchuelerVornameForm.markAsPristine();
    this.neuerSchuelerVornameForm.markAsUntouched();
    this.neuerSchuelerVornameForm.updateValueAndValidity();
    

  }
  ngOnChanges(){
    debugger;
    this.schulklasse = this.selectedSchulklasse;
    this.dataSource.data = this.schulklasse.schueler;
    this.anzahlSchueler = this.selectedSchulklasse.schueler.length;
    console.log("Schulklasse beim Laden");
    console.log(this.schulklasse);
    
    
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    

}
