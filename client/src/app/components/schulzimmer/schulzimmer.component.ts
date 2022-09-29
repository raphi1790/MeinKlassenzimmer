import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { Schulzimmer } from '../../models/schulzimmer';
import { Tisch } from '../../models/tisch';
import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuidv4';

import * as CONFIG from '../../../config.json';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { Name } from '../../models/name';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { SitzordnungenRemover } from 'src/app/helpers/sitzordnungen.remover';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/services/data.service';

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
  sitzordnungenToPerson: Sitzordnung[];
  sitzordnungenToPersonOriginal: Sitzordnung[];
  regelnToPerson: Regel[];
  selectedSchulzimmer: Schulzimmer;
  neueSchulzimmerTmp: Schulzimmer[];
  savingIsActiv : boolean;
  neuesSchulzimmerName: string;
  neuesSchulzimmerForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  isSaving: boolean;
  maximalTischNumber: number;
  regelChecker:RegelChecker;
  infoDialogRef: MatDialogRef<InfoDialogComponent>;
  myUser: User;
  isLoadingData: boolean;
  displayedColumns: string[] = ['name', 'action'];
  dataSource: MatTableDataSource<Schulzimmer>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  

  constructor(
    private dataService: DataService,
     public dialog: MatDialog,private _snackBar: MatSnackBar
      ) {
    this.maximalTischNumber = 0;
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);
    this.regelChecker = new  RegelChecker();
  }


  loadInputData() {
    this.dataService.mapUser(user => this.applyUser(user))

  
  }

  applyUser(users){
      debugger;
      this.myUser = new User(users[0])
      this.schulzimmerToPerson = this.myUser.schulzimmer
      this.regelnToPerson = this.myUser.regeln
      this.schulzimmerToPersonOriginal = JSON.parse(JSON.stringify(this.schulzimmerToPerson));
      this.sitzordnungenToPerson = this.myUser.sitzordnungen
      this.sitzordnungenToPersonOriginal = JSON.parse(JSON.stringify(this.sitzordnungenToPerson));
      // console.log(this.myUser)
      this.isLoadingData = false;
      this.dataSource = new MatTableDataSource(this.schulzimmerToPerson);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    
  }



  getErrorMessageNeuesSchulzimmer() {
    return this.neuesSchulzimmerForm.hasError('required') ? 'Wert erforderlich' :
        this.neuesSchulzimmerForm.hasError('minlength') ? 'Name zu kurz' :
            '';
  }

  onSelect(selectedSchulzimmer: Schulzimmer): void {
    debugger;
    // console.log("table number (before findMaximalTischNumber): " + this.currentTischNumber);
    this.selectedSchulzimmer = selectedSchulzimmer;
     if (this.selectedSchulzimmer.tische != null){
      this.maximalTischNumber = this.findMaximalTischNumber(this.selectedSchulzimmer.tische);
    }
    else{
      this.maximalTischNumber = 0;
    }
    // console.log("table number (after findMaximalTischNumber): " + this.currentTischNumber);

  }

  findMaximalTischNumber(tische: Tisch[]):number{
    debugger;
    let allTischNumbers = tische.map(a => a.tischNumber); 
    var maximalTischNumber = Math.max.apply(null, allTischNumbers) ;
    return Math.max(maximalTischNumber,0); 
};

  deleteSchulzimmer(selectedSchulzimmer: Schulzimmer):void{
    if(!this.regelChecker.regelExistsToSchulzimmer(selectedSchulzimmer,this.regelnToPerson)){
      this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
        item =>
          item.id !== selectedSchulzimmer.id);
        let sitzordnungenRemover = new SitzordnungenRemover()
        let returnValuesSitzordnung =  sitzordnungenRemover.removeSitzordnungenContainingSchulzimmer(selectedSchulzimmer, this.sitzordnungenToPerson)
        this.sitzordnungenToPerson = returnValuesSitzordnung[0]
        let numFilteredSitzordnung = returnValuesSitzordnung[1]
  
        if(numFilteredSitzordnung > 0  ){
          let message = this.getRemovalMessage(0, numFilteredSitzordnung)
          this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
            width: '550px',
            data: {text:message}
          });

        }
      this.selectedSchulzimmer = null;    
      this.savingIsActiv = true; 
      this.dataSource = new MatTableDataSource(this.schulzimmerToPerson);

    }else{
      this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
        width: '550px',
        data: {text: "Es existieren noch Regeln zu diesem Objekt, weshalb es nicht gelöscht werden kann. Bitte lösche zuerst die entsprechenden Regeln."}
      });

    }

   
  }
  private getRemovalMessage(numRemovedKlassenliste: number, numRemovedSitzordnungen: number):String{
    let message = `Anzahl zusätzlich gelöschter Klassenlisten zur Klasse: <b> ${numRemovedKlassenliste} </b> <br />Anzahl zusätzlich gelöschter Sitzordnungen zur Klasse:<b> ${numRemovedSitzordnungen} </b> `
    return message

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
    this.dataSource = new MatTableDataSource(this.schulzimmerToPerson);

  }
  updateMaximalTischNumber(newNumber:number){
    // console.log("new Number: "+ newNumber);
    debugger;
    this.maximalTischNumber = Math.max(newNumber, this.maximalTischNumber)
  }
  updateSchulzimmer(updatedSchulzimmer: Schulzimmer): void {
    debugger;
    this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
      item =>
        item.id !== updatedSchulzimmer.id)
    if (typeof this.schulzimmerToPerson == 'undefined') {
      console.log("SchulzimmerToPerson is undefined");
    }
    else {
      this.schulzimmerToPerson.push(updatedSchulzimmer);
    }
    this.savingIsActiv = true;
    console.log("Updated SchulzimmerToPerson");
    console.log(this.schulzimmerToPerson);
  }

  updateSitzordnungen(updatedSitzordnungen: Sitzordnung[]): void {
    debugger;
    this.sitzordnungenToPerson = updatedSitzordnungen
    console.log("this.sitzordnungenToPerson ", this.sitzordnungenToPerson)
    this.savingIsActiv = true;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
}

  saveSchulzimmerTische() {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    this.myUser.schulzimmer = this.schulzimmerToPerson
    this.myUser.sitzordnungen = this.sitzordnungenToPerson // Update sitzordnungen, which are removed as a side effect of deleting a particular schulzimmer
    this.dataService.updateUser(this.myUser);
    this.isSaving = false;
    this.schulzimmerToPersonOriginal = this.schulzimmerToPerson;
    this.openSavingSnackBar()
    
  }
  cancel(){
    debugger;
    this.schulzimmerToPerson = JSON.parse(JSON.stringify(this.schulzimmerToPersonOriginal));
    this.sitzordnungenToPerson = JSON.parse(JSON.stringify(this.sitzordnungenToPersonOriginal));
    this.savingIsActiv = false;
  }

  ngOnInit() {
    debugger;
    this.isLoadingData = true;
    this.loadInputData();

  }


}
