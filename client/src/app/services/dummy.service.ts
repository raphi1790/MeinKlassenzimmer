import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { User } from '../models/user';
import { Schulklasse } from '../models/schulklasse';
import { Schueler } from '../models/schueler';
import * as uuidv4 from 'uuid/v4';
import { Schulzimmer } from '../models/schulzimmer';
import { Tisch } from '../models/tisch';
import { PositionTisch } from '../models/position.tisch';
import { Sitzordnung } from '../models/sitzordnung';
import { Seating } from '../models/seating';
import { Regel } from '../models/regel';
import { DataService } from "./data.service";
import { AngularFirestoreCollection } from '@angular/fire/firestore';



@Injectable({ providedIn: 'root' })
export class DummyService implements DataService {

    schulklasse1: Schulklasse
    schulklasse2: Schulklasse
    schulklassen: Schulklasse[]
    schulzimmer1: Schulzimmer
    schulzimmer: Schulzimmer[]
    sitzordnung1: Sitzordnung
    sitzordnungen: Sitzordnung[]
    user: User
    schulklasse3: Schulklasse;
    schulklasse4: any;
    schulzimmer2: Schulzimmer;



    constructor() {

    }
    mapUser(apply):void{
        apply([new User({
            uid: 'abc',
            email: "raphael.schoenenberger@test.ch",
            photoURL: null,
            displayName : 'Dummy User',
            schulklassen : this.getSchulklassen(),
            schulzimmer : this.getSchulzimmer(),
            sitzordnungen: this.getSitzordnungen(),
            regeln: this.getRegeln()
        })])
        debugger;
        
        

    }
    updateUser(user:User):void{
        console.log("saved on dummy-service:", user)
    }
    private getSchueler(): Schueler[]{
        let schueler = new Array<Schueler>(5)
        for (let index = 0; index < schueler.length; index++) {
            schueler[index] = new Schueler({
                id: String(index),
                schulklassenId: '1',
                name: 'tester',
                vorname: 'schueler' + index
            })
        }
        return schueler
    }
    private getSchuelerLong(): Schueler[]{
        let schueler = new Array<Schueler>(27)
        for (let index = 0; index < schueler.length; index++) {
            schueler[index] = new Schueler({
                id: String(index)+'a',
                schulklassenId: '1',
                name: 'tester',
                vorname: 'schueler' + index
            })
        }
        return schueler
    }

    getSchulklassen(): Schulklasse[] {
        this.schulklasse1 = new Schulklasse()
        this.schulklasse1.id = '1'
        this.schulklasse1.personId = 'abc'
        this.schulklasse1.name = 'Test Dummy Service Klasse 1'
        this.schulklasse1.schueler = this.getSchueler()

        
       
        this.schulklasse2 = new Schulklasse()
        this.schulklasse2.id = '2'
        this.schulklasse2.personId = 'abc'
        this.schulklasse2.name = 'Test Dummy Service Klasse 2'
        this.schulklasse2.schueler = new Array<Schueler>(3)
        this.schulklasse2.schueler[0] = new Schueler({
            id: 'a',
            schulklassenId: '2',
            name: 'test',
            vorname: 'schueler' + ' a'

        })
        this.schulklasse2.schueler[1] = new Schueler({
            id: 'b',
            schulklassenId: '2',
            name: 'test',
            vorname: 'schueler' + ' b'

        })
        this.schulklasse2.schueler[2] = new Schueler({
            id: 'c',
            schulklassenId: '2',
            name: 'test',
            vorname: 'schueler' + ' c'

        })
        this.schulklasse3 = new Schulklasse()
        this.schulklasse3.id = '3'
        this.schulklasse3.personId = 'abc'
        this.schulklasse3.name = 'Test Dummy Service Klasse 3'
        this.schulklasse3.schueler = new Array<Schueler>()

        this.schulklasse4 = new Schulklasse()
        this.schulklasse4.id = '4'
        this.schulklasse4.personId = 'abc'
        this.schulklasse4.name = 'Test Dummy Service Klasse 4'
        this.schulklasse4.schueler = this.getSchuelerLong()

    
        return [this.schulklasse1, this.schulklasse2, this.schulklasse3, this.schulklasse4];
    }
    private getTische(): Tisch[]{
        let tische = new Array<Tisch>(5)
        tische[0] = new Tisch({
            id: '1',
            schulzimmerId: '1',
            position: new PositionTisch(2, 4),
            active: true,
            tischNumber: 1
        })
        tische[1] = new Tisch({
            id: '2',
            schulzimmerId: '1',
            position: new PositionTisch(2, 5),
            active: true,
            tischNumber: 2
        })
        tische[2] = new Tisch({
            id: '3',
            schulzimmerId: '1',
            position: new PositionTisch(2, 6),
            active: true,
            tischNumber: 3
        })
        tische[3] = new Tisch({
            id: '4',
            schulzimmerId: '1',
            position: new PositionTisch(2, 7),
            active: true,
            tischNumber: 4
        })
        tische[4] = new Tisch({
            id: '5',
            schulzimmerId: '1',
            position: new PositionTisch(2, 8),
            active: true,
            tischNumber: 5
        })
        tische[5] = new Tisch({
            id: '6',
            schulzimmerId: '1',
            position: new PositionTisch(0, 0),
            active: false,
            tischNumber: 6
        })

        return tische
    }

