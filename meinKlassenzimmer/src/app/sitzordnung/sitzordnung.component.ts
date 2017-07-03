import { Component, OnInit, OnChanges } from '@angular/core';

import {Klasse} from '../models/klasse';
import {Schueler} from '../models/schueler';
import {KlassenComponent } from '../klassen/klassen.component';
import {KlassenService} from '../klassen.service';

@Component({
  selector: 'app-zuordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})
export class SitzordnungComponent implements OnInit {

  klassen: Klasse[];
  schueler: Schueler[];

  constructor(private klassenService : KlassenService ) { }

    getKlassenToPerson():Klasse[] {
      this.klassenService.getKlassenByPersonid().then(klassen => this.klassen = klassen);
      return this.klassen;
  }

  ngOnInit() {
    this.klassen  = this.getKlassenToPerson();
        
  }

}
