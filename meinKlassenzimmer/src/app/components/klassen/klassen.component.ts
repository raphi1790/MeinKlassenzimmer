import { Component, OnInit, Input , OnChanges} from '@angular/core';
import { Router }            from '@angular/router';

import {Klasse} from 'app/models/klasse';
import {Schueler} from 'app/models/schueler';
import {Person} from 'app/models/person';

import {KlassenService} from 'app/services/klassen.service';

@Component({
  selector: 'app-klassen',
  templateUrl: './klassen.component.html',
  styleUrls: ['./klassen.component.css']
})
export class KlassenComponent implements OnInit {
  neueKlassenTmp:  Klasse[] = new Array();
  klassenToPerson: Klasse[];
  deletedKlassenTmp: Klasse[] = new Array();
  selectedKlasse: Klasse;
  schuelerToPerson: Schueler[];
  person: Person;
  savingIsActive: boolean;

 @Input() personid: number

  constructor(private klassenService: KlassenService) { }



  getKlassenToPerson():void {
    this.klassenService.getKlassenByPersonid()
    .then(
        klassen => 
            this.klassenToPerson = klassen);
  }

   onSelect(klasse: Klasse): void {
    this.selectedKlasse = klasse;

  }

  addKlasseTmp(name: string):void {
    var neueKlasseTmp = new Klasse(3,name);
    this.neueKlassenTmp.push(neueKlasseTmp);
    this.klassenToPerson.push(neueKlasseTmp);
    neueKlasseTmp = null;
    this.selectedKlasse = null;

  }


  savingIsActiv(): boolean{
    if (this.needSaving()){
      return this.savingIsActive = true;
    }
    else{
      return this.savingIsActive = false;
    }
  }

  private needSaving(): boolean{
    if( (this.neueKlassenTmp == null || this.neueKlassenTmp.length == 0 )
      && (this.deletedKlassenTmp == null || this.deletedKlassenTmp.length == 0)){
        return false;
      }
     else{
       return true;
     } 
      
  }

  deleteKlasseTmp(klasse:Klasse):void{
    this.deletedKlassenTmp.push(klasse);
    this.klassenToPerson = this.klassenToPerson.filter(k => k!== klasse);
    if (this.selectedKlasse === klasse) { this.selectedKlasse = null; }
  }

  save(): void {
    debugger;
    if (this.neueKlassenTmp.length > 0) {
      for (let klasse of this.neueKlassenTmp){
         this.klassenService.createKlasseToPersonid(klasse);
       };
       this.neueKlassenTmp = null;
    }   
    if (this.deletedKlassenTmp.length > 0){
      for (let klasse of this.deletedKlassenTmp){
         this.klassenService.deleteKlasseToPersonid(klasse.id);
       };
       this.deletedKlassenTmp = null;
    }

    
  }

  ngOnInit(){
    this.getKlassenToPerson();
  }

}
