import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';

import { Schulklasse } from 'app/models/schulklasse';
import { TischSchueler } from 'app/models/tisch.schueler';
import { SchulklassenService } from 'app/services/schulklassen.service';
import { SchulzimmerService } from 'app/services/schulzimmer.service';
import { Schulzimmer } from '../../models/schulzimmer';
import { TischSchuelerPreparer } from '../../helpers/tischSchueler.preparer';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

import * as CONFIG from '../../../config.json';
import { RegelService } from 'app/services/regel.service';
import { Regel } from 'app/models/regel';
import { RegelEnricher } from 'app/helpers/regel.enricher';
import { MatTable, MatPaginator, MatTableDataSource, MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { OutputRegel } from 'app/models/output.regel';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-sitzordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})
export class SitzordnungComponent {

  selectedSchulzimmer: Schulzimmer;
  selectedSchulklasse: Schulklasse;
  outputSchulzimmer: Schulzimmer;
  outputSchulklasse: Schulklasse;
  klassenToPerson: Schulklasse[];
  zimmerToPerson: Schulzimmer[];
  regelnToPerson: Regel[];
  schulzimmerId: Number;
  schulklasseId: Number;
  showSitzordnung: boolean
  tischSchuelerPreparer: TischSchuelerPreparer;
  rowSchulzimmer: number[];
  columnSchulzimmer: number[];
  preparedTischSchueler: TischSchueler[][];
  zuvieleSchuelerInSchulzimmer: boolean;
  isLoadingSchulklasse: boolean;
  isLoadingSchulzimmer: boolean;
  isLoadingRegeln: boolean;
  regelEnricher: RegelEnricher;
  displayedColumns = ['select','beschreibung', 'type',   'schueler', 'tischNumber'];
  selection = new SelectionModel<OutputRegel>(true, []);
  enrichedRegelnToPerson: OutputRegel[];


  

  constructor(private klassenService: SchulklassenService, private zimmerService: SchulzimmerService, private regelService: RegelService) { 
    this.showSitzordnung = false;
    this.zuvieleSchuelerInSchulzimmer = false;
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);
    this.regelEnricher = new RegelEnricher();
  }
  @ViewChild(MatTable) table: MatTable<any>;


  dataSource = new MatTableDataSource<OutputRegel>();


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getErrorMessageZuvieleSchuelerInSchulzimmer(){
     return "Es gibt nicht genug aktive Tische für die Anzahl Schüler!"
  }

  loadInputData() {
    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe((
      data: Schulklasse[]) => { 
        this.klassenToPerson = data; this.isLoadingSchulklasse = false;
        this.zimmerService.getSchulzimmerAndTischeByPersonid().subscribe((data: Schulzimmer[]) => 
          { this.zimmerToPerson = data; this.isLoadingSchulzimmer = false; 
            this.regelService.getRegelByPersonid().subscribe(
              (data:Regel[]) => {
                this.regelnToPerson = data;
                this.enrichedRegelnToPerson = this.regelEnricher.enrichedRegel(this.klassenToPerson, this.zimmerToPerson, this.regelnToPerson)
                this.isLoadingRegeln = false;
              });
          })
       }
      
      
      );

  
    }

  klasseAndZimmerSelected(): boolean{
    
    var klasseAndZimmerSelected = false; 
    if (this.selectedSchulklasse != undefined && this.selectedSchulzimmer !=undefined){
      debugger;
      klasseAndZimmerSelected = true;
      let relevantEnrichedRegeln = this.enrichRegelnBasedOnFilter(this.selectedSchulklasse, this.selectedSchulzimmer);
      this.dataSource.data = relevantEnrichedRegeln;  
       
    }
    return klasseAndZimmerSelected;
  }

  enrichRegelnBasedOnFilter(selectedSchulklasse: Schulklasse, selectedSchulzimmer: Schulzimmer): OutputRegel[]{
    return this.enrichedRegelnToPerson.filter(element => element.klasse == selectedSchulklasse.name && element.zimmer == selectedSchulzimmer.name)

  }
 

  randomizePlaces(){
    debugger;
    var activeTische = this.selectedSchulzimmer.tische.filter(item => item.active == true);
    if(activeTische.length < this.selectedSchulklasse.schueler.length){
      this.zuvieleSchuelerInSchulzimmer = true;
      this.showSitzordnung = false;

    }
    else{
      this.zuvieleSchuelerInSchulzimmer = false;
      this.tischSchuelerPreparer = new TischSchuelerPreparer();
      this.showSitzordnung = true;
      this.outputSchulzimmer = this.selectedSchulzimmer;
      this.outputSchulklasse = this.selectedSchulklasse;
      let outputRegelnActive  = this.regelnToPerson
      .filter(item => this.selection.selected
            .map(output => output.regelId).includes(item.id))           
      this.preparedTischSchueler = this.tischSchuelerPreparer.prepareTischSchuelerCombination(this.outputSchulzimmer.tische, this.outputSchulklasse.schueler, outputRegelnActive)
      console.log("Randomized SchuelerTischArray");
      console.log(this.preparedTischSchueler);

    }
  
    

  }

  generatePdf(){
    var data = document.getElementById("contentToPdf");
    html2canvas(data).then(function(canvas) {
      var img = canvas.toDataURL("image/png");
        var doc = new jsPDF();
        doc.addImage(img,'JPEG',0,0);
        doc.save('Sitzordnung.pdf');
      });
        
  }

  ngOnInit() {
    this.isLoadingSchulklasse = true;
    this.isLoadingSchulzimmer = true;
    this.isLoadingRegeln = true;
    this.loadInputData();

  }

}
