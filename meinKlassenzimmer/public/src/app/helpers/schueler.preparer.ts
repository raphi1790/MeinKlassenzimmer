import { Schueler } from "../models/schueler";


export class SchuelerPreparer {

    
    
    constructor() {

    }

    prepareSchuelerNameKurz(inputSchueler: Schueler[]):Schueler[]{
        debugger;
        var outputSchueler =  Array<Schueler>(inputSchueler.length);
            
        for (let index = 0; index < inputSchueler.length; index++) {
            if(inputSchueler[index].name == undefined){
                outputSchueler[index] = new Schueler();
                outputSchueler[index].id = inputSchueler[index].id;
                outputSchueler[index].vorname = inputSchueler[index].vorname;
                outputSchueler[index].name = null;
                outputSchueler[index].nameKurz = null;

            }else{
                outputSchueler[index] = new Schueler();
                outputSchueler[index].id = inputSchueler[index].id;
                outputSchueler[index].vorname = inputSchueler[index].vorname;
                outputSchueler[index].name = inputSchueler[index].name;
                outputSchueler[index].nameKurz = inputSchueler[index].nameKurz;
    
                if(inputSchueler[index].name.length > 5){
                    outputSchueler[index].nameKurz =  inputSchueler[index].name.substring(0,4) + ".";
                }else{
                    outputSchueler[index].nameKurz = inputSchueler[index].name;
                }

            }
           
        }

        return outputSchueler;

    }



}
 