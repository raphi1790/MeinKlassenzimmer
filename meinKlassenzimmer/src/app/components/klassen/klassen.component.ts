import { Component, OnInit, Input , OnChanges} from '@angular/core';
import { Router }            from '@angular/router';

import {Klasse} from 'app/models/klasse';
import {Schueler} from 'app/models/schueler';
import {KlassenService} from 'app/services/klassen.service';

@Component({
  selector: 'app-klassen',
  templateUrl: './klassen.component.html',
  styleUrls: ['./klassen.component.css']
})
export class KlassenComponent implements OnInit {

 @Input() personid: number

  constructor(private klassenService: KlassenService) { }

  klassenToPerson: Klasse[];
  selectedKlasse: Klasse;
  schuelerToPerson: Schueler[];

  getKlassenToPerson():void {
    this.klassenService.getKlassenByPersonid()
    .then(
        klassen => 
            this.klassenToPerson = klassen);
    console.log("service1");
  }

   onSelect(klasse: Klasse): void {
    this.selectedKlasse = klasse;

  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.klassenService.createKlasse(name)
      .then(klasse => {
        this.klassenToPerson.push(klasse);
        this.selectedKlasse = null;
      });
  }

  ngOnInit(){
    this.getKlassenToPerson();
  }

}
