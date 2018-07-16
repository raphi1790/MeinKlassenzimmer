import { Component, OnInit, OnChanges } from '@angular/core';

import { Schulklasse } from 'app/models/schulklasse';
import { Schueler } from 'app/models/schueler';
import { TischSchueler } from 'app/models/tisch.schueler';
import { SchulklassenComponent } from '../schulklassen/schulklassen.component';
import { SchulklassenService } from 'app/services/schulklassen.service';
import { SchulzimmerService } from 'app/services/schulzimmer.service';
import { Schulzimmer } from '../../models/schulzimmer';
import { TischSchuelerPreparer } from '../../helpers/tischSchueler.preparer';

var CONFIG = require('../../../../config.json');

@Component({
  selector: 'app-zuordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})
export class SitzordnungComponent {

  selectedSchulzimmer: Schulzimmer;
  selectedSchulklasse: Schulklasse;
  outputSchulzimmer: Schulzimmer;
  outputSchulklasse: Schulklasse;
  klassenToPerson: Schulklasse[];
  zimmerToPerson: Schulzimmer[];
  schulzimmerId: Number;
  schulklasseId: Number;
  showSitzordnung: boolean
  tischSchuelerPreparer: TischSchuelerPreparer;
  rowSchulzimmer: number[];
  columnSchulzimmer: number[];
  preparedTischSchueler: TischSchueler[][];
  zuvieleSchuelerInSchulzimmer: boolean;


  

  constructor(private klassenService: SchulklassenService, private zimmerService: SchulzimmerService) { 
    this.showSitzordnung = false;
    this.zuvieleSchuelerInSchulzimmer = false;
    this.rowSchulzimmer = Array.from(new Array(CONFIG.numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array(CONFIG.numberOfColumns),(val,index)=>index);
  }

  getErrorMessageZuvieleSchuelerInSchulzimmer(){
     return "Es passen nicht alle Schüler ins Schulzimmer!"
  }

  loadInputData() {
    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe((data: Schulklasse[]) => { this.klassenToPerson = data });
    this.zimmerService.getSchulzimmerAndTischeByPersonid().subscribe((data: Schulzimmer[]) => { this.zimmerToPerson = data });

  }
 
  selectSchulklasse() {
    this.selectedSchulklasse = this.klassenToPerson.filter(item => item.id == this.schulklasseId)[0];
  }
  randomizePlaces(){
    debugger;
    if(this.selectedSchulzimmer.tische.length < this.selectedSchulklasse.schueler.length){
      this.zuvieleSchuelerInSchulzimmer = true;
      this.showSitzordnung = false;

    }
    else{
      this.zuvieleSchuelerInSchulzimmer = false;
      this.tischSchuelerPreparer = new TischSchuelerPreparer();
      this.showSitzordnung = true;
      this.outputSchulzimmer = this.selectedSchulzimmer;
      this.outputSchulklasse = this.selectedSchulklasse;
      this.preparedTischSchueler = this.tischSchuelerPreparer.prepareTischSchuelerCombination(this.outputSchulzimmer.tische, this.outputSchulklasse.schueler)
      console.log("Randomized SchuelerTischArray");
      console.log(this.preparedTischSchueler);

    }
    

  }

  ngOnInit() {
    this.loadInputData();

  }



}
