import { Component, OnInit ,Input, OnChanges} from '@angular/core';

import {Klasse} from 'app/models/klasse';
import {Schueler} from 'app/models/schueler';
import {KlassenService} from 'app/services/klassen.service'



@Component({
  selector: 'app-schueler',
  templateUrl: './schueler.component.html',
  styleUrls: ['./schueler.component.css']
})
export class SchuelerComponent implements OnChanges {

  @Input('klassenId') klassenid: number
  @Input('schuelerToPerson')  schuelerToPerson: Schueler[];

    schuelerToKlasse: Schueler[];
    neuerSchueler: Schueler;
    neueSchuelerTmp:  Schueler[] = new Array();
    deletedSchuelerTmp: Schueler[] = new Array();
    savingIsActive: boolean;
 


  constructor(private klassenService : KlassenService) { }


    getSchuelerToKlassenid(id: number):void{
      console.log(id);
      debugger;
        this.schuelerToKlasse = this.schuelerToPerson.filter(
            item => 
              item.klassenid === id )
      
  }

   addSchuelerTmp(vorname: string, name:string):void {
    vorname = vorname.trim();
    name = name.trim();
    var neuerSchuelerTmp = new Schueler(this.klassenid,vorname,name);
    this.neueSchuelerTmp.push(neuerSchuelerTmp);
    this.schuelerToKlasse.push(neuerSchuelerTmp);
    neuerSchuelerTmp = null;
  }
  deleteSchuelerTmp(schueler:Schueler):void{
    this.deletedSchuelerTmp.push(schueler);
    this.schuelerToKlasse = this.schuelerToKlasse.filter(k => k!== schueler);
  }

  saveSchueler(): void {
    debugger;
    if (this.neueSchuelerTmp.length > 0) {
      for (let schueler of this.neueSchuelerTmp){
        debugger;
         this.klassenService.createSchuelerToKlassenid(schueler);
       };
       this.neueSchuelerTmp = null;
    } 
    if (this.deletedSchuelerTmp.length > 0){
      for (let schueler of this.deletedSchuelerTmp){
         this.klassenService.deleteSchuelerToKlassenid(schueler.id);
       };
       this.deletedSchuelerTmp = null;
    }
    
  }
  
  savingSchuelerIsActiv(): boolean{
    if (this.needSaving()){
      return this.savingIsActive = true;
    }
    else{
      return this.savingIsActive = false;
    }
  }

  private needSaving(): boolean{
    if ((this.neueSchuelerTmp == null || this.neueSchuelerTmp.length == 0 )
      && (this.deletedSchuelerTmp == null || this.deletedSchuelerTmp.length == 0))
      {
        return false;
      }
     else{
       return true;
     } 
      
  }
  


  ngOnChanges() {
    console.log(this.klassenid);
    this.getSchuelerToKlassenid(this.klassenid);
    

  }


}
