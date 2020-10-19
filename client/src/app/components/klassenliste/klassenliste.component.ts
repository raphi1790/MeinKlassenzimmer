import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
export class KlassenlisteComponent implements OnInit {

  constructor() { 
    this.group1 = new Gruppe()
    this.group1.schueler = new Array<Schueler>()

  }
  @Input('selectedKlassenliste')  selectedKlassenliste : Klassenliste;
  @Input('relevantSchulklasse')  relevantSchulklasse : Schulklasse;

  displayedColumns = ['vorname', 'name'];
  group1: Gruppe

  // displayedColumns = ['vorname', 'name'];
  // dataSource = new MatTableDataSource<Schueler>();
  // @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



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
  }


  ngOnInit(): void {

    
  }


}
