import { Component, OnInit,ViewChild } from '@angular/core';
import { SchulklassenService } from 'app/services/schulklassen.service';
import { SchulzimmerService } from 'app/services/schulzimmer.service';
import { Schulklasse } from 'app/models/schulklasse';
import { GroupPreparer } from '../../helpers/group.preparer';
import { MatTable } from '@angular/material';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-gruppeneinteilung',
  templateUrl: './gruppeneinteilung.component.html',
  styleUrls: ['./gruppeneinteilung.component.css']
})
export class GruppeneinteilungComponent implements OnInit {

  selectedSchulklasse: Schulklasse;
  klassenToPerson: Schulklasse[];
  groupSizes = [2,3,4,5];
  selectedGroupSize: number;
  showGroups: boolean;
  groupPreparer: GroupPreparer;
  outputSchulklasse: Schulklasse
  outputGroupSize: number;
  isLoadingSchulklasse: boolean;
  
 
  

  displayedColumnsGroupsize2 = ['Gruppe' ,'Schüler 1','Schüler 2'];
  displayedColumnsGroupsize3 = ['Gruppe' ,'Schüler 1','Schüler 2','Schüler 3'];
  displayedColumnsGroupsize4 = ['Gruppe' ,'Schüler 1','Schüler 2','Schüler 3', 'Schüler 4'];
  displayedColumnsGroupsize5 = ['Gruppe' ,'Schüler 1','Schüler 2','Schüler 3', 'Schüler 4','Schüler 5'];
  columnsGroupsize2 = ['gruppe' ,'schueler1','schueler2'];
  columnsGroupsize3 = ['gruppe' ,'schueler1','schueler2','schueler3'];
  columnsGroupsize4 = ['gruppe' ,'schueler1', 'schueler2','schueler3','schueler4'];
  columnsGroupsize5 = ['gruppe' ,'schueler1', 'schueler2','schueler3','schueler4','schueler5'];
  columns = [];
  displayedColumns = [];

  @ViewChild(MatTable) table: MatTable<any>;

  dataSource: any;

  constructor(private klassenService: SchulklassenService, private zimmerService: SchulzimmerService) { 
    
  }

  loadInputData() {
    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe((data: Schulklasse[]) => { this.klassenToPerson = data ; this.isLoadingSchulklasse = false;});
  }

  randomizeGroups(){
    debugger;
    this.showGroups= true;
    this.outputSchulklasse = this.selectedSchulklasse;
    this.outputGroupSize = this.selectedGroupSize;
    
    this.groupPreparer = new GroupPreparer();
    switch (this.outputGroupSize) {
      case 2:
        this.displayedColumns = this.displayedColumnsGroupsize2;
        this.columns = this.columnsGroupsize2;
        break;
      case 3:
        this.displayedColumns = this.displayedColumnsGroupsize3;
        this.columns = this.columnsGroupsize3;
        break;
      case 4:
        this.displayedColumns = this.displayedColumnsGroupsize4;
        this.columns = this.columnsGroupsize4;
        break; 
      case 5:
        this.displayedColumns = this.displayedColumnsGroupsize5;
        this.columns = this.columnsGroupsize5;
        break;  

      default:
        break;
    }
    this.dataSource = this.groupPreparer
            .prepareGruppenEinteilung(this.outputSchulklasse.schueler,this.outputGroupSize );


    console.log("Randomized Gruppeneinteilung");
    console.log(this.dataSource);
  }

  generatePdf(){
    var data = document.getElementById("contentToPdf");
    html2canvas(data).then(function(canvas) {
      var img = canvas.toDataURL("image/png");
        var doc = new jsPDF();
        doc.addImage(img,'JPEG',0,0);
        doc.save('Gruppeneinteilung.pdf');
      });
        
  }

  ngOnInit() {
    this.isLoadingSchulklasse = true;
    this.loadInputData();

  }

}
