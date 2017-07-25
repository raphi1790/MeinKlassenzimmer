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
 


  constructor(private KlassenService : KlassenService) { }


    getSchuelerToKlasse(id: number):void{
      console.log(id);
        this.schuelerToKlasse = this.schuelerToPerson.filter(item => item.klassenid === id )
      
  }
 add(vorname: string, name:string): void {
    vorname = vorname.trim();
    name = name.trim();
    if (!name || !vorname) { console.log("error name");return; }
    console.log("error name")

    this.KlassenService.createSchueler(vorname, name)
      .then(schueler => 
        this.schuelerToKlasse.push(schueler)
      );
  }

  ngOnChanges() {
    console.log(this.klassenid);
    this.getSchuelerToKlasse(this.klassenid);

  }


}
