import { PositionTisch } from "./position.tisch";

export class Tisch{
    id: string;
    schulzimmerId: string;
    position: PositionTisch;
    active: boolean;
    tischNumber: number;

    constructor(tisch: Tisch){
        this.id = tisch.id
        this.schulzimmerId = tisch.schulzimmerId
        this.position = tisch.position
        this.active = tisch.active
        this.tischNumber = tisch.tischNumber
    }
}

