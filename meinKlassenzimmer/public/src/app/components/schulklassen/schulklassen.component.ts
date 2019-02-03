import { Component, OnInit, Input , OnChanges, ViewChild} from '@angular/core';

import {Schulklasse} from 'app/models/schulklasse';
import {Schueler} from 'app/models/schueler';


import {SchulklassenService} from 'app/services/schulklassen.service';
import {AuthService} from 'app/services/auth/auth.service';
import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';
import { RegelService } from 'app/services/regel.service';
import { Regel } from 'app/models/regel';
import { RegelChecker } from 'app/helpers/regel.checker';


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


  @Input() personid: number
  
  

  constructor(private klassenService: SchulklassenService, private regelService: RegelService) {
      this.regelChecker = new RegelChecker();
      
  }

 


  loadInputData() {

    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe(
      (data:Schulklasse[]) => {
        debugger;
        this.klassenToPerson = data;
        this.klassenToPersonOriginal = data;
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


  onSelect(klasse: Schulklasse): void {
    debugger;
    this.selectedSchulklasse = klasse;


  }
  deleteSchulklasse(klasse: Schulklasse):void{
    debugger;
    if(!this.regelChecker.regelExistsToSchulklasse(klasse, this.regelnToPerson)){
      this.klassenToPerson = this.klassenToPerson.filter(
        item =>
          item.id !== klasse.id);
      this.selectedSchulklasse = null;
      this.savingIsActiv = true;
    }else{
      window.confirm("Es existieren noch Regeln zu dieser Schulklasse, weshalb sie nicht gelöscht werden kann. Bitte lösche zuerst die entsprechende Regeln.");
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
    this.klassenToPerson = this.klassenToPersonOriginal;
    this.savingIsActiv = false;
  }

  ngOnInit(){
    debugger;
    this.isLoadingRegeln = true;
    this.isLoadingSchulklasse = true;
    this.loadInputData();

  }

}
