import { Schulklasse } from "../models/schulklasse";
import { Schulzimmer } from "../models/schulzimmer";
import { Regel } from "../models/regel";
import { OutputRegel } from "app/models/output.regel";



export class RegelEnricher {
    
    enrichedRegel(klassen: Schulklasse[], zimmer: Schulzimmer[], regeln: Regel[]): OutputRegel[]{  
        
        var regelnOutput = new Array<OutputRegel>();
        for (let indexRegel = 0; indexRegel < regeln.length; indexRegel++) {
        
            let chosenSchueler = klassen.filter(klasse => 
                    klasse.schueler.some(x => x.id== regeln[indexRegel].schueler1Id)).map(element => {
                        let newElt = Object.assign({}, element);
                        return newElt.schueler.filter(x => x.id== regeln[indexRegel].schueler1Id)
                    });
            let chosenKlasse = klassen.filter(klasse => 
                klasse.schueler.some(x => x.id== regeln[indexRegel].schueler1Id)).map(element => {
                    let newElt = Object.assign({}, element);
                    return newElt ;
                });
            let chosenTisch = zimmer.filter(klasse => 
                klasse.tische.some(x => x.id== regeln[indexRegel].tischId)).map(element => {
                    let newElt = Object.assign({}, element);
                    return newElt.tische.filter(x => x.id== regeln[indexRegel].tischId) ;
                });    
            let chosenZimmer = zimmer.filter(klasse => 
                klasse.tische.some(x => x.id== regeln[indexRegel].tischId)).map(element => {
                    let newElt = Object.assign({}, element);
                    return newElt ;
                });        
                    
            regelnOutput[indexRegel] = new OutputRegel();
            regelnOutput[indexRegel].regelId = regeln[indexRegel].id;
            regelnOutput[indexRegel].beschreibung = regeln[indexRegel].beschreibung;
            regelnOutput[indexRegel].type = regeln[indexRegel].type;
            regelnOutput[indexRegel].klasse = chosenKlasse[0].name;
            regelnOutput[indexRegel].schueler = chosenSchueler[0][0].vorname + ' ' + chosenSchueler[0][0].nameKurz ;
            regelnOutput[indexRegel].tischNumber = chosenTisch[0][0].tableNumber;
            regelnOutput[indexRegel].zimmer = chosenZimmer[0].name;
            
            
                
            }

        return regelnOutput;
  
    }


}