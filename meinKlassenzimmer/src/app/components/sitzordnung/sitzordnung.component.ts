import { Component, OnInit, OnChanges } from '@angular/core';

import { Schulklasse } from 'app/models/schulklasse';
import { Schueler } from 'app/models/schueler';
import { SchulklassenComponent } from '../schulklassen/schulklassen.component';
import { SchulklassenService } from 'app/services/schulklassen.service';
import { SchulzimmerService } from 'app/services/schulzimmer.service';
import { Schulzimmer } from '../../models/schulzimmer';

@Component({
  selector: 'app-zuordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})
export class SitzordnungComponent {

  selectedSchulzimmer: Schulzimmer;
  selectedSchulklasse: Schulklasse;
  klassenToPerson: Schulklasse[];
  zimmerToPerson: Schulzimmer[];
  schulzimmerId: Number;
  schulklasseId: Number;
  showSitzordnung: boolean

  constructor(private klassenService: SchulklassenService, private zimmerService: SchulzimmerService) { 
    this.showSitzordnung = false;
  }

  loadInputData() {
    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe((data: Schulklasse[]) => { this.klassenToPerson = data });
    this.zimmerService.getSchulzimmerAndTischeByPersonid().subscribe((data: Schulzimmer[]) => { this.zimmerToPerson = data });

  }

  ngOnInit() {
    this.loadInputData();

  }

  selectSchulzimmer() {
    this.selectedSchulzimmer = this.zimmerToPerson.filter(item => item.id == this.schulzimmerId)[0];

  }
  selectSchulklasse() {
    this.selectedSchulklasse = this.klassenToPerson.filter(item => item.id == this.schulklasseId)[0];
  }
  randomizePlaces(){
    this.showSitzordnung = true;
  }

}
