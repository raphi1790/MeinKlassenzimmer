import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Schulzimmer } from 'app/models/schulzimmer';
import { SchulzimmerService } from "app/services/schulzimmer.service";
import { Tisch } from '../../models/tisch';
import { PositionTisch } from '../../models/position.tisch';
import { PersonDbHelper } from '../../helpers/person.DbHelper';
import { PersonService } from '../../services/person.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-schulzimmer',
  templateUrl: './schulzimmer.component.html',
  styleUrls: ['./schulzimmer.component.css']
})


export class SchulzimmerComponent implements OnInit {



  personDbHelper: PersonDbHelper;
  @Input() personid: number

  constructor(private schulzimmerService: SchulzimmerService, private personService: PersonService, private auth : AuthService ) {
    this.personDbHelper = new PersonDbHelper(personService, auth);
    this.maximalSchulzimmerId = 0;


  }

  schulzimmerToPerson :Schulzimmer[];
  selectedSchulzimmer: Schulzimmer;
  neueSchulzimmerTmp: Schulzimmer[];
  maximalSchulzimmerId: number;

  

  getSchulzimmerToPerson() {

    this.schulzimmerService.getSchulzimmerAndTischeByPersonid().subscribe(
      (data:Schulzimmer[]) => {
        this.schulzimmerToPerson = data;
      }
    );
  }

  onSelect(schulzimmer: Schulzimmer): void {
    debugger;
    this.selectedSchulzimmer = schulzimmer;


  }
  deleteSchulzimmer(schulzimmer: Schulzimmer):void{
    this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
      item =>
        item.id !== schulzimmer.id);
    this.selectedSchulzimmer = null;     
  }

  addSchulzimmerTmp(name: string): void {
    debugger;
    this.maximalSchulzimmerId++;
    var neuesSchulzimmerTmp = new Schulzimmer();
    neuesSchulzimmerTmp.name = name;
    neuesSchulzimmerTmp.id = this.maximalSchulzimmerId;
    neuesSchulzimmerTmp.tische = new Array<Tisch>();
    this.schulzimmerToPerson.push(neuesSchulzimmerTmp);
    neuesSchulzimmerTmp = null;
    this.selectedSchulzimmer = null;

  }
  updateSchulzimmer(updatedZimmer: Schulzimmer): void {
    debugger;
    this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
      item =>
        item.id !== updatedZimmer.id)
    if (typeof this.schulzimmerToPerson == 'undefined') {
      console.log("SchulzimmerToPerson is undefined");
    }
    else {
      this.schulzimmerToPerson.push(updatedZimmer);
    }
  }
  async saveSchulzimmerTische(): Promise<void> {
    debugger;
    this.personDbHelper.savePerson();
    await this.schulzimmerService.updateSchulzimmerAndTische(this.schulzimmerToPerson).subscribe();
  }

  ngOnInit() {
    debugger;
    this.personDbHelper.getPerson();
    this.getSchulzimmerToPerson();

  }


}
