import { Component, OnInit, ViewEncapsulation, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { Schulzimmer } from '../../models/schulzimmer';
import { Tisch } from '../../models/tisch';
import { TischOutput } from '../../models/output.tisch';
import { Schulklasse } from '../../models/schulklasse';
import { Schueler } from '../../models/schueler';
import { Randomizer } from '../../helpers/randomizer';

@Component({
  selector: 'app-zimmer-vereinfacht',
  templateUrl: './zimmer-vereinfacht.component.html',
  styleUrls: ['./zimmer-vereinfacht.component.css']
})
export class ZimmerVereinfachtComponent implements OnInit {
  
  @Input('selectedSchulzimmer')  selectedSchulzimmer: Schulzimmer; 
  @Input('selectedSchulklasse')  selectedSchulklasse: Schulklasse; 

  zimmerRows = [0,1,2,3,4,5,6,7,8,9];
  zimmerColumns = [0,1,2,3,4,5,6,7,8,9];

  zimmer = new Schulzimmer();
  tischStyle : string;
  schuelerPrepared: Schueler[];
  randomizer: Randomizer;

  schuelerIndex: number;

  
  constructor() { 
    this.randomizer = new Randomizer();
    this.zimmer.tische = new Array();
  }

  increaseSchuelerIndex(increased: boolean){
    if(increased){
      this.schuelerIndex++
    }
    console.log("schuelerIndex");
    console.log(this.schuelerIndex);

  }

  ngOnInit(){
    this.schuelerIndex = 0;
    this.zimmer = this.selectedSchulzimmer;
    this.schuelerPrepared = this.randomizer.randomizeSchueler(this.selectedSchulklasse.schueler, this.selectedSchulzimmer.tische.length);
    console.log("Randomized Schueler");
    console.log(this.schuelerPrepared);

  }

}










