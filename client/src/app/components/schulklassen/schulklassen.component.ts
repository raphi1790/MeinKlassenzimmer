import { Component, OnInit, Input , OnChanges, ViewChild} from '@angular/core';

import {Schulklasse} from '../../models/schulklasse';
import {Schueler} from '../../models/schueler';

import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { Name } from '../../models/name';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ServiceBuilder } from '../../services/service.builder';
import { map } from 'rxjs/operators';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Klassenliste } from 'src/app/models/klassenliste';
import { KlassenlistenRemover } from 'src/app/helpers/klassenlisten.remover';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { SitzordnungenRemover } from 'src/app/helpers/sitzordnungen.remover';
import { DummyService } from 'src/app/services/dummy.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-schulklassen',
  templateUrl: './schulklassen.component.html',
  styleUrls: ['./schulklassen.component.css'],
  
})



export class SchulklassenComponent implements OnInit {
  
  savingIsActiv: boolean;
  isSaving: boolean;
  klassenToPerson: Schulklasse[];
  klassenToPersonOriginal: Schulklasse[];
  klassenlistenToPerson : Klassenliste[];
  klassenlistenToPersonOriginal: Klassenliste[];
  sitzordnungenToPerson: Sitzordnung[];
  sitzordnungenToPersonOriginal: Sitzordnung[];
  isLoadingData: boolean;
  regelnToPerson: Regel[];
  selectedSchulklasse: Schulklasse;
  regelChecker: RegelChecker;
  neueSchulklasseName: string
  neueSchulklasseForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  infoDialogRef: MatDialogRef<InfoDialogComponent>;
  displayedColumns: string[] = ['name', 'action'];
  dataSource: MatTableDataSource<Schulklasse>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() personId: string


  
  constructor(
    private dataService: DataService,
    //  private serviceBuilder: ServiceBuilder,
    // private userService:UserService,
    // private dummyService : DummyService,
     public dialog: MatDialog,
     private _snackBar: MatSnackBar) {
      this.regelChecker = new RegelChecker();

      
  }
  myUser:User

 


  loadInputData() {
    this.dataService.mapUser(user => this.applyUser(user))

  
  }

  applyUser(users){
      debugger;
      this.myUser = new User(users[0])
      debugger;
      this.klassenToPerson = this.myUser.schulklassen
      this.regelnToPerson = this.myUser.regeln
      this.klassenToPersonOriginal = JSON.parse(JSON.stringify(this.klassenToPerson));
      this.klassenlistenToPerson = this.myUser.klassenlisten
      this.klassenlistenToPersonOriginal = JSON.parse(JSON.stringify(this.klassenlistenToPerson));
      this.sitzordnungenToPerson = this.myUser.sitzordnungen
      this.sitzordnungenToPersonOriginal = JSON.parse(JSON.stringify(this.sitzordnungenToPerson));
      // console.log(this.myUser)
      // console.log(this.klassenToPerson)
      this.isLoadingData = false;
      //   this.dataSource = new MatTableDataSource(this.klassenToPerson);
      //   this.dataSource.paginator = this.paginator;
      //   this.dataSource.sort = this.sort;
    
  }

//   loadInputData() {
//     debugger;
//     // this.myUser = this.serviceBuilder.getService().getUser()
    
//     this.myUser = this.dataService.getUser()
//     console.log("this.myUser", this.myUser)
//     this.sitzordnungenToPerson = this.myUser.sitzordnungen
//     this.sitzordnungenToPersonOriginal = JSON.parse(JSON.stringify(this.sitzordnungenToPerson));
//     this.klassenToPerson = this.myUser.schulklassen
//     this.klassenToPersonOriginal = JSON.parse(JSON.stringify(this.klassenToPerson));
//     this.klassenlistenToPerson = this.myUser.klassenlisten
//     this.regelnToPerson = this.myUser.regeln
//     console.log(this.myUser)
//     // console.log(this.schulzimmerToPerson)
//     this.isLoadingData = false;

//     this.dataSource = new MatTableDataSource(this.klassenToPerson);
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;


// }


  getErrorMessageNeueSchulklasse() {
    return this.neueSchulklasseForm.hasError('required') ? 'Wert erforderlich' :
        this.neueSchulklasseForm.hasError('minlength') ? 'Name zu kurz' :
            '';
  }


