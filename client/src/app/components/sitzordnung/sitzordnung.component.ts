import { Component, OnInit, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';

import { Schulklasse } from '../../models/schulklasse';
import { Schulzimmer } from '../../models/schulzimmer';
import { SeatingPreparer } from '../../helpers/seating.preparer';
import html2canvas from 'html2canvas';
import jsPdf from 'jspdf';
import * as CONFIG from '../../../config.json';
import { Regel } from '../../models/regel';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { CalculatingEngine } from '../../helpers/calculating.engine';
import { RegelFilter } from '../../helpers/regel.filter';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { DummyService } from 'src/app/services/dummy.service';
import { Input } from '@angular/core';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { RegelDialogComponent } from '../regel-dialog/regel-dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Schueler } from 'src/app/models/schueler';
import { Seating } from 'src/app/models/seating';
import { Tisch } from 'src/app/models/tisch';
import { v4 as uuidv4 } from 'uuid';

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
  infoDialogRef: MatDialogRef<InfoDialogComponent>;
  myUser: User;
  regelFilter: RegelFilter;

  remainingSchueler: Schueler[]
  workingSeatings: Seating[];
  

  constructor(public dialog: MatDialog) { 
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);


  }
  @Input('selectedSitzordnung') selectedSitzordnung: Sitzordnung;
  @Input('relevantSchulklasse') relevantSchulklasse: Schulklasse;
  @Input('relevantSchulzimmer') relevantSchulzimmer: Schulzimmer;
  @Input('relevantRegeln') relevantRegeln: Regel[];
  @Output() noteSitzordnungManagement: EventEmitter<Sitzordnung> = new EventEmitter<Sitzordnung>();
  
  dataSource = new MatTableDataSource<Regel>()
  selection = new SelectionModel<Regel>(true, [])

  drop(event: CdkDragDrop<string[]>) {
    debugger
    if(event.container.id === 'activeCdkList' && event.previousContainer.id === 'defaultCdkList' ){
      event.container.data['schueler'] = event.previousContainer.data[event.previousIndex]
    }
    if(event.container.id === 'defaultCdkList' && event.previousContainer.id === 'activeCdkList' ){
      event.previousContainer.data['schueler'] = null
    
    }
    if(event.container.id === 'activeCdkList' && event.previousContainer.id === 'activeCdkList' ){
       event.container.data['schueler'] = event.previousContainer.data['schueler']
       event.previousContainer.data['schueler'] = null
    
    }
    this.selectedSitzordnung.seatings = this.updateSeatingsToSitzordnung(this.workingSeatings)
    this.noteSitzordnungManagement.emit(this.selectedSitzordnung);
    this.remainingSchueler = this.updateRemainingSchueler(this.relevantSchulklasse.schueler, this.selectedSitzordnung)

    
  }
  tischIsActive(row: number, column: number):boolean {
    let currentTisch = this.relevantSchulzimmer.tische.filter(tisch => tisch.position.row == row && tisch.position.column ==column)[0]
    if(currentTisch !== undefined && currentTisch.active){
      return true
    }
    return false
  }
  tischIsSelected(row: number, column: number):boolean {
    let currentTisch = this.relevantSchulzimmer.tische.filter(tisch => tisch.position.row == row && tisch.position.column ==column)[0]
    if(currentTisch !== undefined && !currentTisch.active){
      return true
    }
    return false
  }

  getDropListData(row: number, column: number):any{
    // debugger;
    let currentSeating = this.workingSeatings.filter(seating => seating.tisch.position.row == row && seating.tisch.position.column ==column)[0]
    return currentSeating
  }
  getShortName(name: string):string{
    if(name.length > 4){
      return name.substring(0,4) + "."
    }
    return name
  }
  openRegelDialog(): void {
    debugger;
    if (!this.tooManyStudents()){
      // console.log("this.relevantRegeln", this.relevantRegeln)
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
          let seletedRegelIds = result.selected.map(output => output.id)
          console.log("seletedRegelIds:", seletedRegelIds)
          let activeRegeln = this.relevantRegeln
            .filter(regel => seletedRegelIds.includes(regel.id))
          console.log("active Regeln:",activeRegeln)
          this.randomizeSeating(activeRegeln)
          dialogSubmitSubscription.unsubscribe();
        })

    }else{
      this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
        width: '550px',
        data: {text: "Es gibt nicht genug aktive Tische für die Anzahl Schüler!"}
      });
    }
    


  }
  private updateRemainingSchueler(schuelerTotal: Schueler[], sitzordnung: Sitzordnung): Schueler[] {
    debugger;
    if (schuelerTotal === null || schuelerTotal === undefined){
      return null
    }
    if(sitzordnung.seatings === null || sitzordnung.seatings === undefined){
      return schuelerTotal
    }
    var fixedSchueler = new Array<Schueler>()
    for (let index = 0; index < sitzordnung.seatings.length; index++) {
      fixedSchueler.push(sitzordnung.seatings[index].schueler)

    }
    let remainingSchueler = schuelerTotal.filter(({ id: id1 }) => !fixedSchueler.some(({ id: id2 }) => id2 === id1));
    return remainingSchueler

  }
  private updateSeatingsToSitzordnung(inputSeatings: Seating[]):Seating[]{
    debugger;
    let filteredSeatings = inputSeatings.filter(seating => seating.schueler !== null && seating.schueler !== undefined)
    console.log("filteredSeatings", filteredSeatings)
    return filteredSeatings

  }

  private tooManyStudents():boolean{
    // Check if the number of active tables matches the number of incoming students
    let tooManyStudents = false;
    if(this.relevantSchulklasse.schueler === undefined ||this.relevantSchulklasse.schueler === null){
      return tooManyStudents
    }
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
    
    if (typeof resultOutput === 'undefined' || resultOutput.length === 0) {
      this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
        width: '550px',
        data: {text: "Es konnte keine zufällige Sitzordnung erstellt werden."}
      }); }
    else {
      
      
      this.selectedSitzordnung.seatings = this.updateSeatingsToSitzordnung(resultOutput)
      this.noteSitzordnungManagement.emit(this.selectedSitzordnung);
      // Update view
      this.workingSeatings = this.getWorkingSeatings(this.selectedSitzordnung, this.relevantSchulzimmer)
      this.remainingSchueler = this.updateRemainingSchueler(this.relevantSchulklasse.schueler,this.selectedSitzordnung)
      
    }



  }


  generatePdf(){
    debugger;
    var fileName = "Sitzordnung_" + this.selectedSitzordnung.name + ".pdf";
    var data = document.getElementById("contentToPdf");
    var divWidth = data.offsetWidth;
    var divHeight = data.offsetHeight;
    html2canvas(data).then(function (canvas) {
      debugger;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPdf('l'); 
      var width = pdf.internal.pageSize.getWidth();    
      var height = pdf.internal.pageSize.getHeight();
      var ratio = height/ divHeight;
      var heightNew = height;
      var widthNew = divWidth * ratio
      pdf.addImage(imgData, 'PNG', 0, 0, widthNew, heightNew);
      pdf.save(fileName);
    });
        
  }

  getWorkingSeatings(sitzordnung: Sitzordnung, schulzimmer: Schulzimmer):Seating[]{
    debugger;
    let sitzordnungCopy = JSON.parse(JSON.stringify(sitzordnung)); //deep copy of sitzordnung; otherwise it overwrites the original element
    var fixedTische= new Array<Tisch>()
    if(sitzordnungCopy.seatings !== null ){
      sitzordnungCopy.seatings.forEach(seating => fixedTische.push(seating.tisch))
    }
   
    let activeTische = schulzimmer.tische.filter(tisch => tisch.active)
    let remainingTische = activeTische.filter(({ id: id1 }) => !fixedTische.some(({ id: id2 }) => id2 === id1));


    if(typeof sitzordnungCopy.seatings === 'undefined' || sitzordnungCopy.seatings === null){
      let seatings = new Array<Seating>()
      remainingTische.forEach(element => {
        let seatingTmp = new Seating({"id": uuidv4(), "schueler": null, "tisch": element})
        seatings.push(seatingTmp)
        
      });
      return seatings
    }
    else{
      let seatings = sitzordnungCopy.seatings
      remainingTische.forEach(element => {
        let seatingTmp = new Seating({"id": uuidv4(), "schueler": null, "tisch": element})
        seatings.push(seatingTmp)
        
      });
      return seatings
    }
    
  }



  ngOnChanges(){
    debugger;
    this.remainingSchueler = this.updateRemainingSchueler(this.relevantSchulklasse.schueler, this.selectedSitzordnung)
    this.workingSeatings = this.getWorkingSeatings(this.selectedSitzordnung, this.relevantSchulzimmer)
   
  }
 


}
