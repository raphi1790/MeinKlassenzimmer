import { Schulklasse } from "../models/schulklasse";
import { Schulzimmer } from "../models/schulzimmer";
import { Regel } from "../models/regel";
import { OutputRegelTisch } from "app/models/output.regel.sitzordnung";
import { OutputRegelPaarung } from "app/models/output.regel.paarung";



export class RegelEnricher {
    
    enrichedRegelSitzplatz(klassen: Schulklasse[], zimmer: Schulzimmer[], regeln: Regel[]): OutputRegelTisch[]{  
        debugger;
        var regelnOutputTisch = new Array<OutputRegelTisch>();
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
            let chosenZimmer = zimmer.filter(zimmer => 
                zimmer.tische.some(x => x.id== regeln[indexRegel].tischId)).map(element => {
                    let newElt = Object.assign({}, element);
                    return newElt ;
                });        
                    
            regelnOutputTisch[indexRegel] = new OutputRegelTisch();
            regelnOutputTisch[indexRegel].regelId = regeln[indexRegel].id;
            regelnOutputTisch[indexRegel].beschreibung = regeln[indexRegel].beschreibung;
            regelnOutputTisch[indexRegel].type = regeln[indexRegel].type;
            regelnOutputTisch[indexRegel].klasse = chosenKlasse[0].name;
            if(chosenSchueler[0][0].name == null){
                regelnOutputTisch[indexRegel].schueler = chosenSchueler[0][0].vorname
            }else{
                regelnOutputTisch[indexRegel].schueler = chosenSchueler[0][0].vorname + ' ' + chosenSchueler[0][0].nameKurz ;
            }
            regelnOutputTisch[indexRegel].tischNumber = chosenTisch[0][0].tableNumber;
            regelnOutputTisch[indexRegel].zimmer = chosenZimmer[0].name;
            
            
                
            }

        return regelnOutputTisch;
  
    }
    enrichedRegelPaarung(klassen: Schulklasse[], regeln: Regel[]): OutputRegelPaarung[]{  
        debugger;
        var regelnOutputPaarung = new Array<OutputRegelPaarung>();
        for (let indexRegel = 0; indexRegel < regeln.length; indexRegel++) {
        
            let chosenSchueler1 = klassen.filter(klasse => 
                    klasse.schueler.some(x => x.id== regeln[indexRegel].schueler1Id)).map(element => {
                        let newElt = Object.assign({}, element);
                        return newElt.schueler.filter(x => x.id== regeln[indexRegel].schueler1Id)
                    });
            let chosenSchueler2 = klassen.filter(klasse => 
                klasse.schueler.some(x => x.id== regeln[indexRegel].schueler2Id)).map(element => {
                    let newElt = Object.assign({}, element);
                    return newElt.schueler.filter(x => x.id== regeln[indexRegel].schueler2Id)
                });        
            let chosenKlasse = klassen.filter(klasse => 
                klasse.schueler.some(x => x.id== regeln[indexRegel].schueler1Id)).map(element => {
                    let newElt = Object.assign({}, element);
                    return newElt ;
                });     
                    
            regelnOutputPaarung[indexRegel] = new OutputRegelPaarung();
            regelnOutputPaarung[indexRegel].regelId = regeln[indexRegel].id;
            regelnOutputPaarung[indexRegel].beschreibung = regeln[indexRegel].beschreibung;
            regelnOutputPaarung[indexRegel].type = regeln[indexRegel].type;
            regelnOutputPaarung[indexRegel].klasse = chosenKlasse[0].name;
            if(chosenSchueler1[0][0].name == null){
                regelnOutputPaarung[indexRegel].schueler1 = chosenSchueler1[0][0].vorname
            }else{
                regelnOutputPaarung[indexRegel].schueler1 = chosenSchueler1[0][0].vorname + ' ' + chosenSchueler1[0][0].nameKurz ;
            }
            if(chosenSchueler2[0][0].name == null){
                regelnOutputPaarung[indexRegel].schueler2 = chosenSchueler2[0][0].vorname
            }else{
                regelnOutputPaarung[indexRegel].schueler2 = chosenSchueler2[0][0].vorname + ' ' + chosenSchueler2[0][0].nameKurz ;
            }
           
            }

        return regelnOutputPaarung;
  
    }


}