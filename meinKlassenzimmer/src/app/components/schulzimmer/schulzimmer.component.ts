import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Schulzimmer } from 'app/models/schulzimmer';
import { SchulzimmerService } from "app/services/schulzimmer.service";
import { Tisch } from '../../models/tisch';
import { PositionTisch } from '../../models/position.tisch';
import { PersonDbHelper } from '../../helpers/person.DbHelper';
import { PersonService } from '../../services/person.service';
import { AuthService } from '../../services/auth/auth.service';
import { TischOutput } from '../../models/output.tisch';
import { TischOutputPreparer } from '../../helpers/tischOutput.preparer';

var CONFIG = require('../../../../config.json');

@Component({
  selector: 'app-schulzimmer',
  templateUrl: './schulzimmer.component.html',
  styleUrls: ['./schulzimmer.component.css']
})


export class SchulzimmerComponent implements OnInit {

  columnSchulzimmer: number[];
  rowSchulzimmer: number[];
  schulzimmerToPerson :Schulzimmer[];
  selectedSchulzimmer: Schulzimmer;
  neueSchulzimmerTmp: Schulzimmer[];
  maximalSchulzimmerId: number;
  personDbHelper: PersonDbHelper;
  preparedTischOutput: TischOutput[][];
  tischOutputPreparer: TischOutputPreparer;
  savingIsActiv : boolean

  
  @Input() personid: number

  constructor(private schulzimmerService: SchulzimmerService, private personService: PersonService, private auth : AuthService ) {
    this.personDbHelper = new PersonDbHelper(personService, auth);
    this.maximalSchulzimmerId = 0;
    this.rowSchulzimmer = Array.from(new Array(CONFIG.numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array(CONFIG.numberOfColumns),(val,index)=>index);
  }

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
    this.tischOutputPreparer = new TischOutputPreparer();
    this.preparedTischOutput = this.tischOutputPreparer.prepareTischOutput(this.selectedSchulzimmer);

  }

  deleteSchulzimmer(schulzimmer: Schulzimmer):void{
    this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
      item =>
        item.id !== schulzimmer.id);
    this.selectedSchulzimmer = null;    
    this.savingIsActiv = true; 
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
    this.savingIsActiv = true;

  }
  updateSchulzimmer(updatedTischOutput: TischOutput): void {
    debugger;
    var updatedZimmer = new Schulzimmer;
    this.tischOutputPreparer = new TischOutputPreparer();
    updatedZimmer = this.tischOutputPreparer.extractTischOfTischOutput(updatedTischOutput, this.selectedSchulzimmer);
    this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
      item =>
        item.id !== updatedZimmer.id)
    if (typeof this.schulzimmerToPerson == 'undefined') {
      console.log("SchulzimmerToPerson is undefined");
    }
    else {
      this.schulzimmerToPerson.push(updatedZimmer);
    }
    this.savingIsActiv = true;
    console.log("Updated SchulzimmerToPerson");
    console.log(this.schulzimmerToPerson);

  }
  async saveSchulzimmerTische(): Promise<void> {
    debugger;
    this.savingIsActiv = false;
    this.personDbHelper.savePerson();
    await this.schulzimmerService.updateSchulzimmerAndTische(this.schulzimmerToPerson).subscribe();
    
  }

  ngOnInit() {
    debugger;
    this.personDbHelper.getPerson();
    this.getSchulzimmerToPerson();

  }


}
