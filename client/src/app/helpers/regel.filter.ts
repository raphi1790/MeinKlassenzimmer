import { Schulklasse } from '../models/schulklasse.js';
import { Schulzimmer} from '../models/schulzimmer.js'
import { Regel} from '../models/regel.js'

export class RegelFilter{
    constructor() {}      
        
    filterRegelBySchulklasseAndSchulzimmer(regelnToPerson: Regel[], klassenToPerson: Schulklasse[],
        zimmerToPerson: Schulzimmer[],
        selectedSchulklasse: Schulklasse, selectedSchulzimmer: Schulzimmer): Regel[]{
        let relevantRegeln = new Array<Regel>();
        let inputRegeln = regelnToPerson;
    
        for (let index = 0; index < inputRegeln.length; index++) {
          let chosenSchueler = klassenToPerson.filter(klasse => 
            klasse.schueler.some(x => x.id== inputRegeln[index].schueler1Id)).map(element => {
                let newElt = Object.assign({}, element);
                return newElt.schueler.filter(x => x.id== inputRegeln[index].schueler1Id)
            });
            let chosenTisch = zimmerToPerson.filter(klasse => 
              klasse.tische.some(x => x.id== inputRegeln[index].tischId)).map(element => {
                  let newElt = Object.assign({}, element);
                  return newElt.tische.filter(x => x.id== inputRegeln[index].tischId) ;
              }); 
              switch (inputRegeln[index].type) {
                case "Fester Sitzplatz":
                    if( chosenSchueler[0][0].schulklassenId == selectedSchulklasse.id 
                          && chosenTisch[0][0].schulzimmerId == selectedSchulzimmer.id){
                            relevantRegeln.push(inputRegeln[index]);
                          }
                      
                  break;
                case "Unmögliche Paarung":
                  if( chosenSchueler[0][0].schulklassenId == selectedSchulklasse.id){
                      relevantRegeln.push(inputRegeln[index]);
                    }
                  break;  
              
                default:
                  console.log("Kein gültiger Regel-Typ")
                  break;
              }   
          
          
        }
        return relevantRegeln
    }
    filterRegelBySchulklasse(regelnToPerson: Regel[],
         klassenToPerson: Schulklasse[], selectedSchulklasse: Schulklasse){
            let relevantRegeln = new Array<Regel>();
            let inputRegeln = regelnToPerson;
            if(selectedSchulklasse.schueler === null || selectedSchulklasse.schueler === undefined){
              return []
            }
            let relevantSchulklassen = klassenToPerson.filter(klasse => klasse.schueler !== null && klasse.schueler !== undefined)
            for (let index = 0; index < inputRegeln.length; index++) {
              let chosenSchueler = relevantSchulklassen.filter(klasse => 

                
                klasse.schueler.some(x => x.id== inputRegeln[index].schueler1Id)).map(element => {
                    let newElt = Object.assign({}, element);
                    return newElt.schueler.filter(x => x.id== inputRegeln[index].schueler1Id)
                });
                if(chosenSchueler[0][0].schulklassenId == selectedSchulklasse.id){
                    relevantRegeln.push(inputRegeln[index]);
                }   
                         
            }
            return relevantRegeln

         }
    
}