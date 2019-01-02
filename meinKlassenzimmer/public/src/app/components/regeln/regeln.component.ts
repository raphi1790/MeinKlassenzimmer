import { Component, OnInit, ViewChild } from '@angular/core';
import { RegelService } from '../../services/regel.service';

import { Regel } from '../../models/regel';
import { Schulzimmer } from '../../models/schulzimmer';
import { Schulklasse } from '../../models/schulklasse';
import { SchulklassenService } from '../../services/schulklassen.service';
import { SchulzimmerService } from '../../services/schulzimmer.service';
import { Schueler } from '../../models/schueler';
import { Tisch } from '../../models/tisch';
import { MatTable, MatPaginator, MatTableDataSource } from '@angular/material';
import { RegelEnricher } from '../../helpers/regel.enricher';
import { Observable } from 'rxjs';
import { OutputRegel } from 'app/models/output.regel';
import * as uuidv4 from 'uuid/v4';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

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
  isLoadingRegeln: boolean;
  isSaving: boolean;
  isLoadingSchulklasse: boolean;
  isLoadingSchulzimmer: boolean;
  regelnToPerson: Regel[];
  regelTypes = ['Fester Sitzplatz']
  schuelerToKlasse:Schueler[];
  tischeToZimmer: Tisch[];
  displayedColumns = ['beschreibung', 'type', 'klasse', 'zimmer',  'schueler', 'tischNumber', 'symbol'];
  selectedType: string;
  selectedSchueler: Schueler;
  selectedTisch: Tisch;
  selectedBeschreibung: string;
  regelEnricher: RegelEnricher
  myForm: FormGroup;
  beschreibung: FormControl;
  klasse: FormControl;
  zimmer: FormControl;
  type: FormControl;
  schueler: FormControl;
  tisch: FormControl;
  formSubmitAttempt: boolean;



  constructor(private regelService: RegelService, private klassenService: SchulklassenService 
         ,private zimmerService : SchulzimmerService  
             ) 
  {
     this.regelEnricher = new RegelEnricher();

  }
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<OutputRegel>();

 

loadInputData() {
    
     this.klassenService.getKlassenAndSchuelerByPersonid().subscribe((
        data: Schulklasse[]) => { 
          this.klassenToPerson = data; this.isLoadingSchulklasse = false;
          this.zimmerService.getSchulzimmerAndTischeByPersonid().subscribe((data: Schulzimmer[]) => 
            { this.zimmerToPerson = data; this.isLoadingSchulzimmer = false; 
              this.regelService.getRegelByPersonid().subscribe(
                (data:Regel[]) => {
                  debugger;
                  this.regelnToPerson = data;
                  this.dataSource.data = this.regelEnricher.enrichedRegel(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson)
                  console.log("Enriched Regeln");
                  console.log(this.dataSource);
                  this.isLoadingRegeln = false;
                });
            })
         }
        
        
        );

    }
      

showDetailConfiguration(): boolean {
  var showDetailConfiguration = false;
  if (this.selectedSchulklasse != undefined && this.selectedSchulzimmer != undefined){
    this.schuelerToKlasse =  this.selectedSchulklasse.schueler;
    this.tischeToZimmer = this.selectedSchulzimmer.tische.filter(tisch => tisch.active == true);
    showDetailConfiguration = true;

  }
  return showDetailConfiguration;

}



  deleteRegel(regelOutput: OutputRegel):void{
    this.regelnToPerson = this.regelnToPerson.filter(
      item =>
        item.id !== regelOutput.regelId);
    this.savingIsActiv = true;
    this.dataSource.data = this.regelEnricher.enrichedRegel(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson);

  }

  addRegel(): void {
    debugger;
    if (this.myForm.valid) {
      
      var neueRegelTmp = new Regel();
      neueRegelTmp.id = uuidv4();
      neueRegelTmp.beschreibung = this.selectedBeschreibung;
      neueRegelTmp.type = this.selectedType;
      neueRegelTmp.schueler1Id = this.selectedSchueler.id;
      neueRegelTmp.tischId = this.selectedTisch.id
      this.regelnToPerson.push(neueRegelTmp);
      this.dataSource.data = this.regelEnricher.enrichedRegel(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson);
      this.savingIsActiv = true;
      this.myForm.reset();
      this.formSubmitAttempt = false;
    }

  }
  isFieldValid(field: string) {
    return (
      (!this.myForm.get(field).valid && (this.myForm.get(field).touched || this.myForm.get(field).dirty)) ||
      (this.myForm.get(field).untouched && this.formSubmitAttempt)
 
    );
  }
  

  

  
  async saveRegeln(): Promise<void> {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    await this.regelService.updateRegeln(this.regelnToPerson).subscribe(() => this.isSaving = false);
  }

  canDeactivate(){
    debugger;
    return !this.savingIsActiv;
  }

  ngOnInit(){
    debugger;
    this.createFormControls();
    this.createForm();
    this.isLoadingSchulklasse = true;
    this.isLoadingSchulzimmer = true;
    this.isLoadingRegeln = true;
    this.loadInputData();

  }
  createFormControls() {
    this.beschreibung = new FormControl(null, Validators.required);
    this.klasse = new FormControl(null, Validators.required);
    this.zimmer = new FormControl(null, Validators.required);
    this.schueler = new FormControl(null, Validators.required);
    this.type = new FormControl(null, Validators.required);
    this.tisch = new FormControl(null, Validators.required);

  }
  createForm() {
    this.myForm = new FormGroup({
      beschreibung: this.beschreibung,
      klasse : this.klasse,
      zimmer : this.zimmer,
      type : this.type,
      tisch : this.tisch,
      schueler : this.schueler,
    });
  }
  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

 

}
