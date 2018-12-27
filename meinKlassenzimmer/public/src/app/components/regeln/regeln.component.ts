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


  constructor(private regelService: RegelService, private klassenService: SchulklassenService 
         ,private zimmerService : SchulzimmerService         ) 
  {
     this.regelEnricher = new RegelEnricher();

  }
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<OutputRegel>();

 
//   neueSchulklasseName: string
//   neueSchulklasseForm = new FormControl('', [Validators.required, Validators.minLength(2)]);

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


//   getErrorMessageNeueSchulklasse() {
//     return this.neueSchulklasseForm.hasError('required') ? 'Wert erforderlich' :
//         this.neueSchulklasseForm.hasError('minlength') ? 'Name zu kurz' :
//             '';
//   }



//   }
  deleteRegel(regelOutput: OutputRegel):void{

    this.regelnToPerson = this.regelnToPerson.filter(
      item =>
        item.id !== regelOutput.regelId);
    this.savingIsActiv = true;
    this.dataSource.data = this.regelEnricher.enrichedRegel(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson);

  }

  addRegel(): void {
    debugger;
    var neueRegelTmp = new Regel();
    neueRegelTmp.id = uuidv4();
    neueRegelTmp.beschreibung = this.selectedBeschreibung;
    neueRegelTmp.type = this.selectedType;
    neueRegelTmp.schueler1Id = this.selectedSchueler.id;
    neueRegelTmp.tischId = this.selectedTisch.id
    this.regelnToPerson.push(neueRegelTmp);

    this.dataSource.data = this.regelEnricher.enrichedRegel(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson);
    this.savingIsActiv = true;
        
    // this.neueSchulklasseName = null;

    // this.neueSchulklasseForm.markAsPristine();
    // this.neueSchulklasseForm.markAsUntouched();
    // this.neueSchulklasseForm.updateValueAndValidity();

  }
  


  
  async saveRegeln(): Promise<void> {
    debugger;
    this.savingIsActiv = false; 
    this.isSaving = true;
    // this.personDbHelper.savePerson();
    await this.regelService.updateRegeln(this.regelnToPerson).subscribe(() => this.isSaving = false);
  }

  canDeactivate(){
    debugger;
    return !this.savingIsActiv;
  }

  ngOnInit(){
    debugger;
    
    this.isLoadingSchulklasse = true;
    this.isLoadingSchulzimmer = true;
    this.isLoadingRegeln = true;
    this.loadInputData();

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

 

}
