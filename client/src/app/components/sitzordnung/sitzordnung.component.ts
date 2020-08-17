import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';

import { Schulklasse } from '../../models/schulklasse';
import { TischSchueler } from '../../models/tisch.schueler';
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
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sitzordnung',
  templateUrl: './sitzordnung.component.html',
  styleUrls: ['./sitzordnung.component.css']
})
export class SitzordnungComponent {

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


  

  constructor(private userService: UserService, public dialog: MatDialog) { 
    this.showSitzordnung = false;
    this.zuvieleSchuelerInSchulzimmer = false;
    this.rowSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfRows),(val,index)=>index);
    this.columnSchulzimmer = Array.from(new Array((<any>CONFIG).numberOfColumns),(val,index)=>index);
  }
  @ViewChild(MatTable) table: MatTable<any>;


  dataSource = new MatTableDataSource<Regel>();


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getErrorMessageZuvieleSchuelerInSchulzimmer(){
     return "Es gibt nicht genug aktive Tische für die Anzahl Schüler!"
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
      this.zimmerToPerson = this.myUser.schulzimmer
      this.regelnToPerson = this.myUser.regeln
      // console.log(this.myUser)
      this.isLoadingData = false;
    
    });

  
  }

  klasseAndZimmerSelected(): boolean{
    
    var klasseAndZimmerSelected = false; 
    if (this.selectedSchulklasse != undefined && this.selectedSchulzimmer !=undefined){
      klasseAndZimmerSelected = true;
      let relevantRegeln = this.filterRegel(this.selectedSchulklasse, this.selectedSchulzimmer);
      this.dataSource.data = relevantRegeln;  
       
    }
    return klasseAndZimmerSelected;
  }

  filterRegel(selectedSchulklasse: Schulklasse, selectedSchulzimmer: Schulzimmer): Regel[]{
    let relevantRegeln = new Array<Regel>();
    let inputRegeln = this.regelnToPerson;

    for (let index = 0; index < inputRegeln.length; index++) {
      let chosenSchueler = this.klassenToPerson.filter(klasse => 
        klasse.schueler.some(x => x.id== inputRegeln[index].schueler1Id)).map(element => {
            let newElt = Object.assign({}, element);
            return newElt.schueler.filter(x => x.id== inputRegeln[index].schueler1Id)
        });
        let chosenTisch = this.zimmerToPerson.filter(klasse => 
          klasse.tische.some(x => x.id== inputRegeln[index].tischId)).map(element => {
              let newElt = Object.assign({}, element);
              return newElt.tische.filter(x => x.id== inputRegeln[index].tischId) ;
          }); 
          switch (inputRegeln[index].type) {
            case "Fester Sitzplatz":
                if( chosenSchueler[0][0].schulklassenId == selectedSchulklasse.id 
                      && chosenTisch[0][0].schulzimmerId == selectedSchulzimmer.id){
                        relevantRegeln.push(inputRegeln[index]);
                      }
                  
              break;
            case "Unmögliche Paarung":
              if( chosenSchueler[0][0].schulklassenId == selectedSchulklasse.id){
                  relevantRegeln.push(inputRegeln[index]);
                }
              break;  
          
            default:
              console.log("Kein gültiger Regel-Typ")
              break;
          }   
      
      
    }
   
     
    return relevantRegeln

  }
 

  randomizePlaces(){
    debugger;
    var activeTische = this.selectedSchulzimmer.tische.filter(item => item.active == true);
    if(activeTische.length < this.selectedSchulklasse.schueler.length){
      this.zuvieleSchuelerInSchulzimmer = true;
      this.showSitzordnung = false;

    }
    else{
      this.zuvieleSchuelerInSchulzimmer = false;
      this.tischSchuelerPreparer = new TischSchuelerPreparer();
      this.outputSchulzimmer = this.selectedSchulzimmer;
      this.outputSchulklasse = this.selectedSchulklasse;
      let outputRegelnActive  = this.regelnToPerson
      .filter(item => this.selection.selected
            .map(output => output.id).includes(item.id))  
      debugger;
      let calculatingEngine = new CalculatingEngine(); 
      // console.log(this.tischSchuelerPreparer);
      // console.log(this.outputSchulklasse.schueler);
      // console.log(outputRegelnActive);
      // console.log(this.outputSchulzimmer.tische);
      let resultOutput = calculatingEngine.calculate(this.tischSchuelerPreparer,this.outputSchulklasse.schueler,outputRegelnActive, this.outputSchulzimmer.tische)       
      if (typeof resultOutput === 'undefined'){
        this.showSitzordnung = false;
        this.einteilungInfoDialogRef = this.dialog.open(EinteilungInfoDialogComponent, {
          height: '250px',
          width: '400px',
        });

      }
      else{
        this.showSitzordnung = true;
        this.preparedTischSchueler = resultOutput;
        // console.log("Randomized SchuelerTischArray");
        // console.log(this.preparedTischSchueler);
      }
      

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

  ngOnInit() {
    this.isLoadingData = true;
    this.loadInputData();

  }

}
