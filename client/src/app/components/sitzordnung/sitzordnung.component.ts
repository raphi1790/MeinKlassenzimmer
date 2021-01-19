import { Component, OnInit, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';

import { Schulklasse } from '../../models/schulklasse';
import { TischSchueler } from '../../models/tisch.schueler';
import { SeatingOutput } from '../../models/output.seating';
import { Schulzimmer } from '../../models/schulzimmer';
import { SeatingPreparer } from '../../helpers/seating.preparer';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as CONFIG from '../../../config.json';
import { Regel } from '../../models/regel';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { EinteilungInfoDialogComponent } from '../einteilung-info-dialog/einteilung-info-dialog.component';
import { CalculatingEngine } from '../../helpers/calculating.engine';
import { RegelFilter } from '../../helpers/regel.filter';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { DummyService } from 'src/app/services/dummy.service';
import { Input } from '@angular/core';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { SitzordnungManagementComponent } from '../sitzordnung-management/sitzordnung.management.component';
import { SitzordnungRenderer as SeatingRenderer } from '../../helpers/seating.renderer';
import { RegelDialogComponent } from '../regel-dialog/regel-dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-sitzordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})

export class SitzordnungComponent implements OnChanges{

 
  regelnToPerson: Regel[];
  rowSchulzimmer: number[];
  columnSchulzimmer: number[];
  isLoadingData: boolean;
  displayedColumns = ['select','type' ,'beschreibung'   ];
  einteilungInfoDialogRef: MatDialogRef<EinteilungInfoDialogComponent>;
  infoDialogRef: MatDialogRef<InfoDialogComponent>;
  myUser: User;
  regelFilter: RegelFilter;

  preparedSeatingOutput: SeatingOutput[][]
  seatingRenderer: SeatingRenderer;
  

  constructor(public dialog: MatDialog) { 
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);
    this.seatingRenderer = new SeatingRenderer();

  }
  @Input('selectedSitzordnung') selectedSitzordnung: Sitzordnung;
  @Input('relevantSchulklasse') relevantSchulklasse: Schulklasse;
  @Input('relevantSchulzimmer') relevantSchulzimmer: Schulzimmer;
  @Input('relevantRegeln') relevantRegeln: Regel[];
  @Output() noteSitzordnungManagement: EventEmitter<Sitzordnung> = new EventEmitter<Sitzordnung>();
  
  dataSource = new MatTableDataSource<Regel>()
  selection = new SelectionModel<Regel>(true, [])

 

  openRegelDialog(): void {
    debugger;
    if (!this.tooManyStudents()){
      console.log("this.relevantRegeln", this.relevantRegeln)
      this.dataSource.data = this.relevantRegeln;
      const dialogRef = this.dialog.open(RegelDialogComponent, {
        width: '550px',
        data: { input: this.dataSource, output: this.selection }
      });


      dialogRef.afterClosed().subscribe(result => {
      });
      debugger;
      const dialogSubmitSubscription =
        dialogRef.componentInstance.submitClicked.subscribe(result => {
          console.log("The dialog was closed.")
          this.selection = result
          let activeRegeln = this.relevantRegeln
            .filter(item => this.selection.selected
              .map(output => output.id).includes(item.id))
          // let regelTmp = new Regel()
          this.randomizeSeating(activeRegeln)
          console.log("active Regeln", activeRegeln)

          dialogSubmitSubscription.unsubscribe();
        })

    }else{
      this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
        width: '550px',
        data: {text: "Es gibt nicht genug aktive Tische für die Anzahl Schüler!"}
      });
    }
    


  }
  private tooManyStudents():boolean{
    // Check if the number of active tables matches the number of incoming students
    let tooManyStudents = false;
    let numSchueler = this.relevantSchulklasse.schueler.length
    let numActiveTische = this.relevantSchulzimmer.tische.filter(tisch => tisch.active).length
    if( numActiveTische < numSchueler){
      tooManyStudents = true
    }
    return tooManyStudents
  }

  randomizeSeating(activeRegeln: Regel[]): void {
    debugger

    let seatingPreparer = new SeatingPreparer();
    let calculatingEngine = new CalculatingEngine();
    debugger;
    let activeTische = this.relevantSchulzimmer.tische.filter(tisch => tisch.active)
    let resultOutput = calculatingEngine.calculate(seatingPreparer, this.relevantSchulklasse.schueler, activeRegeln, activeTische, null)
    console.log("resultOutput", resultOutput)
    
    if (typeof resultOutput === 'undefined') {
      this.einteilungInfoDialogRef = this.dialog.open(EinteilungInfoDialogComponent, {
        width: '550px',
      }) }
    else {
      this.preparedSeatingOutput = this.seatingRenderer.renderSeatingOutput(resultOutput, this.relevantSchulzimmer) 
      this.selectedSitzordnung.seatings = resultOutput // Update sitzordnung with randomized seatings
      this.noteSitzordnungManagement.emit(this.selectedSitzordnung);
    }


  }


  generatePdf(){
    var data = document.getElementById("contentToPdf");
    html2canvas(data).then(function(canvas) {
      var img = canvas.toDataURL("image/png");
        var doc = new jsPDF('l');
        doc.addImage(img,'JPEG',0,0,220,210);
        doc.save('Sitzordnung.pdf');
      });
        
  }




  ngOnChanges(){
    debugger;
    this.preparedSeatingOutput = this.seatingRenderer.renderSeatingOutput(this.selectedSitzordnung.seatings, this.relevantSchulzimmer)
  }
  // ngOnInit() {
  //   this.isLoadingData = true;
  //   this.loadInputData();

  // }

}
