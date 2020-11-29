import { Component, OnInit,  Input, OnChanges, EventEmitter, Output, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';

import {Schulklasse} from '../../models/schulklasse';
import {Schueler} from '../../models/schueler';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { Klassenliste } from 'src/app/models/klassenliste';
import { KlassenlistenRemover } from '../../helpers/klassenlisten.remover';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';




@Component({
  selector: 'app-schueler',
  templateUrl: './schueler.component.html',
  styleUrls: ['./schueler.component.css']
})
export class SchuelerComponent implements OnChanges, AfterViewInit {
  regelChecker: RegelChecker;


  constructor(private ref: ChangeDetectorRef, public dialog: MatDialog) {
    this.schulklasse.schueler = new Array();
    this.regelChecker = new RegelChecker();
    this.anzahlSchueler = 0;

  }
  @Input('selectedSchulklasse')  selectedSchulklasse: Schulklasse;
  @Input('regelnToPerson') regelnToPerson: Regel[];
  @Input('klassenlistenToPerson') klassenlistenToPerson: Klassenliste[];
  @Output() noteSchulklasse: EventEmitter<Schulklasse> = new EventEmitter<Schulklasse>();
  @Output() noteKlassenlisten: EventEmitter<Klassenliste[]> = new EventEmitter<Klassenliste[]>();
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  
  schulklasse = new Schulklasse();
  displayedColumns = ['vorname', 'name', 'symbol'];
  dataSource = new MatTableDataSource<Schueler>();
  neuerSchuelerVorname: string; 
  neuerSchuelerName: string;
  neuerSchuelerVornameForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  anzahlSchueler: number;
  infoDialogRef: MatDialogRef<InfoDialogComponent>;

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
      // remove Schueler from Klassenlisten
      let klassenlistenRemover = new KlassenlistenRemover()
      this.klassenlistenToPerson = klassenlistenRemover.removeSchuelerFromKlassenlisten(deletedSchueler, this.klassenlistenToPerson)
      // console.log("Klasse nach Update (Delete):");
      // console.log(this.schulklasse);
      this.dataSource.data = this.schulklasse.schueler;
      this.noteSchulklasse.emit(this.schulklasse);
      this.noteKlassenlisten.emit(this.klassenlistenToPerson)
      this.anzahlSchueler--;
    }else{
      this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
        width: '550px',
        data: {text: "Es existieren noch Regeln zu diesem Objekt, weshalb es nicht gelöscht werden kann. Bitte lösche zuerst die entsprechenden Regeln."}
        
      });

    }
    
  
    
  };

  addSchueler():void {
    debugger;
    var schuelerTmp = new Schueler({
      id: uuidv4(),
      schulklassenId:this.schulklasse.id,
      name:this.neuerSchuelerName,
      vorname:this.neuerSchuelerVorname
    });
    this.schulklasse.schueler.push(schuelerTmp);
    this.anzahlSchueler++;
    
    this.dataSource.data = this.schulklasse.schueler;

    // console.log("Klasse nach Update (Adding):");
    // console.log(this.schulklasse);

 
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
    // console.log("Schulklasse beim Laden");
    // console.log(this.schulklasse);
    
    
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    

}
