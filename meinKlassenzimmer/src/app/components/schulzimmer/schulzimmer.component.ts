import { Component, OnInit, Input } from '@angular/core';
import { Router }            from '@angular/router';
import {Schulzimmer} from 'app/models/schulzimmer';
import { SchulzimmerService } from "app/services/schulzimmer.service";

@Component({
  selector: 'app-schulzimmer',
  templateUrl: './schulzimmer.component.html',
  styleUrls: ['./schulzimmer.component.css']
})
export class SchulzimmerComponent implements OnInit {

 @Input() personid: number

  constructor(private schulzimmerService: SchulzimmerService) {
    this.neueSchulzimmerTmp = new Array();
    this.schulzimmerToPerson = new Array();
    this.maximalSchulzimmerId = 0;

   }

  schulzimmerToPerson: Schulzimmer[];
  selectedSchulzimmer: Schulzimmer;
  zimmerToPerson: Schulzimmer[];
  neueSchulzimmerTmp: Schulzimmer[];
  maximalSchulzimmerId: number;

  // getSchulzimmerToPerson():Schulzimmer[] {
  //   this.schulzimmerService.getSchulzimmerByPersonid().then(schulzimmer => this.schulzimmerToPerson = schulzimmer);
  //   return this.schulzimmerToPerson;
  // }
  // getZimmerToPerson(): Schulzimmer[]{
  //   this.schulzimmerService.getZimmerByPersonid()
  //   .then(
  //     zimmer =>
  //      this.zimmerToPerson = zimmer );
  //      return this.zimmerToPerson;
  
  // } 

   onSelect(schulzimmer: Schulzimmer): void {
    this.selectedSchulzimmer = schulzimmer;

    
  }

  addSchulzimmerTmp(name: string):void {
    debugger;
    this.maximalSchulzimmerId ++;
    var neuesSchulzimmerTmp = new Schulzimmer();
    neuesSchulzimmerTmp.name = name;
    neuesSchulzimmerTmp.id = this.maximalSchulzimmerId;
    this.neueSchulzimmerTmp.push(neuesSchulzimmerTmp);
    this.schulzimmerToPerson.push(neuesSchulzimmerTmp);
    neuesSchulzimmerTmp = null;
    this.selectedSchulzimmer = null;

 
  }

  ngOnInit(){
    // this.getSchulzimmerToPerson();

  }


}
