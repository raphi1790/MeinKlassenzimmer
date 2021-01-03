import { PositionTisch } from "./position.tisch";
import { Seating } from "./seating";
import { Tisch } from './tisch';



export class SeatingOutput{
    position: PositionTisch;
    selected: boolean;
    active: boolean;
    tischId: string;
    tischNumber: number;
    seating: Seating;
    tisch: Tisch; 

}


