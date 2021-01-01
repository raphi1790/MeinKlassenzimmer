import { Tisch } from "./tisch";
import { Schueler } from "./schueler";

export class Seating{
    id: string;
    sitzordnungId: string;
    schueler: Schueler;
    tisch: Tisch;

    constructor(seating: Seating){
        this.id = seating.id
        this.sitzordnungId = seating.sitzordnungId
        this.schueler = seating.schueler
        this.tisch = seating.tisch
    }


}