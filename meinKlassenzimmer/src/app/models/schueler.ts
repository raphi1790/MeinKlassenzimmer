export class Schueler{
    id: number;
    klassenid: number;
    vorname: string;
    name: string;

    constructor (klassenid: number,vorname: string,name: string){
        this.klassenid = klassenid;
        this.vorname = vorname;
        this.name = name;
    }
}
    