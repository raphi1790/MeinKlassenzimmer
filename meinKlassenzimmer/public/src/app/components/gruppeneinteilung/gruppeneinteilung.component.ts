import { Component, OnInit, ViewChild } from '@angular/core';
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
  groupSizes = [2, 3, 4, 5, 6];
  groupTypes = ['Gruppengrösse', 'Gruppenanzahl'];
  selectedGroupType: string;
  selectedGroupSize: number;
  showGroups: boolean;
  groupPreparer: GroupPreparer;
  outputSchulklasse: Schulklasse
  outputGroupSize: number;
  outputGroupType: string;
  isLoadingSchulklasse: boolean;
  gruppeneinteilungTitle: string;



  displayedColumnsGroupsize2 = ['Gruppe', 'Schüler 1', 'Schüler 2'];
  displayedColumnsGroupsize3 = ['Gruppe', 'Schüler 1', 'Schüler 2', 'Schüler 3'];
  displayedColumnsGroupsize4 = ['Gruppe', 'Schüler 1', 'Schüler 2', 'Schüler 3', 'Schüler 4'];
  displayedColumnsGroupsize5 = ['Gruppe', 'Schüler 1', 'Schüler 2', 'Schüler 3', 'Schüler 4', 'Schüler 5'];
  displayedColumnsGroupsize6 = ['Gruppe', 'Schüler 1', 'Schüler 2', 'Schüler 3', 'Schüler 4', 'Schüler 5', 'Schüler 6'];
  displayedColumnsGroupnumber2 = ['Schüler', 'Gruppe 1', 'Gruppe 2'];
  displayedColumnsGroupnumber3 = ['Schüler', 'Gruppe 1', 'Gruppe 2', 'Gruppe 3'];
  displayedColumnsGroupnumber4 = ['Schüler', 'Gruppe 1', 'Gruppe 2', 'Gruppe 3', 'Gruppe 4'];
  displayedColumnsGroupnumber5 = ['Schüler', 'Gruppe 1', 'Gruppe 2', 'Gruppe 3', 'Gruppe 4', 'Gruppe 5'];
  displayedColumnsGroupnumber6 = ['Schüler', 'Gruppe 1', 'Gruppe 2', 'Gruppe 3', 'Gruppe 4', 'Gruppe 5', 'Gruppe 6'];
  columnsGroupsize2 = ['gruppe', 'schueler1', 'schueler2'];
  columnsGroupsize3 = ['gruppe', 'schueler1', 'schueler2', 'schueler3'];
  columnsGroupsize4 = ['gruppe', 'schueler1', 'schueler2', 'schueler3', 'schueler4'];
  columnsGroupsize5 = ['gruppe', 'schueler1', 'schueler2', 'schueler3', 'schueler4', 'schueler5'];
  columnsGroupsize6 = ['gruppe', 'schueler1', 'schueler2', 'schueler3', 'schueler4', 'schueler5', 'schueler6'];
  columnsGroupnumber2 = ['schueler', 'gruppe1', 'gruppe2'];
  columnsGroupnumber3 = ['schueler', 'gruppe1', 'gruppe2', 'gruppe3'];
  columnsGroupnumber4 = ['schueler', 'gruppe1', 'gruppe2', 'gruppe3', 'gruppe4'];
  columnsGroupnumber5 = ['schueler', 'gruppe1', 'gruppe2', 'gruppe3', 'gruppe4', 'gruppe5'];
  columnsGroupnumber6 = ['schueler', 'gruppe1', 'gruppe2', 'gruppe3', 'gruppe4', 'gruppe5', 'gruppe6'];
  columns = [];
  displayedColumns = [];

  @ViewChild(MatTable) table: MatTable<any>;

  dataSource: any;

  constructor(private klassenService: SchulklassenService, private zimmerService: SchulzimmerService) {

  }

  loadInputData() {
    this.klassenService.getKlassenAndSchuelerByPersonid().subscribe((data: Schulklasse[]) => { this.klassenToPerson = data; this.isLoadingSchulklasse = false; });
  }

  randomizeGroups() {
    debugger;
    this.showGroups = true;
    this.outputSchulklasse = this.selectedSchulklasse;
    this.outputGroupType = this.selectedGroupType;
    this.outputGroupSize = this.selectedGroupSize;

    if (this.outputGroupType == 'Gruppengrösse') {
        this.gruppeneinteilungTitle = 'Schulklasse '+ this.outputSchulklasse.name +' in ' +this.outputGroupSize +'er-Gruppen'
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
          case 6:
            this.displayedColumns = this.displayedColumnsGroupsize6;
            this.columns = this.columnsGroupsize6;
            break;

          default:
            break;
        }
      }else{
        this.gruppeneinteilungTitle = 'Schulklasse '+ this.outputSchulklasse.name +' in ' +this.outputGroupSize +' Gruppen'
        switch (this.outputGroupSize) {
          
          case 2:
            this.displayedColumns = this.displayedColumnsGroupnumber2;
            this.columns = this.columnsGroupnumber2;
            break;
          case 3:
            this.displayedColumns = this.displayedColumnsGroupnumber3;
            this.columns = this.columnsGroupnumber3;
            break;
          case 4:
            this.displayedColumns = this.displayedColumnsGroupnumber4;
            this.columns = this.columnsGroupnumber4;
            break;
          case 5:
            this.displayedColumns = this.displayedColumnsGroupnumber5;
            this.columns = this.columnsGroupnumber5;
            break;
          case 6:
            this.displayedColumns = this.displayedColumnsGroupnumber6;
            this.columns = this.columnsGroupnumber6;
            break;

          default:
            break;
        }
      }

    this.groupPreparer = new GroupPreparer();
    this.dataSource = this.groupPreparer
      .prepareGruppenEinteilung(this.outputSchulklasse.schueler, this.outputGroupType, this.outputGroupSize);


    console.log("Randomized Gruppeneinteilung");
    console.log(this.dataSource);
  }

  generatePdf() {
    var data = document.getElementById("contentToPdf");
    html2canvas(data).then(function (canvas) {
      debugger;
      var width = canvas.width;
      var height = canvas.height;
      var factor = width/200;
      var new_width = width/factor;
      var new_height = height / factor
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF("p","mm", "a4");
      doc.addImage(img, 'JPEG', 0, 0,new_width,new_height );
      doc.save('Gruppeneinteilung.pdf');
    });

  }

  ngOnInit() {
    this.isLoadingSchulklasse = true;
    this.loadInputData();

  }

}
