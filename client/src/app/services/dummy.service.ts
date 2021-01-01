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




@Injectable()
export class DummyService {

    schulklasse1: Schulklasse
    schulklasse2: Schulklasse
    schulklassen: Schulklasse[]
    schulzimmer1: Schulzimmer
    schulzimmer: Schulzimmer[]
    sitzordnung1: Sitzordnung
    sitzordnungen: Sitzordnung[]
    user: User



    constructor() {

    }

    getUser(): User{
        debugger;
        this.user = new User({
            uid: 'abc',
            email: "raphael.schoenenberger@test.ch",
            photoURL: null,
            displayName : 'Dummy User',
            schulklassen : this.getSchulklassen(),
            schulzimmer : this.getSchulzimmer(),
            sitzordnungen: this.getSitzordnungen()
        })
        

        return this.user
    }
    private getSchueler(): Schueler[]{
        let schueler = new Array<Schueler>(3)
        for (let index = 0; index < schueler.length; index++) {
            schueler[index] = new Schueler({
                id: String(index),
                schulklassenId: '1',
                name: 'test',
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
        this.schulklasse2.id = '1'
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
        this.schulklassen = new Array<Schulklasse>(2)
        this.schulklassen[0] = this.schulklasse1
        this.schulklassen[1] = this.schulklasse2
        return this.schulklassen;
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
            active: false,
            tischNumber: 5
        })

        return tische
    }
    getSchulzimmer(): Schulzimmer[] {
        debugger;
        this.schulzimmer1 = new Schulzimmer()
        this.schulzimmer1.id = '1'
        this.schulzimmer1.personId = 'abc'
        this.schulzimmer1.name = 'Dummy Schulzimmer'
        this.schulzimmer1.tische= this.getTische()
        this.schulzimmer = [this.schulzimmer1]
        return this.schulzimmer


    }
    getSitzordnungen(): Sitzordnung[]{
        this.sitzordnung1 = new Sitzordnung()
        this.sitzordnung1.id = '1',
        this.sitzordnung1.personId = 'abc'
        this.sitzordnung1.name = 'Dummy Sitzordnung'
        this.sitzordnung1.seatings = new Array<Seating>(5)
        let tische = this.getTische()
        let schueler = this.getSchueler()
        this.sitzordnung1.seatings[0] = new Seating({
            id: '1',
            sitzordnungId: '1',
            schueler: schueler[0],
            tisch: tische[0]

        })
        this.sitzordnung1.seatings[1] = new Seating({
            id: '2',
            sitzordnungId: '1',
            schueler: null,
            tisch: tische[1]

        })
        this.sitzordnung1.seatings[2] = new Seating({
            id: '3',
            sitzordnungId: '1',
            schueler: schueler[2],
            tisch: tische[2]

        })
        this.sitzordnung1.seatings[3] = new Seating({
            id: '4',
            sitzordnungId: '1',
            schueler: schueler[1],
            tisch: tische[3]

        })
        this.sitzordnung1.seatings[4] = new Seating({
            id: '5',
            sitzordnungId: '1',
            schueler: null,
            tisch: tische[4]

       })
       this.sitzordnungen = [this.sitzordnung1]
       return this.sitzordnungen




    }





}