import { Component, OnInit, ViewChild } from '@angular/core';
import { Schulklasse } from '../../models/schulklasse';
import { GroupPreparer } from '../../helpers/group.preparer';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { Regel } from '../../models/regel';
import { SelectionModel } from '@angular/cdk/collections';
import { CalculatingEngine } from '../../helpers/calculating.engine';
import { EinteilungInfoDialogComponent } from '../einteilung-info-dialog/einteilung-info-dialog.component';
import { GroupEnricher } from '../../helpers/group.enricher';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-gruppeneinteilung',
  templateUrl: './gruppeneinteilung.component.html',
  styleUrls: ['./gruppeneinteilung.component.css']
})
export class GruppeneinteilungComponent implements OnInit {

  selectedSchulklasse: Schulklasse;
  myUser:User;
  klassenToPerson: Schulklasse[];
  regelnToPerson: Regel[];
  groupSizes = [2, 3, 4, 5, 6];
  groupTypes = ['Gruppengrösse', 'Gruppenanzahl'];
  selectedGroupType: string;
  selectedGroupSize: number;
  showGroups: boolean;
  outputSchulklasse: Schulklasse
  outputGroupSize: number;
  outputGroupType: string;
  gruppeneinteilungTitle: string;
  isLoadingData: boolean;
  selection = new SelectionModel<Regel>(true, []);
  einteilungInfoDialogRef: MatDialogRef<EinteilungInfoDialogComponent>;



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
  displayedColumnsRegel = ['select','type' ,'beschreibung'   ];

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatTable) tableRegel: MatTable<any>;

  dataSource: any;
  dataSourceRegel = new MatTableDataSource<Regel>();


  constructor( private userService: UserService, public dialog: MatDialog) {
  }

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
      // console.log(this.myUser)
      this.isLoadingData = false;
    
    });

  
  }
  klasseSelecteAndEnrichmentDone(): boolean{
    
    var klasseSelected = false; 
    if (this.selectedSchulklasse != undefined){
      klasseSelected = true;
      let relevantRegeln = this.filterRegel(this.selectedSchulklasse);
      this.dataSourceRegel.data = relevantRegeln;  
       
    }
    return klasseSelected;
  }

  filterRegel(selectedSchulklasse: Schulklasse): Regel[]{
    let relevantRegeln = new Array<Regel>();
    let workingRegeln = this.regelnToPerson;

    for (let index = 0; index < workingRegeln.length; index++) {
      let chosenSchueler = this.klassenToPerson.filter(klasse => 
        klasse.schueler.some(x => x.id== workingRegeln[index].schueler1Id)).map(element => {
            let newElt = Object.assign({}, element);
            return newElt.schueler.filter(x => x.id== workingRegeln[index].schueler1Id)
        });
          switch (workingRegeln[index].type) {
            
            case "Unmögliche Paarung":
              if( chosenSchueler[0][0].schulklassenId == selectedSchulklasse.id){
                  relevantRegeln.push(workingRegeln[index]);
                }
              break;  
          
            default:
              break;
          }   
      
    }
    return relevantRegeln

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceRegel.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceRegel.data.forEach(row => this.selection.select(row));
  }

  randomizeGroups() {
    debugger;
    this.outputSchulklasse = this.selectedSchulklasse;
    this.outputGroupType = this.selectedGroupType;
    this.outputGroupSize = this.selectedGroupSize;
    let outputRegelnActive  = this.regelnToPerson
      .filter(item => this.selection.selected
            .map(output => output.id).includes(item.id))  

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

    let groupPreparer = new GroupPreparer();
    let calculatingEngine = new CalculatingEngine(); 
    debugger;
    let resultOutput = calculatingEngine.calculate(groupPreparer,this.outputSchulklasse.schueler,outputRegelnActive,null,this.outputGroupType , this.outputGroupSize)       
    if (typeof resultOutput === 'undefined'){
      this.showGroups = false;
      this.einteilungInfoDialogRef = this.dialog.open(EinteilungInfoDialogComponent, {
        height: '250px',
        width: '400px',
      });

    }
    else{
      this.showGroups = true;
      let groupEnricher = new GroupEnricher();
      this.dataSource = groupEnricher.enrichGroupBasedOnType(resultOutput, this.outputGroupType, this.outputGroupSize)
      // console.log("Randomized Gruppeneinteilung");
      // console.log(this.dataSource);
    }



    
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
    this.isLoadingData = true;
    this.loadInputData();

  }

}
