
 export class Schueler{
    id: string;
    schulklassenId: string;
    vorname: string;
    name: string;
    nameKurz?: string;

    constructor(schueler: Schueler){
      this.id = schueler.id;
      this.schulklassenId = schueler.schulklassenId;
      this.vorname = schueler.vorname;
      
      if(schueler.name != null){
        this.name = schueler.name;
        if(schueler.name.length > 5){
            this.nameKurz =  schueler.name.substring(0,4) + ".";
        }else{
            this.nameKurz = schueler.name;
        }   

      }else {
          this.nameKurz = null;
          this.name = schueler.name;
          
      }
    

    }
}
    