import { Schulklasse } from '../models/schulklasse';
import { Schueler } from '../models/schueler';
import { Sitzordnung } from '../models/sitzordnung';

export class SitzordnungenRemover {
  constructor() { }

  removeSchuelerFromSeating(removedSchueler: Schueler, sitzordnungenToPerson: Sitzordnung[]): Sitzordnung[] {
    debugger;
    if (typeof sitzordnungenToPerson !== 'undefined') {
      sitzordnungenToPerson.forEach(function (o) {
        o.seatings = o.seatings.filter(schueler => schueler.id != removedSchueler.id )
        });
      return sitzordnungenToPerson

    }

  }

  removeSitzordnungenContainingSchulklasse(selectedSchulklasse: Schulklasse, sitzordnungenToPerson: Sitzordnung[]): [Sitzordnung[], number]{
    debugger;
    let numFiltered = 0
    sitzordnungenToPerson = sitzordnungenToPerson.filter(
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
    return [sitzordnungenToPerson, numFiltered]
  }
}