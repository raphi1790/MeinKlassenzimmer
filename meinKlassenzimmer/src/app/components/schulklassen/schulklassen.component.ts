import { Component, OnInit, Input , OnChanges, ViewChild} from '@angular/core';
import { Router }            from '@angular/router';

import {Schulklasse} from 'app/models/schulklasse';
import {Schueler} from 'app/models/schueler';
import {Person} from 'app/models/person';

import {SchulklassenService} from 'app/services/schulklassen.service';
import {PersonService} from 'app/services/person.service';
import {AuthService} from 'app/services/auth/auth.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {SchuelerComponent} from 'app/components/schueler/schueler.component';
import { PersonDbHelper } from '../../helpers/person.DbHelper';

@Component({
  selector: 'app-schulklassen',
  templateUrl: './schulklassen.component.html',
  styleUrls: ['./schulklassen.component.css']
})



export class SchulklassenComponent implements OnInit {
  
  personDbHelper: PersonDbHelper;
  savingIsActiv: boolean;

  @Input() personid: number

  constructor(private klassenService: SchulklassenService, private personService: PersonService, private auth : AuthService ) {
    this.personDbHelper = new PersonDbHelper(personService, auth);
    this.maximalKlassenId = 0;


  }

  klassenToPerson: Schulklasse[];
  selectedSchulklasse: Schulklasse;
  maximalKlassenId: number;


  getSchulklassenToPerson() {

    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe(
      (data:Schulklasse[]) => {
        debugger;
        this.klassenToPerson = data});
  
  }


  onSelect(klasse: Schulklasse): void {
    debugger;
    this.selectedSchulklasse = klasse;


  }
  deleteSchulklasse(klasse: Schulklasse):void{
    this.klassenToPerson = this.klassenToPerson.filter(
      item =>
        item.id !== klasse.id);
    this.selectedSchulklasse = null;
    this.savingIsActiv = true;

  }

  addSchulklasseTmp(name: string): void {
    debugger;
    this.maximalKlassenId++;
    var neueKlasseTmp = new Schulklasse();
    neueKlasseTmp.name = name;
    neueKlasseTmp.id = this.maximalKlassenId;
    neueKlasseTmp.schueler = new Array<Schueler>();
    this.klassenToPerson.push(neueKlasseTmp);
    neueKlasseTmp = null;
    this.selectedSchulklasse = null;
    this.savingIsActiv = true;

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

  
  async saveSchulklasseSchueler(): Promise<void> {
    debugger;
    this.savingIsActiv = false; 
    this.personDbHelper.savePerson();
    await this.klassenService.updateKlassenAndSchueler(this.klassenToPerson).subscribe();
  }

  ngOnInit(){
    debugger;
    this.personDbHelper.getPerson();
    this.getSchulklassenToPerson();

  }

}
