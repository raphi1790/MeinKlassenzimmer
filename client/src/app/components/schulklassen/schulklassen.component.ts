import { Component, OnInit, Input , OnChanges, ViewChild} from '@angular/core';

import {Schulklasse} from '../../models/schulklasse';
import {Schueler} from '../../models/schueler';

import { FormControl, Validators } from '@angular/forms';
import * as uuidv4 from 'uuid/v4';
import { Regel } from '../../models/regel';
import { RegelChecker } from '../../helpers/regel.checker';
import { Name } from '../../models/name';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RegelInfoDialogComponent } from '../regel-info-dialog/regel-info-dialog.component';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';


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
  isLoadingData: boolean;
  regelnToPerson: Regel[];
  selectedSchulklasse: Schulklasse;
  regelChecker: RegelChecker;
  neueSchulklasseName: string
  neueSchulklasseForm = new FormControl('', [Validators.required, Validators.minLength(2)]);
  regelInfoDialogRef: MatDialogRef<RegelInfoDialogComponent>;




  @Input() personId: string
  
  

  constructor( private userService:UserService,
     public dialog: MatDialog) {
      this.regelChecker = new RegelChecker();

      
  }
  myUser:User

 


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
      this.klassenToPerson = this.myUser.schulklassen
      this.regelnToPerson = this.myUser.regeln
      this.klassenToPersonOriginal = JSON.parse(JSON.stringify(this.klassenToPerson));
      // console.log(this.myUser)
      // console.log(this.klassenToPerson)
      this.isLoadingData = false;
    
    });

  
  }


  getErrorMessageNeueSchulklasse() {
    return this.neueSchulklasseForm.hasError('required') ? 'Wert erforderlich' :
        this.neueSchulklasseForm.hasError('minlength') ? 'Name zu kurz' :
            '';
  }


  onSelect(selectedId: Name): void {
    debugger;
    this.selectedSchulklasse = this.klassenToPerson.filter(klasse => klasse.id == selectedId.id)[0];


  }
  deleteSchulklasse(selectedId: Name):void{
    debugger;
    let klasse = this.klassenToPerson.filter(klasse => klasse.id == selectedId.id)[0];
    if(!this.regelChecker.regelExistsToSchulklasse(klasse, this.regelnToPerson)){
      this.klassenToPerson = this.klassenToPerson.filter(
        item =>
          item.id !== klasse.id);
      this.selectedSchulklasse = null;
      this.savingIsActiv = true;
    }else{
      this.regelInfoDialogRef = this.dialog.open(RegelInfoDialogComponent, {
        height: '210px',
        width: '550px',
      });
    }
    

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

  
  saveSchulklasseSchueler() {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    this.myUser.schulklassen = this.klassenToPerson
    this.userService.updateUser(this.myUser);
    this.isSaving = false;
    this.klassenToPersonOriginal = this.klassenToPerson;
    
  }
  cancel(){
    debugger;
    this.klassenToPerson = JSON.parse(JSON.stringify(this.klassenToPersonOriginal));
    this.savingIsActiv = false;
  }

  ngOnInit(){
    debugger;
    this.isLoadingData = true;
    this.loadInputData();

  }

}
