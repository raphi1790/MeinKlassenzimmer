import { Component, OnInit, Input , OnChanges, ViewChild} from '@angular/core';

import {Schulklasse} from '../../models/schulklasse';
import {Schueler} from '../../models/schueler';


import {SchulklassenService} from '../../services/schulklassen.service';
import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';
import { RegelService } from '../../services/regel.service';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { Name } from '../../models/name';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RegelInfoDialogComponent } from '../regel-info-dialog/regel-info-dialog.component';


@Component({
  selector: 'app-schulklassen',
  templateUrl: './schulklassen.component.html',
  styleUrls: ['./schulklassen.component.css'],
  
})



export class SchulklassenComponent implements OnInit {
  
  savingIsActiv: boolean;
  isLoadingSchulklasse: boolean;
  isSaving: boolean;
  klassenToPerson: Schulklasse[];
  klassenToPersonOriginal: Schulklasse[];
  isLoadingRegeln: boolean;
  regelnToPerson: Regel[];
  selectedSchulklasse: Schulklasse;
  regelChecker: RegelChecker;
  neueSchulklasseName: string
  neueSchulklasseForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  regelInfoDialogRef: MatDialogRef<RegelInfoDialogComponent>;


  @Input() personid: number
  
  

  constructor(private klassenService: SchulklassenService, private regelService: RegelService, public dialog: MatDialog) {
      this.regelChecker = new RegelChecker();
      
  }

 


  loadInputData() {

    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe(
      (data:Schulklasse[]) => {
        debugger;
        this.klassenToPerson = data;
        this.klassenToPersonOriginal = JSON.parse(JSON.stringify(this.klassenToPerson));
        this.isLoadingSchulklasse = false;
        this.regelService.getRegelByPersonid().subscribe(
          (data:Regel[]) => {
            debugger;
            this.regelnToPerson = data;
            this.isLoadingRegeln = false;
          });
        }
        );
  
  }


  getErrorMessageNeueSchulklasse() {
    return this.neueSchulklasseForm.hasError('required') ? 'Wert erforderlich' :
        this.neueSchulklasseForm.hasError('minlength') ? 'Name zu kurz' :
            '';
  }


  onSelect(selectedId: Name): void {
    debugger;
    this.selectedSchulklasse = this.klassenToPerson.filter(klasse => klasse.id == selectedId.id)[0];


  }
  deleteSchulklasse(selectedId: Name):void{
    debugger;
    let klasse = this.klassenToPerson.filter(klasse => klasse.id == selectedId.id)[0];
    if(!this.regelChecker.regelExistsToSchulklasse(klasse, this.regelnToPerson)){
      this.klassenToPerson = this.klassenToPerson.filter(
        item =>
          item.id !== klasse.id);
      this.selectedSchulklasse = null;
      this.savingIsActiv = true;
    }else{
      this.regelInfoDialogRef = this.dialog.open(RegelInfoDialogComponent, {
        height: '180px',
        width: '510px',
      });
    }
    

  }

  addSchulklasse(): void {
    debugger;
    var neueKlasseTmp = new Schulklasse();
    neueKlasseTmp.name = this.neueSchulklasseName;
    neueKlasseTmp.id = uuidv4();
    neueKlasseTmp.schueler = new Array<Schueler>();
    this.klassenToPerson.push(neueKlasseTmp);
    neueKlasseTmp = null;
    this.selectedSchulklasse = null;
    this.savingIsActiv = true;
    this.neueSchulklasseName = null;

    this.neueSchulklasseForm.markAsPristine();
    this.neueSchulklasseForm.markAsUntouched();
    this.neueSchulklasseForm.updateValueAndValidity();

  }

  updateSchulklasse(updatedKlasse: Schulklasse): void {
    debugger;
    this.klassenToPerson = this.klassenToPerson.filter(
      item =>
        item.id !== updatedKlasse.id)
    if (typeof this.klassenToPerson == 'undefined') {
      console.log("klassenToPerson is undefined");
    }
    else {
      this.klassenToPerson.push(updatedKlasse);
    }
    this.savingIsActiv = true;
  }
  onNameChange(newName : Name):void{
    debugger;
    let oldName = this.klassenToPerson.filter(klasse => klasse.id == newName.id)[0].name;
    if(oldName != newName.text){
      this.klassenToPerson.filter(klasse => klasse.id == newName.id)[0].name = newName.text;
      this.savingIsActiv = true;
    }
    

  }
  canDeactivate(){
    debugger;
    return !this.savingIsActiv;
  }

  
  async saveSchulklasseSchueler(): Promise<void> {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    await this.klassenService.updateKlassenAndSchueler(this.klassenToPerson).subscribe(() => this.isSaving = false);
    this.klassenToPersonOriginal = this.klassenToPerson;
  }
  cancel(){
    debugger;
    this.klassenToPerson = JSON.parse(JSON.stringify(this.klassenToPersonOriginal));
    this.savingIsActiv = false;
  }

  ngOnInit(){
    debugger;
    this.isLoadingRegeln = true;
    this.isLoadingSchulklasse = true;
    this.loadInputData();

  }

}