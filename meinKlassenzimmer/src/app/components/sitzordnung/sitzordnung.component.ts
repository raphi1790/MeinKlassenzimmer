import { Component, OnInit, OnChanges } from '@angular/core';

import {Schulklasse} from 'app/models/schulklasse';
import {Schueler} from 'app/models/schueler';
import {SchulklassenComponent } from '../schulklassen/schulklassen.component';
import {SchulklassenService} from 'app/services/schulklassen.service';

@Component({
  selector: 'app-zuordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})
export class SitzordnungComponent  {

  // klassen: Schulklasse[];
  // schueler: Schueler[];

  // constructor(private klassenService : SchulklassenService ) { }

  //   getKlassenToPerson():Schulklasse[] {
  //     this.klassenService.getKlassenAndSchuelerByPersonid().subscribe(klassen => this.klassen = klassen);
  //     return this.klassen;
  // }

  // ngOnInit() {
  //   this.klassen  = this.getKlassenToPerson();
        
  // }

}
