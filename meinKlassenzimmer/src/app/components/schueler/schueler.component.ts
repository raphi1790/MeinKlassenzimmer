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

    schuelerToKlasse: Schueler[] = [];
    neuerSchueler: Schueler;
    neueSchuelerTmp:  Schueler[] = [];
    deletedSchuelerTmp: Schueler[] = [];

 


  constructor() { }


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
    var neuerSchuelerTmp = new Schueler()
    neuerSchuelerTmp.setValues(this.klassenid,vorname,name);
    this.neueSchuelerTmp.push(neuerSchuelerTmp);
    this.schuelerToKlasse.push(neuerSchuelerTmp);
    neuerSchuelerTmp = null;
  }
  deleteSchuelerTmp(schueler:Schueler):void{
    this.deletedSchuelerTmp.push(schueler);
    this.schuelerToKlasse = this.schuelerToKlasse.filter(k => k!== schueler);
  }

  ngOnChanges() {
    this.getSchuelerToKlassenid(this.klassenid);
    

  }


}
