export class Schueler{
    id: number;
    klassenid: number;
    vorname: string;
    name: string;

    setValues (klassenid: number,vorname: string,name: string): void{
        this.klassenid = klassenid;
        this.vorname = vorname;
        this.name = name;
    }
}
    