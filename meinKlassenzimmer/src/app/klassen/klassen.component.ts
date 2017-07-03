import { Component, OnInit, Input , OnChanges} from '@angular/core';
import { Router }            from '@angular/router';

import {Klasse} from '../models/klasse';
import {Schueler} from '../models/schueler';
import {KlassenService} from '../klassen.service';
import {SchuelerService} from '../schueler.service';

@Component({
  selector: 'app-klassen',
  templateUrl: './klassen.component.html',
  styleUrls: ['./klassen.component.css']
})
export class KlassenComponent implements OnInit {

 @Input() personid: number

  constructor(private klassenService: KlassenService, private schuelerService : SchuelerService) { }

  klassenToPerson: Klasse[];
  selectedKlasse: Klasse;
  schuelerToPerson: Schueler[];

  getKlassenToPerson():Klasse[] {
    this.klassenService.getKlassenByPersonid().then(klassen => this.klassenToPerson = klassen);
    return this.klassenToPerson;
  }
  getSchuelerToPerson(): Schueler[]{
    this.schuelerService.getSchuelerByPersonid()
    .then(
      schueler =>
       this.schuelerToPerson = schueler );
       return this.schuelerToPerson;
  
  } 

   onSelect(klasse: Klasse): void {
    this.selectedKlasse = klasse;

    
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.klassenService.create(name)
      .then(klasse => {
        this.klassenToPerson.push(klasse);
        this.selectedKlasse = null;
      });
  }

  ngOnInit(){
    this.getKlassenToPerson();
    this.getSchuelerToPerson();
  }

}
