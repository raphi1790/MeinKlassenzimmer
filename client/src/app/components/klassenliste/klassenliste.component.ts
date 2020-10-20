import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Klassenliste } from 'src/app/models/klassenliste';
import { Schueler } from 'src/app/models/schueler';
import { Schulklasse } from 'src/app/models/schulklasse';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Gruppe } from 'src/app/models/gruppe';
import { GroupEnricher } from 'src/app/helpers/group.enricher';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-klassenliste',
  templateUrl: './klassenliste.component.html',
  styleUrls: ['./klassenliste.component.css']
})
export class KlassenlisteComponent implements OnChanges {

  constructor() { 
    this.defaultGroup = new Gruppe
    this.defaultGroup.schueler = new Array<Schueler>()
    


  }
  @Input('selectedKlassenliste')  selectedKlassenliste : Klassenliste;
  @Input('relevantSchulklasse')  relevantSchulklasse : Schulklasse;
  @Output() noteListenverwaltung: EventEmitter<Klassenliste> = new EventEmitter<Klassenliste>();

  defaultGroup : Gruppe


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
    console.log(this.selectedKlassenliste)
    this.noteListenverwaltung.emit(this.selectedKlassenliste);
  }

  private updateRemainingSchueler(schuelerTotal:Schueler[], klassenliste:Klassenliste): Schueler[]{
    debugger;
    var fixedSchueler = new Array<Schueler>()
    for (let index = 0; index < klassenliste.gruppen.length; index++) {
      fixedSchueler.push(...klassenliste.gruppen[index].schueler)
      
    }
    let remainingSchueler = schuelerTotal.filter(({ id: id1 }) => !fixedSchueler.some(({ id: id2 }) => id2 === id1));
    return remainingSchueler

  }


  ngOnChanges(): void {
    debugger;
    this.defaultGroup.schueler = this.updateRemainingSchueler(this.relevantSchulklasse.schueler, this.selectedKlassenliste)

    
    
  }


}
