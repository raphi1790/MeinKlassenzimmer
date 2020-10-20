import { Component, OnInit, ViewChild } from '@angular/core';
import { DummyService } from '../../services/dummy.service';
import { Schulklasse } from '../../models/schulklasse';
import { Schueler } from '../../models/schueler';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Randomizer } from '../../helpers/randomizer';
import { User } from '../../models/user';
import { Klassenliste } from '../../models/klassenliste';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Name } from 'src/app/models/name';
import { Gruppe } from 'src/app/models/gruppe';
import { Regel } from 'src/app/models/regel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';

@Component({
  selector: 'app-listenverwaltung',
  templateUrl: './listenverwaltung.component.html',
  styleUrls: ['./listenverwaltung.component.css']
})
export class ListenverwaltungComponent implements OnInit {
  

  constructor(private dummyService:DummyService, private userService:UserService, private _snackBar: MatSnackBar) {
   }
  
  myUser:User
  klassenToPerson: Schulklasse[];
  klassenlistenToPerson: Klassenliste[]
  klassenlistenToPersonOriginal: Klassenliste[]
  isLoadingData: boolean;
  isSaving: boolean;
  regelnToPerson: Regel[];
  selectedSchulklasse: Schulklasse;
  selectedListNameInput: string;
  selectedGroupNumberInput: number;
  selectedSchueler: Schueler[];
  selectedKlassenliste: Klassenliste;
  relevantSchulklasse: Schulklasse;
  savingIsActiv: boolean;


  myListForm: FormGroup
  name: FormControl;
  klasse: FormControl;
  groups: FormControl;
  formSubmitAttempt: boolean;

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
      this.klassenlistenToPerson = this.myUser.klassenlisten
      this.klassenlistenToPersonOriginal = JSON.parse(JSON.stringify(this.klassenlistenToPerson));
      // console.log(this.myUser)
      // console.log(this.klassenToPerson)
      this.isLoadingData = false;
    
    });

  
  }
     

  createKlassenliste(): void {
    debugger;
    var klasselisteTmp = new Klassenliste();
    klasselisteTmp.name = this.selectedListNameInput;
    klasselisteTmp.id = uuidv4();
    klasselisteTmp.schulklassenId = this.klassenToPerson.filter(klasse => klasse.id == this.selectedSchulklasse.id)[0].id
    klasselisteTmp.gruppen = this.initializeGroups(this.selectedGroupNumberInput, klasselisteTmp.schulklassenId)
    this.klassenlistenToPerson.push(klasselisteTmp);
    klasselisteTmp = null;
    this.selectedSchulklasse = null;
    this.savingIsActiv = true;
    this.selectedListNameInput = null;

    this.myListForm.markAsPristine();
    this.myListForm.markAsUntouched();
    this.myListForm.updateValueAndValidity();

  }

  private initializeGroups(inputGroupNumber: number, schulklassenId: string):Gruppe[]  {
    debugger;
    // let numberOfGroups = this.calculateNumberGroups(inputGroupNumber)
    let numberOfGroups =  Math.round(inputGroupNumber)
    let gruppen = new Array<Gruppe>(numberOfGroups)
    // Set id and name of each group
    for (var i = 0; i < gruppen.length; i++) {
      debugger;
      gruppen[i] = new Gruppe()
      gruppen[i].id = i;
      gruppen[i].name = 'Gruppe '+ (i+1)
      gruppen[i].schueler = new Array<Schueler>()
    }


    return gruppen

  }
  

  onSelect(selectedId: Name): void {
    debugger;
    this.selectedKlassenliste = this.klassenlistenToPerson.filter(liste => liste.id == selectedId.id)[0];
    this.relevantSchulklasse = this.klassenToPerson.filter(klasse => klasse.id == this.selectedKlassenliste.schulklassenId )[0]
    

  }

  createButtonActive(): boolean{
    return(
      this.myListForm.valid
    )
  }

  updateKlassenliste(updatedKlassenliste: Klassenliste): void {
    debugger;
    this.klassenlistenToPerson = this.klassenlistenToPerson.filter(
      item =>
        item.id !== updatedKlassenliste.id)
    if (typeof this.klassenlistenToPerson == 'undefined') {
      console.log("klassenlistenToPerson is undefined");
    }
    else {
      this.klassenlistenToPerson.push(updatedKlassenliste);
    }
    this.savingIsActiv = true;
  }

  isFieldValid(form: FormGroup, field: string) {
    return (
      (!form.get(field).valid && (form.get(field).touched 
        || form.get(field).dirty)) ||
      (form.get(field).untouched && this.formSubmitAttempt)
 
    );
  }

  createFormControls() {
    this.name = new FormControl(null, [Validators.required, Validators.minLength(2)]);
    this.klasse = new FormControl(null, Validators.required);
    this.groups = new FormControl(null, Validators.required);
  ;

  }
  createForm() {
    this.myListForm = new FormGroup({
      name: this.name,
      klasse : this.klasse,
      groups : this.groups
    });
  }

  openSavingSnackBar(){
    this._snackBar.openFromComponent(SaveSnackBarComponent, {
      duration: 2000,
    });

  }

  saveKlassenlisten(): void {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    this.myUser.klassenlisten = this.klassenlistenToPerson
    this.userService.updateUser(this.myUser);
    this.isSaving = false;
    this.klassenlistenToPersonOriginal = this.klassenlistenToPerson;
    this.openSavingSnackBar()

  }
  cancel(){
    debugger;
    this.klassenlistenToPerson = JSON.parse(JSON.stringify(this.klassenlistenToPersonOriginal));
    this.savingIsActiv = false;
  }



  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
    this.isLoadingData = true;
    this.loadInputData();

  }


}
