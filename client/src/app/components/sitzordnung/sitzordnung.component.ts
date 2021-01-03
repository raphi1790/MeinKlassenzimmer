import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';

import { Schulklasse } from '../../models/schulklasse';
import { TischSchueler } from '../../models/tisch.schueler';
import { SeatingOutput } from '../../models/output.seating';
import { Schulzimmer } from '../../models/schulzimmer';
import { TischSchuelerPreparer } from '../../helpers/tischSchueler.preparer';
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
import { SitzordnungDisplayer } from '../../helpers/sitzordnung.displayer';

@Component({
  selector: 'app-sitzordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})

export class SitzordnungComponent implements OnChanges, OnInit{

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
  isLoadingData: boolean;
  displayedColumns = ['select','type' ,'beschreibung'   ];
  selection = new SelectionModel<Regel>(true, []);
  einteilungInfoDialogRef: MatDialogRef<EinteilungInfoDialogComponent>;
  myUser: User;
  regelFilter: RegelFilter;

  preparedSeatingOutput: SeatingOutput[][]
  

  constructor() { 
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);

  }
  @Input('selectedSitzordnung') selectedSitzordnung: Sitzordnung;
  @Input('relevantSchulklasse') relevantSchulklasse: Schulklasse;
  @Input('relevantSchulzimmer') relevantSchulzimmer: Schulzimmer;
  // @Input('relevantRegeln') relevantRegeln: Regel[];
  


  // dataSource = new MatTableDataSource<Regel>();


  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }

  // getErrorMessageZuvieleSchuelerInSchulzimmer(){
  //    return "Es gibt nicht genug aktive Tische für die Anzahl Schüler!"
  // }

  // // loadInputData() {
  // //   this.userService.getUser().snapshotChanges().pipe(
  // //     map(changes =>
  // //       changes.map(c =>
  // //         ({ uid: c.payload.doc['id'], ...c.payload.doc.data() })
  // //       )
  // //     )
  // //   ).subscribe(users => {
  // //     debugger;
  // //     this.myUser = new User(users[0])
  // //     this.klassenToPerson = this.myUser.schulklassen
  // //     this.zimmerToPerson = this.myUser.schulzimmer
  // //     this.regelnToPerson = this.myUser.regeln
  // //     // console.log(this.myUser)
  // //     this.isLoadingData = false;
    
  // //   });

  
  // // }
  // loadInputData() {
  //   debugger;
  //   this.myUser = this.dummyService.getUser()
  //   this.klassenToPerson = this.myUser.schulklassen
  //   this.zimmerToPerson = this.myUser.schulzimmer
  //   this.regelnToPerson = this.myUser.regeln
  //   console.log(this.myUser)
  //   this.isLoadingData = false;
    


  
  // }

  // klasseAndZimmerSelected(): boolean{
    
  //   var klasseAndZimmerSelected = false; 
  //   if (this.selectedSchulklasse != undefined && this.selectedSchulzimmer !=undefined){
  //     klasseAndZimmerSelected = true;
  //     let relevantRegeln = this.regelFilter.filterRegelBySchulklasseAndSchulzimmer(this.regelnToPerson, this.klassenToPerson, this.zimmerToPerson,
  //        this.selectedSchulklasse, this.selectedSchulzimmer);
  //     this.dataSource.data = relevantRegeln;  
       
  //   }
  //   return klasseAndZimmerSelected;
  // }
 

  // randomizePlaces(){
  //   debugger;
  //   var activeTische = this.selectedSchulzimmer.tische.filter(item => item.active == true);
  //   if(activeTische.length < this.selectedSchulklasse.schueler.length){
  //     this.zuvieleSchuelerInSchulzimmer = true;
  //     this.showSitzordnung = false;

  //   }
  //   else{
  //     this.zuvieleSchuelerInSchulzimmer = false;
  //     this.tischSchuelerPreparer = new TischSchuelerPreparer();
  //     this.outputSchulzimmer = this.selectedSchulzimmer;
  //     this.outputSchulklasse = this.selectedSchulklasse;
  //     let outputRegelnActive  = this.regelnToPerson
  //     .filter(item => this.selection.selected
  //           .map(output => output.id).includes(item.id))  
  //     debugger;
  //     let calculatingEngine = new CalculatingEngine(); 
  //     // console.log(this.tischSchuelerPreparer);
  //     // console.log(this.outputSchulklasse.schueler);
  //     // console.log(outputRegelnActive);
  //     // console.log(this.outputSchulzimmer.tische);
  //     let resultOutput = calculatingEngine.calculate(this.tischSchuelerPreparer,this.outputSchulklasse.schueler,outputRegelnActive, this.outputSchulzimmer.tische)       
  //     if (typeof resultOutput === 'undefined'){
  //       this.showSitzordnung = false;
  //       this.einteilungInfoDialogRef = this.dialog.open(EinteilungInfoDialogComponent, {
  //         width: '550px',
  //       });

  //     }
  //     else{
  //       this.showSitzordnung = true;
  //       this.preparedTischSchueler = resultOutput;
  //       // console.log("Randomized SchuelerTischArray");
  //       // console.log(this.preparedTischSchueler);
  //     }
      

  //   }
  
    

  // }

  openRegelDialog(): void {
    // debugger;
    // this.dataSource.data = this.relevantRegeln;
    // const dialogRef = this.dialog.open(RegelDialogComponent, {
    //   width: '550px',
    //   data: { input: this.dataSource, output: this.selection }
    // });


    // dialogRef.afterClosed().subscribe(result => {
    // });
    // debugger;
    // const dialogSubmitSubscription =
    //   dialogRef.componentInstance.submitClicked.subscribe(result => {
    //     console.log("The dialog was closed.")
    //     this.selection = result
    //     let activeRegeln = this.relevantRegeln
    //       .filter(item => this.selection.selected
    //         .map(output => output.id).includes(item.id))
    //     this.randomize(activeRegeln)

    //     dialogSubmitSubscription.unsubscribe();
    //   })

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

  private createSeatingOutput(inputSitzordnung: Sitzordnung, inputSchulzimmer: Schulzimmer):SeatingOutput[][]{
    let sitzordnungDisplayer = new SitzordnungDisplayer()
    return sitzordnungDisplayer.prepareSeatingOutput(inputSitzordnung, inputSchulzimmer );
  }

  ngOnChanges(){

  }
  ngOnInit(){
    this.preparedSeatingOutput = this.createSeatingOutput(this.selectedSitzordnung, this.selectedSchulzimmer)
  }
  // ngOnInit() {
  //   this.isLoadingData = true;
  //   this.loadInputData();

  // }

}
