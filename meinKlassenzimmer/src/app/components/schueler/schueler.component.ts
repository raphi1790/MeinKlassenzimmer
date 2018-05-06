import { Component, OnInit, ViewEncapsulation, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import {Schulklasse} from 'app/models/schulklasse';
import {Schueler} from 'app/models/schueler';
import {SchulklassenService} from 'app/services/schulklassen.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';




@Component({
  selector: 'app-schueler',
  templateUrl: './schueler.component.html',
  styleUrls: ['./schueler.component.css']
})
export class SchuelerComponent implements OnChanges{


  constructor() {
    this.schulklasse.schueler = new Array();
    this.maximalSchuelerId = 0
  }
  @Input('selectedSchulklasse')  selectedSchulklasse: Schulklasse; 
  @Output() noteSchulklasse: EventEmitter<Schulklasse> = new EventEmitter<Schulklasse>();
  maximalSchuelerId: number;
  schulklasse = new Schulklasse();


  private deleteSchueler(deletedSchueler: Schueler):void{
    debugger;
    this.schulklasse.schueler = this.schulklasse.schueler.filter(
      item => item.id != deletedSchueler.id
    );
    console.log("Klasse nach Update (Delete):");
    console.log(this.schulklasse);
    this.noteSchulklasse.emit(this.schulklasse);
  };

  private addSchueler(vorname: string, name:string):void {
    debugger;
    var schuelerTmp = new Schueler();
    schuelerTmp.id = this.maximalSchuelerId;
    schuelerTmp.vorname = vorname;
    schuelerTmp.name = name;
    this.schulklasse.schueler.push( schuelerTmp);
    this.maximalSchuelerId++;

    console.log("Klasse nach Update (Adding):");
    console.log(this.schulklasse);
    this.noteSchulklasse.emit(this.schulklasse);

  }


  ngOnChanges(){
    debugger;
    this.schulklasse = this.selectedSchulklasse;
    console.log("Schulklasse beim Laden");
    console.log(this.schulklasse);
    
  }
    

}
