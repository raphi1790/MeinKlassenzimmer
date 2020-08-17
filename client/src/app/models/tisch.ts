import { PositionTisch } from "./position.tisch";

export class Tisch{
    id: string;
    schulzimmerId: string;
    position: PositionTisch;
    active: boolean;
    tischNumber: number;
}