  onSelect(selectedSchulklasse: Schulklasse): void {
    debugger;
    this.selectedSchulklasse = selectedSchulklasse;


  }
  deleteSchulklasse(selectedSchulklasse: Schulklasse):void{
    debugger;
    if(!this.regelChecker.regelExistsToSchulklasse(selectedSchulklasse, this.regelnToPerson)){
      this.klassenToPerson = this.klassenToPerson.filter(
        item =>
          item.id !== selectedSchulklasse.id);
      // remove klassenlisten based on selected klasse
      let klassenlistenRemover = new KlassenlistenRemover()
      let returnValuesKlassenliste =  klassenlistenRemover.removeKlassenlistenContainingSchulklasse(selectedSchulklasse, this.klassenlistenToPerson)
      this.klassenlistenToPerson = returnValuesKlassenliste[0]
      let numFilteredKlassenliste = returnValuesKlassenliste[1]
      // remove sitzordnungen based on selected klasse
      let sitzordnungenRemover = new SitzordnungenRemover()
      let returnValuesSitzordnung =  sitzordnungenRemover.removeSitzordnungenContainingSchulklasse(selectedSchulklasse, this.sitzordnungenToPerson)
      this.sitzordnungenToPerson = returnValuesSitzordnung[0]
      let numFilteredSitzordnung = returnValuesSitzordnung[1]

      if (numFilteredKlassenliste > 0 || numFilteredSitzordnung > 0  ){
        let message = this.getRemovalMessage(numFilteredKlassenliste, numFilteredSitzordnung)
        this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
          width: '550px',
          data: {text:message}
        });
        
      }
      this.savingIsActiv = true;
      this.selectedSchulklasse = null;
      this.dataSource = new MatTableDataSource(this.klassenToPerson);
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

  addSchulklasse(): void {
    debugger;
    var neueKlasseTmp = new Schulklasse();
    neueKlasseTmp.name = this.neueSchulklasseName;
    neueKlasseTmp.id = uuidv4();
    neueKlasseTmp.schueler = new Array<Schueler>();
    this.klassenToPerson.push(neueKlasseTmp);
    neueKlasseTmp = null;
    this.selectedSchulklasse = null;
    this.savingIsActiv = true;
    this.neueSchulklasseName = null;

    this.neueSchulklasseForm.markAsPristine();
    this.neueSchulklasseForm.markAsUntouched();
    this.neueSchulklasseForm.updateValueAndValidity();
    this.dataSource = new MatTableDataSource(this.klassenToPerson);

  }

  updateSchulklasse(updatedKlasse: Schulklasse): void {
    debugger;
    this.klassenToPerson = this.klassenToPerson.filter(
      item =>
        item.id !== updatedKlasse.id)
    if (typeof this.klassenToPerson == 'undefined') {
      console.log("klassenToPerson is undefined");
    }
    else {
      this.klassenToPerson.push(updatedKlasse);
    }
    this.savingIsActiv = true;
  }

  updateKlassenlisten(updatedKlasselisten: Klassenliste[]): void {
    debugger;
    this.klassenlistenToPerson = updatedKlasselisten
    this.savingIsActiv = true;
  }

  updateSitzordnungen(updatedSitzordnungen: Sitzordnung[]): void {
    debugger;
    this.sitzordnungenToPerson = updatedSitzordnungen
    this.savingIsActiv = true;
  }



  onNameChange(newName : Name):void{
    debugger;
    let oldName = this.klassenToPerson.filter(klasse => klasse.id == newName.id)[0].name;
    if(oldName != newName.text){
      this.klassenToPerson.filter(klasse => klasse.id == newName.id)[0].name = newName.text;
      this.savingIsActiv = true;
    }
    

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

  
  saveSchulklasseSchueler() {
    debugger;
    console.log("saving",this.klassenToPerson )
    // this.savingIsActiv = false; 
    // this.isSaving = true;
    // this.myUser.schulklassen = this.klassenToPerson
    // this.userService.updateUser(this.myUser);
    // this.isSaving = false;
    // this.klassenToPersonOriginal = this.klassenToPerson;
    // this.openSavingSnackBar()
    
  }
  cancel(){
    debugger;
    this.klassenToPerson = JSON.parse(JSON.stringify(this.klassenToPersonOriginal));
    this.klassenlistenToPerson = JSON.parse(JSON.stringify(this.klassenlistenToPersonOriginal));
    this.sitzordnungenToPerson = JSON.parse(JSON.stringify(this.sitzordnungenToPersonOriginal));
    this.savingIsActiv = false;
  }

  ngOnInit(){
    debugger;
    this.isLoadingData = true;
    this.loadInputData();

  }

}
