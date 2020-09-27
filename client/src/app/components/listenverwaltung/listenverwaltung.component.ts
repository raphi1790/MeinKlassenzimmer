import { Component, OnInit, ViewChild } from '@angular/core';
import { DummyService } from '../../services/dummy.service';
import { Schulklasse } from '../../models/schulklasse';
import { Schueler } from '../../models/schueler';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Randomizer } from '../../helpers/randomizer';
import { User } from '../../models/user';
import { Klassenliste } from '../../models/klassenliste';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';

@Component({
  selector: 'app-listenverwaltung',
  templateUrl: './listenverwaltung.component.html',
  styleUrls: ['./listenverwaltung.component.css']
})
export class ListenverwaltungComponent implements OnInit {
  

  constructor(private dummyService:DummyService) {
   }
  
  myUser:User
  klassenToPerson: Schulklasse[];
  klassenlistenToPerson: Klassenliste[]
  isLoadingData: boolean;
  selectedSchulklasse: Schulklasse;
  selectedListNameInput: string;
  selectedGroupNumberInput: number;
  selectedSchueler: Schueler[];
  selectedKlassenliste: Klassenliste;
  savingIsActiv: boolean;
  displayedColumns = ['vorname', 'name'];
  dataSource = new MatTableDataSource<Schueler>();
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

     
  loadInputData() {
    this.klassenToPerson = this.dummyService.getSchulklassen()
    this.klassenlistenToPerson = new Array<Klassenliste>()
    this.isLoadingData = false
    
  
  }

  selectOneSchueler(){
    
    this.selectSchueler(1)

  }
  selectTwoSchueler(){
    this.selectSchueler(2)

  }
  selectFiveSchueler(){
    this.selectSchueler(5)

  }

  addKlassenliste(): void {
    debugger;
    var KlasselisteTmp = new Klassenliste();
    KlasselisteTmp.name = this.selectedListNameInput;
    KlasselisteTmp.id = uuidv4();
    this.klassenlistenToPerson.push(KlasselisteTmp);
    KlasselisteTmp = null;
    this.selectedSchulklasse = null;
    this.savingIsActiv = true;
    this.selectedListNameInput = null;

    // this.neueSchulklasseForm.markAsPristine();
    // this.neueSchulklasseForm.markAsUntouched();
    // this.neueSchulklasseForm.updateValueAndValidity();

  }

  private selectSchueler(numberSelectedSchueler: number){
      let randomizer = new Randomizer()
      let randomizedSchueler = randomizer.shuffle(this.selectedSchulklasse.schueler)
      this.selectedSchueler = randomizedSchueler.slice(0, numberSelectedSchueler)

      this.dataSource.data = this.selectedSchueler;



  }


  ngOnInit(): void {
    this.isLoadingData = true;
    this.loadInputData();

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
