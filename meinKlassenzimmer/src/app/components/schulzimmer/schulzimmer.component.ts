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

  schulzimmerToPerson = [];
  selectedSchulzimmer: Schulzimmer;
  neueSchulzimmerTmp: Schulzimmer[];
  maximalSchulzimmerId: number;

  

  getSchulzimmerToPerson() {

    this.schulzimmerService.getSchulzimmerAndTischeByPersonid().subscribe(data => {
      debugger;
      console.log("Schulzimmer " + data['Schulzimmer']);
      console.log("Tische " + data['Tische']);
      for (let indexZimmer = 0; indexZimmer < data['Schulzimmer'].length; indexZimmer++) {
        this.schulzimmerToPerson[indexZimmer] = new Schulzimmer();
        this.schulzimmerToPerson[indexZimmer].id = data['Schulzimmer'][indexZimmer].Id;
        this.schulzimmerToPerson[indexZimmer].personid = data['Schulzimmer'][indexZimmer].PersonId;
        this.schulzimmerToPerson[indexZimmer].name = data['Schulzimmer'][indexZimmer].Name;
        this.schulzimmerToPerson[indexZimmer].tische = new Array<Tisch>();
        for (let indexTisch = 0; indexTisch < data['Tische'].length; indexTisch++) {
          if (this.schulzimmerToPerson[indexZimmer].id == data['Tische'][indexTisch].SchulzimmerId) {
            debugger;
            var tischTmp = new Tisch()
            tischTmp.position = new PositionTisch(data['Tische'][indexTisch].RowNumber, data['Tische'][indexTisch].ColumnNumber);
            this.schulzimmerToPerson[indexZimmer].tische.push(tischTmp);
          }
        }


      }
      console.log(this.schulzimmerToPerson);
      console.log(this.schulzimmerToPerson[0].name);

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
        item.id !== schulzimmer.id)
  }

  addSchulzimmerTmp(name: string): void {
    debugger;
    this.maximalSchulzimmerId++;
    var neuesSchulzimmerTmp = new Schulzimmer();
    neuesSchulzimmerTmp.name = name;
    neuesSchulzimmerTmp.id = this.maximalSchulzimmerId;
    neuesSchulzimmerTmp.tische = new Array<Tisch>();
    // this.neueSchulzimmerTmp.push(neuesSchulzimmerTmp);
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
