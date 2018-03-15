import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Schulzimmer } from 'app/models/schulzimmer';
import { SchulzimmerService } from "app/services/schulzimmer.service";
import { Tisch } from '../../models/tisch';

@Component({
  selector: 'app-schulzimmer',
  templateUrl: './schulzimmer.component.html',
  styleUrls: ['./schulzimmer.component.css']
})
export class SchulzimmerComponent implements OnInit {

  @Input() personid: number

  constructor(private schulzimmerService: SchulzimmerService) {
    this.maximalSchulzimmerId = 0;


  }

  schulzimmerToPerson = new Array<Schulzimmer>();
  selectedSchulzimmer: Schulzimmer;
  zimmerToPerson: Schulzimmer[];
  neueSchulzimmerTmp: Schulzimmer[];
  maximalSchulzimmerId: number;

  getSchulzimmerToPerson() {
    debugger;
    this.schulzimmerService.getSchulzimmerByPersonid().subscribe(data => {
      console.log(data['Schulzimmer']);
      for (let index = 0; index < data['Schulzimmer'].length; index++) {
        this.schulzimmerToPerson[index] = new Schulzimmer();
        this.schulzimmerToPerson[index].id = data['Schulzimmer'][index].Id
        this.schulzimmerToPerson[index].personid = data['Schulzimmer'][index].PersonId
        this.schulzimmerToPerson[index].name = data['Schulzimmer'][index].Name;
      }
              }
                
    );
}

getTischeToSchulzimmer(){
  for (let index = 0; index < this.schulzimmerToPerson.length; index++) {
    this.schulzimmerService.getTischeBySchulzimmerId(this.schulzimmerToPerson[index].id)
      .subscribe(data => {
        debugger;
        console.log("Tische " + data['Tische']);
        console.log("Laenge Tische " + data['Tische'].length);
        for (let indexTisch = 0; indexTisch < data['Tische'].length; indexTisch++) {
          
          this.schulzimmerToPerson[index].tische[indexTisch] = new Tisch();
          this.schulzimmerToPerson[index].tische[indexTisch].position.row = data['Tisch'][indexTisch].RowNumber;
          this.schulzimmerToPerson[index].tische[indexTisch].position.column = data['Tisch'][indexTisch].ColumnNumber;
          console.log(this.schulzimmerToPerson[index].tische[indexTisch].position.column);
        }
      });
    } 
}

getSchulzimmerAndTischeToPerson2(){
  debugger;
    this.schulzimmerService.getSchulzimmerByPersonid().subscribe(data => {
      for (let index = 0; index < data['SchulzimmerTische'].length; index++) {
        this.schulzimmerToPerson[index] = new Schulzimmer();
        this.schulzimmerToPerson[index].id = data['Schulzimmer'][index].Id
        this.schulzimmerToPerson[index].personid = data['Schulzimmer'][index].PersonId
        this.schulzimmerToPerson[index].name = data['Schulzimmer'][index].Name;
      }

    })
}

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

addSchulzimmerTmp(name: string): void {
  debugger;
  this.maximalSchulzimmerId++;
  var neuesSchulzimmerTmp = new Schulzimmer();
  neuesSchulzimmerTmp.name = name;
  neuesSchulzimmerTmp.id = this.maximalSchulzimmerId;
  this.neueSchulzimmerTmp.push(neuesSchulzimmerTmp);
  this.schulzimmerToPerson.push(neuesSchulzimmerTmp);
  neuesSchulzimmerTmp = null;
  this.selectedSchulzimmer = null;


}
  private updateSchulzimmer(updatedZimmer: Schulzimmer): void {

  this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
    item =>
      item.id !== updatedZimmer.id)
    if(typeof this.schulzimmerToPerson == 'undefined') {
  console.log("SchulzimmerToPerson is undefined");
}
    else {
  this.schulzimmerToPerson.push(updatedZimmer);
}
  }



ngOnInit() {
  this.getSchulzimmerToPerson();
  debugger;
  if (typeof this.schulzimmerToPerson != undefined && this.schulzimmerToPerson.length > 0) {
    this.getTischeToSchulzimmer();
  }
  // this.getSchulzimmerAndTischeToPerson2();

}


}
