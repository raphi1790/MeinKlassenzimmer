import { Component, OnInit, Input , OnChanges} from '@angular/core';
import { Router }            from '@angular/router';

import {Klasse} from 'app/models/klasse';
import {Schueler} from 'app/models/schueler';
import {Person} from 'app/models/person';

import {KlassenService} from 'app/services/klassen.service';
import {PersonService} from 'app/services/person.service';
import {AuthService} from 'app/services/auth/auth.service';

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
  neuePersonTmp: Person;
  savingIsActive: boolean;
  profile: any;

 @Input() personid: number

  constructor(private klassenService: KlassenService, private personService: PersonService, public auth: AuthService) { }



  getKlassenAndSchuelerToPerson():void {
     debugger;
    this.klassenService.getKlassenByPersonid()
    .subscribe( 
        data => 
            this.klassenToPerson = data['Schulklasse']);   
    this.klassenService.getSchuelerByPersonid()
    .subscribe(
      data =>
            this.schuelerToPerson = data['Schueler']);
    this.personService.getPerson()
    .subscribe( 
        data => 
            this.person = data['Person']);             
  }

  onSelect(klasse: Klasse): void {
    this.selectedKlasse = klasse;

  }

  private addPersonTmp(): void{
    this.neuePersonTmp.geschlecht = this.profile.gender;
    this.neuePersonTmp.name = this.profile.family_name;
    this.neuePersonTmp.vorname = this.profile.given_name;
    this.neuePersonTmp.nickname = this.profile.nickname;

  }

  addKlasseTmp(name: string):void {
    var neueKlasseTmp = new Klasse(name);
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

  private personNeedSaving(): boolean{
    if(this.person == undefined ){
      return true;
    }
    else{
      return false;
    }
  }

  deleteKlasseTmp(klasse:Klasse):void{
    this.deletedKlassenTmp.push(klasse);
    this.klassenToPerson = this.klassenToPerson.filter(k => k!== klasse);
    if (this.selectedKlasse === klasse) { this.selectedKlasse = null; }
  }

  save(): void {
    debugger;
    if (this.personNeedSaving()){
      this.addPersonTmp()
      this.personService.createPerson(this.neuePersonTmp);
    }

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
    this.getKlassenAndSchuelerToPerson();
    debugger;
    if (this.auth.userProfile) {
      
      this.profile = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }

}
