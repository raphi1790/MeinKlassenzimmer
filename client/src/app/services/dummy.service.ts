import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import { User } from '../models/user';
import { Schulklasse } from '../models/schulklasse';
import { Schueler } from '../models/schueler';
import * as uuidv4 from 'uuid/v4';




@Injectable()
export class DummyService {

    schulklasse:Schulklasse
    


  constructor() { 

  }


   getSchulklassen(): Schulklasse {
    this.schulklasse =  new Schulklasse()
    this.schulklasse.id = '1'
    this.schulklasse.personId = 'raphisId'
    this.schulklasse.name = 'Test Dummy Service'
    this.schulklasse.schueler = new Array<Schueler>(5)
    for (let index = 0; index < 5; index++) {
        this.schulklasse.schueler[index] =  new Schueler({
                                                        id: uuidv4(),
                                                        schulklassenId:'1',
                                                        name:'test',
                                                        vorname:'schueler' + index
        
            })


        }
    return this.schulklasse;
    }       


}