    getTischeLong(): Tisch[]{
        let tische = new Array<Tisch>(28)
        for (let index = 0; index < tische.length; index++) {
            let column = index%12
            let row = Math.floor(index/10)
             tische[index] = new Tisch({
                id: String(index)+'a',
                schulzimmerId: '2',
                position: new PositionTisch(row,column ),
                active: true,
                tischNumber: index
            })
        }
        return tische
    }
    getSchulzimmer(): Schulzimmer[] {
        debugger;
        this.schulzimmer1 = new Schulzimmer()
        this.schulzimmer1.id = '1'
        this.schulzimmer1.personId = 'abc'
        this.schulzimmer1.name = 'Dummy Schulzimmer'
        this.schulzimmer1.tische= this.getTische()

        this.schulzimmer2 = new Schulzimmer()
        this.schulzimmer2.id = '2'
        this.schulzimmer2.personId = 'abc'
        this.schulzimmer2.name = 'Dummy Schulzimmer 2'
        this.schulzimmer2.tische= this.getTischeLong()



        this.schulzimmer = [this.schulzimmer1, this.schulzimmer2]
        return this.schulzimmer


    }
    getSitzordnungen(): Sitzordnung[]{
        this.sitzordnung1 = new Sitzordnung()
        this.sitzordnung1.id = '1',
        this.sitzordnung1.personId = 'abc'
        this.sitzordnung1.schulklassenId = '1'
        this.sitzordnung1.schulzimmerId = '1'
        this.sitzordnung1.name = 'Dummy Sitzordnung'
        this.sitzordnung1.seatings = new Array<Seating>(3)
        let tische = this.getTische()
        let schueler = this.getSchueler()
        this.sitzordnung1.seatings[0] = new Seating({
            id: '1',
            schueler: schueler[0],
            tisch: tische[0]

        })
        this.sitzordnung1.seatings[1] = new Seating({
            id: '2',
            schueler: schueler[4],
            tisch: tische[1]

        })
        this.sitzordnung1.seatings[2] = new Seating({
            id: '3',
            schueler: schueler[2],
            tisch: tische[2]

        })
        // this.sitzordnung1.seatings[3] = new Seating({
        //     id: '4',
        //     schueler: schueler[1],
        //     tisch: tische[3]

        // })
    
       this.sitzordnungen = [this.sitzordnung1]
       return this.sitzordnungen




    }
    getRegeln():Regel[]{
        let regel1 = new Regel()
        regel1.id = '1'
        regel1.personId = 'abc'
        regel1.beschreibung = "Test Regel"
        regel1.active = true
        regel1.type = "Unmögliche Paarung"
        regel1.tischId = null
        regel1.schueler1Id = '1'
        regel1.schueler2Id = '3'

        let regel2 = new Regel()
        regel2.id = '2'
        regel2.personId = 'abc'
        regel2.beschreibung = "Test Regel 2"
        regel2.active = true
        regel2.type = "Fester Sitzplatz"
        regel2.tischId = '3'
        regel2.schueler1Id = '1'
        regel2.schueler2Id = null

        return [ regel1, regel2]



    }





}