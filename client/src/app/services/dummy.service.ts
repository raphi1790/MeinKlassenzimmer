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

    schulklasse1:Schulklasse
    schulklasse2:Schulklasse
    schulklassen: Schulklasse[]
    


  constructor() { 

  }


   getSchulklassen(): Schulklasse[] {
    this.schulklasse1 =  new Schulklasse()
    this.schulklasse1.id = '1'
    this.schulklasse1.personId = 'raphisId'
    this.schulklasse1.name = 'Test Dummy Service Klasse 1'
    this.schulklasse1.schueler = new Array<Schueler>(25)
    for (let index = 0; index < this.schulklasse1.schueler.length; index++) {
        this.schulklasse1.schueler[index] =  new Schueler({
                                                        id: uuidv4(),
                                                        schulklassenId:'1',
                                                        name:'test',
                                                        vorname:'schueler' + index
        
            })


        }
    this.schulklasse2 =  new Schulklasse()
    this.schulklasse2.id = '1'
    this.schulklasse2.personId = 'raphisId'
    this.schulklasse2.name = 'Test Dummy Service Klasse 2'
    this.schulklasse2.schueler = new Array<Schueler>(7)
    for (let index = 0; index < 5; index++) {
        this.schulklasse2.schueler[index] =  new Schueler({
                                                        id: uuidv4(),
                                                        schulklassenId:'2',
                                                        name:'test',
                                                        vorname:'schueler' + index
        
            })


        }
    debugger;
    this.schulklassen = new Array<Schulklasse>(2)
    this.schulklassen[0] = this.schulklasse1
    this.schulklassen[1] = this.schulklasse2
    return this.schulklassen;
    }       


}