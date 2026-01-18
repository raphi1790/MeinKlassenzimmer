import { Component, OnInit, ViewChild } from '@angular/core';
import { Schulzimmer } from '../../models/schulzimmer';
import { Tisch } from '../../models/tisch';
import { FormControl, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

import CONFIG from '../../../config.json';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { Name } from '../../models/name';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { User } from '../../models/user';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { SitzordnungenRemover } from 'src/app/helpers/sitzordnungen.remover';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/services/data.service';
import { AutoSaveService } from 'src/app/services/auto-save.service';

@Component({
  standalone: false,
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
  neuesSchulzimmerName: string;
  neuesSchulzimmerForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
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
    private autoSaveService: AutoSaveService,
     public dialog: MatDialog
      ) {
    this.maximalTischNumber = 0;
    this.rowSchulzimmer = Array.from(new Array(CONFIG.numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array(CONFIG.numberOfColumns),(val,index)=>index);
    this.regelChecker = new  RegelChecker();
  }

  loadInputData() {
    this.dataService.mapUser().pipe(take(1)).subscribe(user => this.applyUser(user));

  
  }
  applyUser(user){
      this.myUser = new User(user)
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
    // console.log("table number (before findMaximalTischNumber): " + this.currentTischNumber);
    this.selectedSchulzimmer = selectedSchulzimmer;
    this.maximalTischNumber = this.findMaximalTischNumber(this.selectedSchulzimmer.tische);
    // console.log("table number (after findMaximalTischNumber): " + this.currentTischNumber);

  }

  findMaximalTischNumber(tische: Tisch[]):number{
    if (tische == null || tische.length == 0){
      return 0
    }
    console.log("findMaximalTischNumber:", tische)
    let allTischNumbers = tische.map(a => a.tischNumber); 
    var maximalTischNumber = Math.max.apply(null, allTischNumbers) ;
    console.log("findMaximalTischNumber:", maximalTischNumber)
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
      this.myUser.schulzimmer = this.schulzimmerToPerson;
      this.myUser.sitzordnungen = this.sitzordnungenToPerson;
      this.autoSaveService.notifyUserChange(this.myUser);
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
    let oldName = this.schulzimmerToPerson.filter(zimmer => zimmer.id == newName.id)[0].name;
    if(oldName != newName.text){
      this.schulzimmerToPerson.filter(klasse => klasse.id == newName.id)[0].name = newName.text;
      this.myUser.schulzimmer = this.schulzimmerToPerson;
      this.autoSaveService.notifyUserChange(this.myUser);
    }
  }

  addSchulzimmerTmp(): void {
    var neuesSchulzimmerTmp = new Schulzimmer();
    neuesSchulzimmerTmp.name = this.neuesSchulzimmerName;
    neuesSchulzimmerTmp.id = uuidv4();
    neuesSchulzimmerTmp.tische = new Array<Tisch>();
    this.schulzimmerToPerson.push(neuesSchulzimmerTmp);
    neuesSchulzimmerTmp = null;
    this.selectedSchulzimmer = null;
    this.myUser.schulzimmer = this.schulzimmerToPerson;
    this.autoSaveService.notifyUserChange(this.myUser);
    this.neuesSchulzimmerName = null;

    this.neuesSchulzimmerForm.markAsPristine();
    this.neuesSchulzimmerForm.markAsUntouched();
    this.neuesSchulzimmerForm.updateValueAndValidity();
    this.dataSource = new MatTableDataSource(this.schulzimmerToPerson);

  }

  updateSchulzimmer(updatedSchulzimmer: Schulzimmer): void {
    this.schulzimmerToPerson = this.schulzimmerToPerson.filter(
      item =>
        item.id !== updatedSchulzimmer.id)
    if (typeof this.schulzimmerToPerson == 'undefined') {
      console.log("SchulzimmerToPerson is undefined");
    }
    else {
      this.schulzimmerToPerson.push(updatedSchulzimmer);
      this.maximalTischNumber = this.findMaximalTischNumber(updatedSchulzimmer.tische)
    }
    this.myUser.schulzimmer = this.schulzimmerToPerson;
    this.autoSaveService.notifyUserChange(this.myUser);
    console.log("Updated SchulzimmerToPerson");
    console.log(this.schulzimmerToPerson);
  }

  updateSitzordnungen(updatedSitzordnungen: Sitzordnung[]): void {
    this.sitzordnungenToPerson = updatedSitzordnungen
    console.log("this.sitzordnungenToPerson ", this.sitzordnungenToPerson)
    this.myUser.sitzordnungen = this.sitzordnungenToPerson;
    this.autoSaveService.notifyUserChange(this.myUser);
  }


  canDeactivate(){
    return true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
}

  ngOnInit() {
    this.isLoadingData = true;
    this.loadInputData();

  }


}
