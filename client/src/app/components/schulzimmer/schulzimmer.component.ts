import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Schulzimmer } from '../../models/schulzimmer';
import { Tisch } from '../../models/tisch';
import { TischOutput } from '../../models/output.tisch';
import { TischOutputPreparer } from '../../helpers/tischOutput.preparer';
import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';

import * as CONFIG from '../../../config.json';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { Name } from '../../models/name';
import { RegelInfoDialogComponent } from '../regel-info-dialog/regel-info-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-schulzimmer',
  templateUrl: './schulzimmer.component.html',
  styleUrls: ['./schulzimmer.component.css']
})


export class SchulzimmerComponent implements OnInit {

  columnSchulzimmer: number[];
  rowSchulzimmer: number[];
  schulzimmerToPerson :Schulzimmer[];
  schulzimmerToPersonOriginal: Schulzimmer[];
  regelnToPerson: Regel[];
  selectedSchulzimmer: Schulzimmer;
  neueSchulzimmerTmp: Schulzimmer[];
  preparedTischOutput: TischOutput[][];
  tischOutputPreparer: TischOutputPreparer;
  savingIsActiv : boolean;
  neuesSchulzimmerName: string;
  neuesSchulzimmerForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  isSaving: boolean;
  currentTischNumber: number;
  regelChecker:RegelChecker;
  regelInfoDialogRef: MatDialogRef<RegelInfoDialogComponent>;
  myUser: User;
  isLoadingData: boolean;
  
  @Input() personId: number

  

  constructor(private userService: UserService, public dialog: MatDialog,private _snackBar: MatSnackBar ) {
    this.currentTischNumber = 0;
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);
    this.regelChecker = new  RegelChecker();
  }

  loadInputData() {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ uid: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(users => {
      debugger;
      this.myUser = new User(users[0])
      this.schulzimmerToPerson = this.myUser.schulzimmer
      this.regelnToPerson = this.myUser.regeln
      this.schulzimmerToPersonOriginal = JSON.parse(JSON.stringify(this.schulzimmerToPerson));
      // console.log(this.myUser)
      this.isLoadingData = false;
    
    });

  
  }

  getErrorMessageNeuesSchulzimmer() {
    return this.neuesSchulzimmerForm.hasError('required') ? 'Wert erforderlich' :
        this.neuesSchulzimmerForm.hasError('minlength') ? 'Name zu kurz' :
            '';
  }

  onSelect(selectedId: Name): void {
    debugger;
    let schulzimmer = this.schulzimmerToPerson.filter(zimmer => zimmer.id == selectedId.id)[0];
    // console.log("table number (before findMaximalTischNumber): " + this.currentTischNumber);
    this.selectedSchulzimmer = schulzimmer;
    this.tischOutputPreparer = new TischOutputPreparer();
    this.preparedTischOutput = this.tischOutputPreparer.prepareTischOutput(this.selectedSchulzimmer);
     if (this.selectedSchulzimmer.tische != null){
      this.currentTischNumber = this.findMaximalTischNumber(this.selectedSchulzimmer.tische);
    }
    else{
      this.currentTischNumber = 0;
    }
    // console.log("table number (after findMaximalTischNumber): " + this.currentTischNumber);

  }

  private findMaximalTischNumber(tische: Tisch[]):number{
    debugger;
    let allTischNumbers = tische.map(a => a.tischNumber); 
    var maximalTischNumber = Math.max.apply(null, allTischNumbers) ;
    return Math.max(maximalTischNumber,0); 
};

  deleteSchulzimmer(selectedId: Name):void{
    let schulzimmer = this.schulzimmerToPerson.filter(zimmer => zimmer.id == selectedId.id)[0];
    if(!this.regelChecker.regelExistsToSchulzimmer(schulzimmer,this.regelnToPerson)){
      this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
        item =>
          item.id !== schulzimmer.id);
      this.selectedSchulzimmer = null;    
      this.savingIsActiv = true; 
    }else{
      this.regelInfoDialogRef = this.dialog.open(RegelInfoDialogComponent, {
        height: '210px',
        width: '550px',
      });

    }

   
  }

  onNameChange(newName : Name):void{
    debugger;
    let oldName = this.schulzimmerToPerson.filter(zimmer => zimmer.id == newName.id)[0].name;
    if(oldName != newName.text){
      this.schulzimmerToPerson.filter(klasse => klasse.id == newName.id)[0].name = newName.text;
      this.savingIsActiv = true;
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
  updateCurrentTischNumber(newNumber:number){
    // console.log("new Number: "+ newNumber);
    this.currentTischNumber = newNumber;
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
    // console.log("Updated SchulzimmerToPerson");
    // console.log(this.schulzimmerToPerson);

  
  }
  canDeactivate(){
    debugger;
    return !this.savingIsActiv;
  }

  openSavingSnackBar(){
    this._snackBar.openFromComponent(SaveSnackBarComponent, {
      duration: 2000,
    });

  }

  saveSchulzimmerTische() {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    this.myUser.schulzimmer = this.schulzimmerToPerson
    this.userService.updateUser(this.myUser);
    this.isSaving = false;
    this.schulzimmerToPersonOriginal = this.schulzimmerToPerson;
    this.openSavingSnackBar()
    
  }
  cancel(){
    debugger;
    this.schulzimmerToPerson = JSON.parse(JSON.stringify(this.schulzimmerToPersonOriginal));
    this.savingIsActiv = false;
  }

  ngOnInit() {
    debugger;
    this.isLoadingData = true;
    this.loadInputData();

  }


}
