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

@Component({
  selector: 'app-listenverwaltung',
  templateUrl: './listenverwaltung.component.html',
  styleUrls: ['./listenverwaltung.component.css']
})
export class ListenverwaltungComponent implements OnInit {
  

  constructor(private dummyService:DummyService) {
   }
  
  myUser:User
  klassenToPerson: Schulklasse[];
  klassenlistenToPerson: Klassenliste[]
  isLoadingData: boolean;
  selectedSchulklasse: Schulklasse;
  selectedListNameInput: string;
  selectedGroupNumberInput: number;
  selectedSchueler: Schueler[];
  selectedKlassenliste: Klassenliste;
  relevantSchulklasse: Schulklasse;
  savingIsActiv: boolean;
  displayedColumns = ['vorname', 'name'];
  dataSource = new MatTableDataSource<Schueler>();
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  myListForm: FormGroup
  name: FormControl;
  klasse: FormControl;
  groups: FormControl;
  formSubmitAttempt: boolean;
     
  loadInputData() {
    this.klassenToPerson = this.dummyService.getSchulklassen()
    this.klassenlistenToPerson = new Array<Klassenliste>()
    this.isLoadingData = false
    
  
  }

  // selectOneSchueler(){
    
  //   this.selectSchueler(1)

  // }
  // selectTwoSchueler(){
  //   this.selectSchueler(2)

  // }
  // selectFiveSchueler(){
  //   this.selectSchueler(5)

  // }

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
    let numberOfGroups = this.calculateNumberGroups(inputGroupNumber)
    let gruppen = new Array<Gruppe>(numberOfGroups)
    // Set id and name of each group
    for (var i = 0; i < gruppen.length; i++) {
      debugger;
      gruppen[i] = new Gruppe()
      gruppen[i].id = i;
      gruppen[i].name = 'Gruppe '+ (i+1)
      gruppen[i].schueler = new Array<Schueler>()
    }
    // add all schueler to last group
    gruppen[numberOfGroups - 1 ].schueler = this.selectSchuelerToSchulklasse(schulklassenId)

    return gruppen

  }

  private calculateNumberGroups(inputGroupNumber): number {
    let numberOfGroups = Math.round(inputGroupNumber) + 1
    return numberOfGroups 
  }

  private selectSchuelerToSchulklasse(schulklassenId: string): Schueler[] {
    let schueler = this.klassenToPerson.filter(klasse => klasse.id == schulklassenId )[0].schueler
    return schueler

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

 

  // private selectSchueler(numberSelectedSchueler: number){
  //     let randomizer = new Randomizer()
  //     let randomizedSchueler = randomizer.shuffle(this.selectedSchulklasse.schueler)
  //     this.selectedSchueler = randomizedSchueler.slice(0, numberSelectedSchueler)

  //     this.dataSource.data = this.selectedSchueler;

  // }


  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
    this.isLoadingData = true;
    this.loadInputData();

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
