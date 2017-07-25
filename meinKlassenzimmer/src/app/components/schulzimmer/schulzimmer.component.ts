import { Component, OnInit, Input } from '@angular/core';
import { Router }            from '@angular/router';
import {Schulzimmer} from 'app/models/schulzimmer';
import {Zimmer} from 'app/models/zimmer';
import { SchulzimmerService } from "app/services/schulzimmer.service";

@Component({
  selector: 'app-schulzimmer',
  templateUrl: './schulzimmer.component.html',
  styleUrls: ['./schulzimmer.component.css']
})
export class SchulzimmerComponent implements OnInit {

 @Input() personid: number

  constructor(private schulzimmerService: SchulzimmerService) { }

  schulzimmerToPerson: Schulzimmer[];
  selectedSchulzimmer: Schulzimmer;
  zimmerToPerson: Zimmer[];

  getSchulzimmerToPerson():Schulzimmer[] {
    this.schulzimmerService.getSchulzimmerByPersonid().then(schulzimmer => this.schulzimmerToPerson = schulzimmer);
    return this.schulzimmerToPerson;
  }
  getZimmerToPerson(): Zimmer[]{
    this.schulzimmerService.getZimmerByPersonid()
    .then(
      zimmer =>
       this.zimmerToPerson = zimmer );
       return this.zimmerToPerson;
  
  } 

   onSelect(schulzimmer: Schulzimmer): void {
    this.selectedSchulzimmer = schulzimmer;

    
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.schulzimmerService.createSchulzimmer(name)
      .then(schulzimmer => {
        this.schulzimmerToPerson.push(schulzimmer);
        this.selectedSchulzimmer = null;
      });
  }

  ngOnInit(){
    this.getSchulzimmerToPerson();
    //this.getZimmerToPerson();
  }


}
