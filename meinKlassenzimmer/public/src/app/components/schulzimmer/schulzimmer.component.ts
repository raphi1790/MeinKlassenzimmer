import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Schulzimmer } from 'app/models/schulzimmer';
import { SchulzimmerService } from "app/services/schulzimmer.service";
import { Tisch } from '../../models/tisch';
import { TischOutput } from '../../models/output.tisch';
import { TischOutputPreparer } from '../../helpers/tischOutput.preparer';
import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';

import * as CONFIG from '../../../config.json';
import { Regel } from 'app/models/regel';
import { RegelService } from 'app/services/regel.service';
import { RegelChecker } from 'app/helpers/regel.checker';

@Component({
  selector: 'app-schulzimmer',
  templateUrl: './schulzimmer.component.html',
  styleUrls: ['./schulzimmer.component.css']
})


export class SchulzimmerComponent implements OnInit {

  columnSchulzimmer: number[];
  rowSchulzimmer: number[];
  schulzimmerToPerson :Schulzimmer[];
  regelnToPerson: Regel[];
  selectedSchulzimmer: Schulzimmer;
  neueSchulzimmerTmp: Schulzimmer[];
  preparedTischOutput: TischOutput[][];
  tischOutputPreparer: TischOutputPreparer;
  savingIsActiv : boolean;
  isLoadingSchulzimmer: boolean;
  isLoadingRegeln: boolean;
  neuesSchulzimmerName: string;
  neuesSchulzimmerForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  isSaving: boolean;
  currentTableNumber: number;
  regelChecker:RegelChecker

  
  @Input() personid: number
  

  constructor(private schulzimmerService: SchulzimmerService, private regelService: RegelService ) {
    this.currentTableNumber = 0;
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);
    this.regelChecker = new  RegelChecker();
  }

  loadInputData() {

    this.schulzimmerService.getSchulzimmerAndTischeByPersonid().subscribe(
      (data:Schulzimmer[]) => {
        this.schulzimmerToPerson = data;
        this.isLoadingSchulzimmer = false;
        this.regelService.getRegelByPersonid().subscribe(
          (data:Regel[]) => {
            debugger;
            this.regelnToPerson = data;
            this.isLoadingRegeln = false;
          });
      }
    );
  }

  getErrorMessageNeuesSchulzimmer() {
    return this.neuesSchulzimmerForm.hasError('required') ? 'Wert erforderlich' :
        this.neuesSchulzimmerForm.hasError('minlength') ? 'Name zu kurz' :
            '';
  }

  onSelect(schulzimmer: Schulzimmer): void {
    debugger;
    console.log("table number (before findMaximalTableNumber): " + this.currentTableNumber);
    this.selectedSchulzimmer = schulzimmer;
    this.tischOutputPreparer = new TischOutputPreparer();
    this.preparedTischOutput = this.tischOutputPreparer.prepareTischOutput(this.selectedSchulzimmer);
     if (this.selectedSchulzimmer.tische != null){
      this.currentTableNumber = this.findMaximalTableNumber(this.selectedSchulzimmer.tische);
    }
    else{
      this.currentTableNumber = 0;
    }
    console.log("table number (after findMaximalTableNumber): " + this.currentTableNumber);

  }

  private findMaximalTableNumber(tische: Tisch[]):number{
    debugger;
    let allTableNumbers = tische.map(a => a.tableNumber); 
    var maximalTableNumber = Math.max.apply(null, allTableNumbers) ;
    return Math.max(maximalTableNumber,0); 
};

  deleteSchulzimmer(schulzimmer: Schulzimmer):void{
    if(!this.regelChecker.regelExistsToSchulzimmer(schulzimmer,this.regelnToPerson)){
      this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
        item =>
          item.id !== schulzimmer.id);
      this.selectedSchulzimmer = null;    
      this.savingIsActiv = true; 
    }else{
      window.confirm("Es existieren noch Regeln zu diesem Schulzimmer, weshalb es nicht gelöscht werden kann. Bitte lösche zuerst die entsprechende Regeln.");

    }
   
  }

  addSchulzimmerTmp(): void {
    debugger;
    var neuesSchulzimmerTmp = new Schulzimmer();
    neuesSchulzimmerTmp.name = this.neuesSchulzimmerName;
    neuesSchulzimmerTmp.id = uuidv4();
    neuesSchulzimmerTmp.tische = new Array<Tisch>();
    this.schulzimmerToPerson.push(neuesSchulzimmerTmp);
    neuesSchulzimmerTmp = null;
    this.selectedSchulzimmer = null;
    this.savingIsActiv = true;
    this.neuesSchulzimmerName = null;

    this.neuesSchulzimmerForm.markAsPristine();
    this.neuesSchulzimmerForm.markAsUntouched();
    this.neuesSchulzimmerForm.updateValueAndValidity();

  }
  updateCurrentTableNumber(newNumber:number){
    console.log("new Number: "+ newNumber);
    this.currentTableNumber = newNumber;
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
  canDeactivate(){
    debugger;
    return !this.savingIsActiv;
  }


  async saveSchulzimmerTische(): Promise<void> {
    debugger;
    this.savingIsActiv = false;
    this.isSaving = true; 
    // this.personDbHelper.savePerson();
    await this.schulzimmerService.updateSchulzimmerAndTische(this.schulzimmerToPerson).subscribe(() => this.isSaving = false);
    
  }

  ngOnInit() {
    debugger;
    this.isLoadingSchulzimmer = true;
    this.isLoadingRegeln = true;
    this.loadInputData();

  }


}
