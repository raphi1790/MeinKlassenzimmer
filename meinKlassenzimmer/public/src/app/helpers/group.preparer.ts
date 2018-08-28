import { Schueler } from "../models/schueler";
import { Randomizer } from "./randomizer";


export class GroupPreparer {

    
    
    constructor() {
        
        
    }

    prepareGruppenEinteilung(inputSchueler: Schueler[], inputGroupSize: number):any{
        if (inputSchueler.length == 0 ){
            console.log("Abbruch, da keine Schueler übergeben wurden.")
        }
        else{
            var randomizer = new Randomizer();
            var randomizedSchueler = randomizer.shuffle(inputSchueler);
            var numberOfGroups = Math.ceil(inputSchueler.length/inputGroupSize);
            console.log("Anzahl Gruppen: " + numberOfGroups);
            var gruppenEinteilung = [];

            switch (inputGroupSize) {
                case 2:
                    for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                        debugger;
                        var schueler2;
                        if(randomizedSchueler[groupIndex * numberOfGroups + 1] == undefined ){
                            schueler2 = null;
                        }
                        else
                        {
                            schueler2 = randomizedSchueler[groupIndex * numberOfGroups + 1].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 1].nameKurz
                        }

                        gruppenEinteilung.push({
                            gruppe: groupIndex + 1,
                            schueler1: randomizedSchueler[groupIndex * numberOfGroups].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups].nameKurz,
                            schueler2: schueler2,
                        })
                    }
                 
                  break;
                case 3:
                    for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                        debugger;
                        var schueler2;
                        var schueler3;
                        if(randomizedSchueler[groupIndex * numberOfGroups + 1] == undefined ){
                            schueler2 = null;
                        
                        }
                        else
                        {
                            schueler2 = randomizedSchueler[groupIndex * numberOfGroups + 1].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 1].nameKurz
                        }
                        if(randomizedSchueler[groupIndex * numberOfGroups + 2] == undefined ){
                            schueler3 = null;
                        
                        }
                        else
                        {
                            schueler3 = randomizedSchueler[groupIndex * numberOfGroups + 2].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 2].nameKurz
                        }
                        
                        gruppenEinteilung.push({
                            gruppe: groupIndex + 1,
                            schueler1: randomizedSchueler[groupIndex * numberOfGroups].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups].nameKurz,
                            schueler2: schueler2,
                            schueler3: schueler3
                                
                            
                        })
                        
                
                    }
                  
                  break;
                case 4:
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    debugger;
                    var schueler2;
                    var schueler3;
                    var schueler4;
                    var schueler5;
                    if(randomizedSchueler[groupIndex * numberOfGroups + 1] == undefined ){
                        schueler2 = null;
                    
                    }
                    else
                    {
                        schueler2 = randomizedSchueler[groupIndex * numberOfGroups + 1].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 1].nameKurz
                    }
                    if(randomizedSchueler[groupIndex * numberOfGroups + 2] == undefined ){
                        schueler3 = null;
                    
                    }
                    else
                    {
                        schueler3 = randomizedSchueler[groupIndex * numberOfGroups + 2].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 2].nameKurz
                    }
                    if(randomizedSchueler[groupIndex * numberOfGroups + 3] == undefined ){
                        schueler4 = null;
                    
                    }
                    else
                    {
                        schueler4 = randomizedSchueler[groupIndex * numberOfGroups + 3].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 3].nameKurz
                    }
                    gruppenEinteilung.push({
                        gruppe: groupIndex + 1,
                        schueler1: randomizedSchueler[groupIndex * numberOfGroups].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups].nameKurz,
                        schueler2: schueler2,
                        schueler3: schueler3,
                        schueler4: schueler4,

                    })
                    
            
                }
                  
                  break; 
                case 5:
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    debugger;
                    var schueler2;
                    var schueler3;
                    var schueler4;
                    var schueler5;
                    if(randomizedSchueler[groupIndex * numberOfGroups + 1] == undefined ){
                        schueler2 = null;
                    
                    }
                    else
                    {
                        schueler2 = randomizedSchueler[groupIndex * numberOfGroups + 1].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 1].nameKurz
                    }
                    if(randomizedSchueler[groupIndex * numberOfGroups + 2] == undefined ){
                        schueler3 = null;
                    
                    }
                    else
                    {
                        schueler3 = randomizedSchueler[groupIndex * numberOfGroups + 2].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 2].nameKurz
                    }
                    if(randomizedSchueler[groupIndex * numberOfGroups + 3] == undefined ){
                        schueler4 = null;
                    
                    }
                    else
                    {
                        schueler4 = randomizedSchueler[groupIndex * numberOfGroups + 3].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 3].nameKurz
                    }
                    if(randomizedSchueler[groupIndex * numberOfGroups + 4] == undefined ){
                        schueler5 = null;
                    
                    }
                    else
                    {
                        schueler5 = randomizedSchueler[groupIndex * numberOfGroups + 4].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups + 4].nameKurz
                    }
                    
                    gruppenEinteilung.push({
                        gruppe: groupIndex + 1,
                        schueler1: randomizedSchueler[groupIndex * numberOfGroups].vorname + " "+ randomizedSchueler[groupIndex * numberOfGroups].nameKurz,
                        schueler2: schueler2,
                        schueler3: schueler3,
                        schueler4: schueler4,
                        schueler5: schueler5

                    })

                }
                  
                  break;  
          
                default:
                  break;
            }

           
        
        console.log("Gruppeneinteilung as plain object");
        console.log(gruppenEinteilung);

      
        return gruppenEinteilung
    }

}  
}