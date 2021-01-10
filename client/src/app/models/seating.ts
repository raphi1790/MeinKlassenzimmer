import { Tisch } from "./tisch";
import { Schueler } from "./schueler";

export class Seating{
    id: string;
    schueler: Schueler;
    tisch: Tisch;

    constructor(seating: Seating){
        this.id = seating.id
        this.schueler = seating.schueler
        this.tisch = seating.tisch
    }


}