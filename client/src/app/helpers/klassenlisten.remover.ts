import { Schulklasse } from '../models/schulklasse';
import { Schueler } from '../models/schueler';
import { Klassenliste } from '../models/klassenliste';

export class KlassenlistenRemover {
  constructor() { }

  removeSchuelerFromKlassenlisten(removedSchueler: Schueler, klassenlistenToPerson: Klassenliste[]): Klassenliste[] {
    debugger;
    if (typeof klassenlistenToPerson !== 'undefined') {
      klassenlistenToPerson.forEach(function (o) {
        if (o.gruppen){
        o.gruppen.forEach(function (gruppe) {
          gruppe.schueler = gruppe.schueler.filter(schueler => schueler.id != removedSchueler.id);
        });
      }
      });
      return klassenlistenToPerson

    }



  }

  removeKlassenlistenContainingSchulklasse(selectedSchulklasse: Schulklasse, klassenlistenToPerson: Klassenliste[]): [Klassenliste[], number]{
    debugger;
    let numFiltered = 0
    klassenlistenToPerson = klassenlistenToPerson.filter(
       function(liste) { 
        if(liste.schulklassenId == selectedSchulklasse.id){
          numFiltered++;
          return false
        }
        else{
          return true
        }
       }
      );
    return [klassenlistenToPerson, numFiltered]
  }
}