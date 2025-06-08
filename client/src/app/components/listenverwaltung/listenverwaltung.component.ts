import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Schulklasse } from '../../models/schulklasse';
import { Schueler } from '../../models/schueler';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../../models/user';
import { Klassenliste } from '../../models/klassenliste';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Name } from 'src/app/models/name';
import { Gruppe } from 'src/app/models/gruppe';
import { Regel } from 'src/app/models/regel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';
import { RegelFilter } from 'src/app/helpers/regel.filter';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/services/data.service';

@Component({
  standalone: false,
  selector: 'app-listenverwaltung',
  templateUrl: './listenverwaltung.component.html',
  styleUrls: ['./listenverwaltung.component.css']
})
export class ListenverwaltungComponent implements OnInit {
  relevantRegeln: Regel[];

  myUser: User
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

  displayedColumns: string[] = ['name', "klasse", 'groups', 'action'];
  dataSource: MatTableDataSource<Klassenliste>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  myListForm: FormGroup
  name: FormControl;
  klasse: FormControl;
  groups: FormControl;
  formSubmitAttempt: boolean;

  regelFilter: RegelFilter;


  constructor(
    private dataService: DataService,
    private _snackBar: MatSnackBar) {

    this.regelFilter = new RegelFilter()
  }




  loadInputData() {
    this.dataService.mapUser(user => this.applyUser(user))


  }

  applyUser(users) {
    debugger;
    this.myUser = new User(users[0])
    this.klassenToPerson = this.myUser.schulklassen
    this.regelnToPerson = this.myUser.regeln
    this.klassenlistenToPerson = this.myUser.klassenlisten
    this.klassenlistenToPersonOriginal = JSON.parse(JSON.stringify(this.klassenlistenToPerson));
    console.log(this.myUser)
    console.log(this.klassenlistenToPerson)
    this.isLoadingData = false;
    this.dataSource = new MatTableDataSource(this.klassenlistenToPerson);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }



  createKlassenliste(): void {
    debugger;
    var klasselisteTmp = new Klassenliste();
    klasselisteTmp.name = this.selectedListNameInput;
    klasselisteTmp.id = uuidv4();
    klasselisteTmp.schulklassenId = this.klassenToPerson.filter(klasse => klasse.id == this.selectedSchulklasse.id)[0].id
    klasselisteTmp.schulklassenName = this.klassenToPerson.filter(klasse => klasse.id == this.selectedSchulklasse.id)[0].name
    klasselisteTmp.gruppen = this.initializeGroups(this.selectedGroupNumberInput, klasselisteTmp.schulklassenId)
    this.klassenlistenToPerson.push(klasselisteTmp);
    klasselisteTmp = null;
    this.selectedSchulklasse = null;
    this.selectedGroupNumberInput = null;
    this.savingIsActiv = true;
    this.selectedListNameInput = null;

    this.myListForm.markAsPristine();
    this.myListForm.markAsUntouched();
    this.myListForm.updateValueAndValidity();

    this.dataSource = new MatTableDataSource(this.klassenlistenToPerson);


  }

  private initializeGroups(inputGroupNumber: number, schulklassenId: string): Gruppe[] {
    debugger;
    // let numberOfGroups = this.calculateNumberGroups(inputGroupNumber)
    let numberOfGroups = Math.round(inputGroupNumber)
    let gruppen = new Array<Gruppe>(numberOfGroups)
    // Set id and name of each group
    for (var i = 0; i < gruppen.length; i++) {
      debugger;
      gruppen[i] = new Gruppe()
      gruppen[i].id = i;
      gruppen[i].name = 'Gruppe ' + (i + 1)
      gruppen[i].schueler = new Array<Schueler>()
    }


    return gruppen

  }


  onSelect(klassenliste: Klassenliste): void {
    debugger;
    this.selectedKlassenliste = this.klassenlistenToPerson.filter(liste => liste.id == klassenliste.id)[0];
    this.relevantSchulklasse = this.klassenToPerson.filter(klasse => klasse.id == this.selectedKlassenliste.schulklassenId)[0]
    this.relevantRegeln = this.regelFilter.filterRegelBySchulklasse(this.regelnToPerson,
      this.klassenToPerson, this.relevantSchulklasse).filter(regel => regel.type==="Unmögliche Paarung") //Since there are no seatings, it doesn't make sense to allow other type of regeln



  }
  onNameChange(newName: Name): void {
    debugger;
    let oldName = this.klassenlistenToPerson.filter(klassenliste => klassenliste.id == newName.id)[0].name;
    if (oldName != newName.text) {
      this.klassenlistenToPerson.filter(klassenliste => klassenliste.id == newName.id)[0].name = newName.text;
      this.savingIsActiv = true;
    }

  }
  deleteKlassenliste(klassenliste: Klassenliste): void {
    debugger;
    this.klassenlistenToPerson = this.klassenlistenToPerson.filter(
      item =>
        item.id !== klassenliste.id);
    this.selectedKlassenliste = null;
    this.savingIsActiv = true;
    this.dataSource = new MatTableDataSource(this.klassenlistenToPerson);

  }

  createButtonActive(): boolean {
    return (
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


  }
  createForm() {
    this.myListForm = new FormGroup({
      name: this.name,
      klasse: this.klasse,
      groups: this.groups
    });
  }

  openSavingSnackBar() {
    this._snackBar.openFromComponent(SaveSnackBarComponent, {
      duration: 2000,
    });

  }

  canDeactivate() {
    debugger;
    return !this.savingIsActiv;
  }

  saveKlassenlisten(): void {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    this.myUser.klassenlisten = this.klassenlistenToPerson
    this.dataService.updateUser(this.myUser);
    this.isSaving = false;
    this.klassenlistenToPersonOriginal = this.klassenlistenToPerson;
    this.openSavingSnackBar()

  }
  cancel() {
    debugger;
    this.klassenlistenToPerson = JSON.parse(JSON.stringify(this.klassenlistenToPersonOriginal));
    this.dataSource = new MatTableDataSource(this.klassenlistenToPerson);
    this.savingIsActiv = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  ngOnInit(): void {
    debugger;
    this.createFormControls();
    this.createForm();
    this.isLoadingData = true;
    this.loadInputData();


  }



}
