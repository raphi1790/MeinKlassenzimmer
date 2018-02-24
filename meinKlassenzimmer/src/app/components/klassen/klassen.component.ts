import { Component, OnInit, Input , OnChanges, ViewChild} from '@angular/core';
import { Router }            from '@angular/router';

import {Klasse} from 'app/models/klasse';
import {Schueler} from 'app/models/schueler';
import {Person} from 'app/models/person';

import {KlassenService} from 'app/services/klassen.service';
import {PersonService} from 'app/services/person.service';
import {AuthService} from 'app/services/auth/auth.service';
import { KlassenSchuelerSaver } from 'app/components/klassen/klassenschuelersaver';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {SchuelerComponent} from 'app/components/schueler/schueler.component';
import { SaveChecker } from 'app/savechecker';

@Component({
  selector: 'app-klassen',
  templateUrl: './klassen.component.html',
  styleUrls: ['./klassen.component.css']
})



export class KlassenComponent implements OnInit, AfterViewInit {
  
  neueKlassenTmp:  Klasse[] = [];
  klassenToPerson: Klasse[] = [];
  deletedKlassenTmp: Klasse[] = [];
  selectedKlasse: Klasse;
  schuelerToPerson: Schueler[] = [];
  person: Person = new Person;
  neuePersonTmp: Person = new Person;
  savingIsActive: boolean;
  profile: any;
  neueSchuelerTmp: Schueler[] = [];
  deletedSchuelerTmp: Schueler[] = [];
  

  @ViewChild(SchuelerComponent) SchuelerComponent;


 
  constructor(private klassenService: KlassenService, private personService: PersonService) {
    
   }

  getKlassenAndSchuelerToPerson():void {
     debugger;
    this.klassenService.getKlassenByPersonid()
    .subscribe( 
        klassen => this.klassenToPerson = klassen       
        );   
           
    this.klassenService.getSchuelerByPersonid()
    .subscribe(
      schueler =>
            this.schuelerToPerson = schueler);        
  }

  onSelect(klasse: Klasse): void {
    this.selectedKlasse = klasse;

  }



  addKlasseTmp(name: string):void {
    var neueKlasseTmp = new Klasse();
    neueKlasseTmp.setName(name);
    this.neueKlassenTmp.push(neueKlasseTmp);
    this.klassenToPerson.push(neueKlasseTmp);
    neueKlasseTmp = null;
    this.selectedKlasse = null;
 
  }

  

  savingIsActiv(): boolean{
    var saveChecker = new SaveChecker()
    return saveChecker.klasseSchuelerNeedSaving(this.neueKlassenTmp, this.deletedKlassenTmp,this.neueSchuelerTmp ,this.deletedSchuelerTmp);
  }

  deleteKlasseTmp(klasse:Klasse):void{
    this.deletedKlassenTmp.push(klasse);
    this.klassenToPerson = this.klassenToPerson.filter(k => k!== klasse);
    if (this.selectedKlasse === klasse) { this.selectedKlasse = null; }
  }

  saveKlassenSchueler(): void {
    var savingObject = new KlassenSchuelerSaver();
    savingObject.save(this.neueKlassenTmp, this.deletedKlassenTmp,this.neueSchuelerTmp ,this.deletedSchuelerTmp);
    this.neueKlassenTmp = null;
    this.deletedKlassenTmp = null;
    this.neueSchuelerTmp = null
    this.deletedSchuelerTmp = null;
    
  }

  ngOnInit(){
    debugger;
    this.getKlassenAndSchuelerToPerson();
  }

  ngAfterViewInit(){
    this.neueSchuelerTmp = this.SchuelerComponent.neueSchuelerTmp
    this.deletedSchuelerTmp = this.SchuelerComponent.deletedSchuelerTmp
  }

}
