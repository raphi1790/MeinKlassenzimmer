export class Person {
    id: number;
    name: string;
    vorname: string;
    email: string;

    get getId(): number{
        this.id = 3
        return this.id;
    }
    set setId(id : number){
        this.id = id;
    }



}
