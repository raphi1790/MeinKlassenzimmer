import { Seating } from "./seating";

export class Sitzordnung{
    id: string;
    personId: string;
    schulklassenId: string;
    schulzimmerId: string;
    name: string;
    seatings: Seating[];

    // constructor(sitzordnung: Sitzordnung){
    //     this.id = sitzordnung.id,
    //     this.personId = sitzordnung.personId,
    //     this.name = sitzordnung.name,
    //     this.seatings = sitzordnung.seatings
    // }
 


}