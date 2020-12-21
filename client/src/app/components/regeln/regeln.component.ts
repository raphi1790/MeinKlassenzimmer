import { Component, OnInit, ViewChild } from '@angular/core';
import { Regel } from '../../models/regel';
import { Schulzimmer } from '../../models/schulzimmer';
import { Schulklasse } from '../../models/schulklasse';
import { Schueler } from '../../models/schueler';
import { Tisch } from '../../models/tisch';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RegelEnricher } from '../../helpers/regel.enricher';
import { Observable } from 'rxjs';
import { OutputRegelTisch } from '../../models/output.regel.sitzordnung';
import * as uuidv4 from 'uuid/v4';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { OutputRegelPaarung } from '../../models/output.regel.paarung';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-regeln',
  templateUrl: './regeln.component.html',
  styleUrls: ['./regeln.component.css']
})
export class RegelnComponent implements OnInit {



  selectedSchulzimmer: Schulzimmer;
  selectedSchulklasse: Schulklasse;
  outputSchulzimmer: Schulzimmer;
  outputSchulklasse: Schulklasse;
  klassenToPerson: Schulklasse[];
  zimmerToPerson: Schulzimmer[];
  savingIsActiv: boolean;
  isSaving: boolean;
  regelnToPerson: Regel[];
  regelnToPersonOriginal: Regel[];
  regelTypes = ['Fester Sitzplatz', 'Unmögliche Paarung']
  schuelerToKlasse:Schueler[];
  tischeToZimmer: Tisch[];
  displayedColumnsSitzplatz = ['beschreibung',  'klasse', 'zimmer',  'schueler', 'tischNumber', 'symbol'];
  displayedColumnsPaarung = ['beschreibung', 'klasse',  'schueler1', 'schueler2', 'symbol'];
  selectedType: string;
  selectedSchueler: Schueler;
  selectedSchueler1: Schueler;
  selectedSchueler2: Schueler;
  selectedTisch: Tisch;
  selectedBeschreibung: string;
  regelEnricher: RegelEnricher
  myFormBase: FormGroup;
  myFormFesterSitzplatz: FormGroup;
  myFormPaarung: FormGroup;
  beschreibung: FormControl;
  klasse: FormControl;
  zimmer: FormControl;
  type: FormControl;
  schueler: FormControl;
  schueler1: FormControl;
  schueler2: FormControl;
  tisch: FormControl;
  formSubmitAttempt: boolean;
  isLoadingData: boolean;
  myUser: User;



  constructor(private userService:UserService,  private _snackBar: MatSnackBar) 
  {
     this.regelEnricher = new RegelEnricher();

  }
  @ViewChild(MatTable, { static: true }) tableSitzplatz: MatTable<any>;
  @ViewChild(MatTable, { static: true }) tablePaarung: MatTable<any>;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSourceSitzplatz = new MatTableDataSource<OutputRegelTisch>();
  dataSourcePaarung = new MatTableDataSource<OutputRegelPaarung>();

 

  loadInputData() {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ uid: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(users => {
      debugger;
      this.myUser = new User(users[0])
      this.regelnToPerson = this.myUser.regeln
      this.regelnToPerson = JSON.parse(JSON.stringify(this.regelnToPerson));
      this.klassenToPerson = this.myUser.schulklassen
      this.zimmerToPerson = this.myUser.schulzimmer
      this.enrichRegeln(this.regelnToPerson)
      // console.log(this.myUser)
      // console.log(this.regelnToPerson)
      this.isLoadingData = false;
    
    });

  
  }
      

showDetailConfigurationFesterSitzplatz(): boolean {
    var showDetailConfigurationFesterSitzplatz = false;
    if (this.selectedSchulklasse != undefined 
         && this.selectedType == "Fester Sitzplatz"){
          
      this.schuelerToKlasse =  this.selectedSchulklasse.schueler;
      showDetailConfigurationFesterSitzplatz = true;

    }
    return showDetailConfigurationFesterSitzplatz;

}
showDetailConfigurationUnpassendePaarung(): boolean {
  var showDetailConfigurationPaarung = false;
  if (this.selectedSchulklasse != undefined 
      && this.selectedType == "Unmögliche Paarung"){
        
    this.schuelerToKlasse =  this.selectedSchulklasse.schueler;
    showDetailConfigurationPaarung = true;

  }
  return showDetailConfigurationPaarung;

}
  enrichRegeln(regeln:Regel[]){
    debugger;
    let regelnTypeSitzplatz = regeln.filter(regel => regel.type == "Fester Sitzplatz");
    let regelnTypePaarung = regeln.filter(regel => regel.type == "Unmögliche Paarung");
    this.dataSourceSitzplatz.data = this.regelEnricher.enrichedRegelSitzplatz(this.klassenToPerson, this.zimmerToPerson, regelnTypeSitzplatz);
    this.dataSourcePaarung.data = this.regelEnricher.enrichedRegelPaarung(this.klassenToPerson, regelnTypePaarung);
  }




