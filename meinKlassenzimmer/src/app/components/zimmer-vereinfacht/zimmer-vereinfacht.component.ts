import { Component, OnInit, ViewEncapsulation, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { Schulzimmer } from '../../models/schulzimmer';
import { Tisch } from '../../models/tisch';
import { TischOutput } from '../../models/output.tisch';
import { Schulklasse } from '../../models/schulklasse';

@Component({
  selector: 'app-zimmer-vereinfacht',
  templateUrl: './zimmer-vereinfacht.component.html',
  styleUrls: ['./zimmer-vereinfacht.component.css']
})
export class ZimmerVereinfachtComponent implements OnChanges {
  
  @Input('selectedSchulzimmer')  selectedSchulzimmer: Schulzimmer; 
  @Input('selectedSchulklasse')  selectedSchulklasse: Schulklasse; 

  zimmerRows = [0,1,2,3,4,5,6,7,8,9];
  zimmerColumns = [0,1,2,3,4,5,6,7,8,9];

  zimmer = new Schulzimmer();
  tischStyle : string

  indexSchueler: Number;

  
  constructor() { 
    this.zimmer.tische = new Array();
  }

  ngOnChanges(){
    this.zimmer = this.selectedSchulzimmer;

  }

}










