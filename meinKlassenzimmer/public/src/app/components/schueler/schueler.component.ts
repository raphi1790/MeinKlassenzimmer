import { Component, OnInit,  Input, OnChanges, EventEmitter, Output, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import {Schulklasse} from 'app/models/schulklasse';
import {Schueler} from 'app/models/schueler';
import { MatTable } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'app-schueler',
  templateUrl: './schueler.component.html',
  styleUrls: ['./schueler.component.css']
})
export class SchuelerComponent implements OnChanges{


  constructor(private ref: ChangeDetectorRef) {
    this.schulklasse.schueler = new Array();
    this.maximalSchuelerId = 0;
    this.anzahlSchueler = 0;

  }
  @Input('selectedSchulklasse')  selectedSchulklasse: Schulklasse; 
  @Output() noteSchulklasse: EventEmitter<Schulklasse> = new EventEmitter<Schulklasse>();
  @ViewChild(MatTable) table: MatTable<any>;
  
  maximalSchuelerId: number;
  schulklasse = new Schulklasse();
  displayedColumns = ['vorname', 'name', 'symbol'];
  dataSource: Schueler[];
  neuerSchuelerVorname: string; 
  neuerSchuelerName: string;
  neuerSchuelerVornameForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  neuerSchuelerNameForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  anzahlSchueler: number;

  getErrorMessageNeuerSchuelerVorname() {
    return this.neuerSchuelerVornameForm.hasError('required') ? 'Wert erforderlich' :
        this.neuerSchuelerVornameForm.hasError('minlength') ? 'Vorname zu kurz' :
            '';
  }
  getErrorMessageNeuerSchuelerName() {
    return this.neuerSchuelerNameForm.hasError('required') ? 'Wert erforderlich' :
        this.neuerSchuelerNameForm.hasError('minlength') ? 'Name zu kurz' :
            '';
  }



  deleteSchueler(deletedSchueler: Schueler):void{
    debugger;
    this.schulklasse.schueler = this.schulklasse.schueler.filter(
      item => item.id != deletedSchueler.id
    );

    console.log("Klasse nach Update (Delete):");
    console.log(this.schulklasse);
    this.dataSource = this.schulklasse.schueler;
    this.noteSchulklasse.emit(this.schulklasse);
    this.anzahlSchueler--;
  
    
  };

  addSchueler():void {
    debugger;
    var schuelerTmp = new Schueler();
    schuelerTmp.id = this.maximalSchuelerId;
    schuelerTmp.vorname = this.neuerSchuelerVorname;
    schuelerTmp.name = this.neuerSchuelerName;
    this.schulklasse.schueler.push(schuelerTmp);
    this.maximalSchuelerId++;
    this.anzahlSchueler++;
    

    console.log("Klasse nach Update (Adding):");
    console.log(this.schulklasse);
    this.table.renderRows();
 
    this.noteSchulklasse.emit(this.schulklasse);
    this.neuerSchuelerVorname = null;
    this.neuerSchuelerName = null;
    

  }
  ngOnChanges(){
    debugger;
    this.schulklasse = this.selectedSchulklasse;
    this.dataSource = this.schulklasse.schueler;
    this.anzahlSchueler = this.selectedSchulklasse.schueler.length;
    console.log("Schulklasse beim Laden");
    console.log(this.schulklasse);
    
    
    
  }
    

}