  deleteRegelSitzplatz(regelOutput: OutputRegelTisch):void{
    this.regelnToPerson = this.regelnToPerson.filter(
      item =>
        item.id !== regelOutput.regelId);
    this.savingIsActiv = true;
    this.dataSourceSitzplatz.data = this.regelEnricher.enrichedRegelSitzplatz(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson);

  }
  deleteRegelPaarung(regelOutput: OutputRegelPaarung):void{
    this.regelnToPerson = this.regelnToPerson.filter(
      item =>
        item.id !== regelOutput.regelId);
    this.savingIsActiv = true;
    this.dataSourcePaarung.data = this.regelEnricher.enrichedRegelPaarung(this.klassenToPerson,  this.regelnToPerson);

  }

  addRegel(): void {
    debugger;
    this.formSubmitAttempt = true;
    if (this.myFormBase.valid && (this.myFormFesterSitzplatz.valid ||  this.myFormPaarung.valid) ){
      var neueRegelTmp = new Regel();
        neueRegelTmp.id = uuidv4();
        neueRegelTmp.beschreibung = this.selectedBeschreibung;
        neueRegelTmp.type = this.selectedType;
      if(this.myFormFesterSitzplatz.valid){
        neueRegelTmp.schueler1Id = this.selectedSchueler.id;
        neueRegelTmp.tischId = this.selectedTisch.id
      }else{
        neueRegelTmp.schueler1Id = this.selectedSchueler1.id;
        neueRegelTmp.schueler2Id = this.selectedSchueler2.id;

      }
      this.regelnToPerson.push(neueRegelTmp);
      this.enrichRegeln(this.regelnToPerson);
      this.savingIsActiv = true;
      this.myFormBase.reset();
      this.myFormFesterSitzplatz.reset();
      this.myFormPaarung.reset();
      this.formSubmitAttempt = false;
    }

  }

  addButtonActive(): boolean{
    return(
      this.myFormBase.valid && (this.myFormFesterSitzplatz.valid || this.myFormPaarung.valid)
    )
  }
  resetChildForms(){
    this.myFormFesterSitzplatz.reset();
    this.myFormPaarung.reset();
  }
  selectZimmer(){
    this.tischeToZimmer = this.selectedSchulzimmer.tische.filter(tisch => tisch.active == true);
  }

  isFieldValid(form: FormGroup, field: string) {
    return (
      (!form.get(field).valid && (form.get(field).touched 
        || form.get(field).dirty)) ||
      (form.get(field).untouched && this.formSubmitAttempt)
 
    );
  }

  openSavingSnackBar(){
    this._snackBar.openFromComponent(SaveSnackBarComponent, {
      duration: 2000,
    });

  }
  

  saveRegeln() {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    this.myUser.regeln = this.regelnToPerson
    this.userService.updateUser(this.myUser);
    this.isSaving = false;
    this.regelnToPersonOriginal = this.regelnToPerson;
    this.openSavingSnackBar()
    
  }

  cancel(){
    debugger;
    this.regelnToPerson = JSON.parse(JSON.stringify(this.regelnToPersonOriginal));
    this.dataSourcePaarung.data = this.regelEnricher.enrichedRegelPaarung(this.klassenToPerson,  this.regelnToPerson);
    this.dataSourceSitzplatz.data = this.regelEnricher.enrichedRegelSitzplatz(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson);
    this.savingIsActiv = false;
  }

  canDeactivate(){
    debugger;
    return !this.savingIsActiv;
  }

  ngOnInit(){
    debugger;
    this.createFormControls();
    this.createForm();
    this.isLoadingData = true;
    this.loadInputData();

  }
  createFormControls() {
    this.beschreibung = new FormControl(null, Validators.required);
    this.klasse = new FormControl(null, Validators.required);
    this.zimmer = new FormControl(null, Validators.required);
    this.schueler = new FormControl(null, Validators.required);
    this.schueler1 = new FormControl(null, Validators.required);
    this.schueler2 = new FormControl(null, Validators.required);
    this.type = new FormControl(null, Validators.required);
    this.tisch = new FormControl(null, Validators.required);

  }
  createForm() {
    this.myFormBase = new FormGroup({
      beschreibung: this.beschreibung,
      klasse : this.klasse,
      type : this.type
    });
    this.myFormFesterSitzplatz = new FormGroup({
      zimmer : this.zimmer,
      tisch : this.tisch,
      schueler : this.schueler
    });
    this.myFormPaarung = new FormGroup({
      schueler1 : this.schueler1,
      schueler2 : this.schueler2
    });
  }


  ngAfterViewInit() {
    this.dataSourceSitzplatz.paginator = this.paginator;
    this.dataSourcePaarung.paginator = this.paginator;
  }

 

}
