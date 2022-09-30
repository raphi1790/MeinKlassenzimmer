import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Klassenliste } from 'src/app/models/klassenliste';
import { Schueler } from 'src/app/models/schueler';
import { Schulklasse } from 'src/app/models/schulklasse';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Gruppe } from 'src/app/models/gruppe';
import { GroupPreparer } from 'src/app/helpers/group.preparer';
import { CalculatingEngine } from 'src/app/helpers/calculating.engine';
import { Randomizer } from 'src/app/helpers/randomizer';
import { RegelDialogComponent } from '../regel-dialog/regel-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Regel } from 'src/app/models/regel';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import jsPDF  from 'jspdf';
import html2canvas from 'html2canvas';
import { Name } from 'src/app/models/name';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-klassenliste',
  templateUrl: './klassenliste.component.html',
  styleUrls: ['./klassenliste.component.css']
})
export class KlassenlisteComponent implements OnChanges {

  constructor(public dialog: MatDialog) {
    this.defaultGroup = new Gruppe
    this.defaultGroup.schueler = new Array<Schueler>()



  }
  @Input('selectedKlassenliste') selectedKlassenliste: Klassenliste;
  @Input('relevantSchulklasse') relevantSchulklasse: Schulklasse;
  @Input('relevantRegeln') relevantRegeln: Regel[];
  @Output() noteListenverwaltung: EventEmitter<Klassenliste> = new EventEmitter<Klassenliste>();


  defaultGroup: Gruppe
  dataSource = new MatTableDataSource<Regel>()
  selection = new SelectionModel<Regel>(true, []);
  infoDialogRef: MatDialogRef<InfoDialogComponent>;



  drop(event: CdkDragDrop<string[]>) {
    debugger;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.noteListenverwaltung.emit(this.selectedKlassenliste);
  }

  private updateRemainingSchueler(schuelerTotal: Schueler[], klassenliste: Klassenliste): Schueler[] {
    debugger;
    var fixedSchueler = new Array<Schueler>()
    for (let index = 0; index < klassenliste.gruppen.length; index++) {
      fixedSchueler.push(...klassenliste.gruppen[index].schueler)

    }
    let remainingSchueler = schuelerTotal.filter(({ id: id1 }) => !fixedSchueler.some(({ id: id2 }) => id2 === id1));
    return remainingSchueler

  }

  openRegelDialog(): void {
    debugger;
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
        this.randomize(activeRegeln)

        dialogSubmitSubscription.unsubscribe();
      })

  }

  onNameChange(newName : Name):void{
    debugger;
    let oldName = this.selectedKlassenliste.gruppen.filter(gruppe => gruppe.id.toString() == newName.id)[0].name;
    if(oldName != newName.text){
      this.selectedKlassenliste.gruppen.filter(gruppe => gruppe.id.toString() == newName.id)[0].name = newName.text;
      this.noteListenverwaltung.emit(this.selectedKlassenliste);
    }
  
  }

  randomize(activeRegeln: Regel[]): void {
    debugger

    let groupPreparer = new GroupPreparer();
    let calculatingEngine = new CalculatingEngine();
    debugger;
    let resultOutput = calculatingEngine.calculate(groupPreparer, this.relevantSchulklasse.schueler, activeRegeln, null, this.selectedKlassenliste.gruppen.length)
    if (typeof resultOutput === 'undefined') {
      this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
        width: '550px',
        data: {text: "Es gibt nicht genug aktive Tische für die Anzahl Schüler!"}
      });

    }
    else {
      // Update only schueler in group
      for (let groupIndex = 0; groupIndex < this.selectedKlassenliste.gruppen.length; groupIndex++) {
        this.selectedKlassenliste.gruppen[groupIndex].schueler = resultOutput[groupIndex].schueler;
      }
      this.defaultGroup.schueler = this.updateRemainingSchueler(this.relevantSchulklasse.schueler, this.selectedKlassenliste)
    }

  }

  generatePdf() {
    debugger;
    var fileName = "Gruppeneinteilung_" + this.selectedKlassenliste.name + ".pdf";
    var data = document.getElementById("contentToPdf");
    var divWidth = data.offsetWidth;
    var divHeight = data.offsetHeight;
    html2canvas(data).then(function (canvas) {
      debugger;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      var width = pdf.internal.pageSize.getWidth();    
      var height = pdf.internal.pageSize.getHeight();
      var ratio = height/ divHeight;
      var heightNew = height;
      var widthNew = divWidth * ratio
      pdf.addImage(imgData, 'PNG', 0, 0, widthNew, heightNew);
      pdf.save(fileName);
    });

  }



  ngOnChanges(): void {
    debugger;
    this.defaultGroup.schueler = this.updateRemainingSchueler(this.relevantSchulklasse.schueler, this.selectedKlassenliste)



  }


}
