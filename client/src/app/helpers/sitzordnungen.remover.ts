import { Schulklasse } from '../models/schulklasse';
import { Schueler } from '../models/schueler';
import { Sitzordnung } from '../models/sitzordnung';
import { Schulzimmer } from '../models/schulzimmer';
import { Tisch } from '../models/tisch';


export class SitzordnungenRemover {
  constructor() { }

  removeTischFromSeating(removedTisch: Tisch, sitzordnungenToPerson: Sitzordnung[]  ): Sitzordnung[]{
    debugger;
    // console.log("removeTischFromSeating, removedTisch", removedTisch)
    // console.log("removeTischFromSeating, sitzordnungenToPerson", sitzordnungenToPerson)
    if (typeof sitzordnungenToPerson !== 'undefined') {
      sitzordnungenToPerson.forEach(function (o) {
        if (o.seatings){
          o.seatings = o.seatings.filter(seating => !(seating.tisch.position.column === removedTisch.position.column && seating.tisch.position.row === removedTisch.position.row ))
        }
        
        });
      return sitzordnungenToPerson

    }
    

  }

  removeSchuelerFromSeating(removedSchueler: Schueler, sitzordnungenToPerson: Sitzordnung[]): Sitzordnung[] {
    debugger;
    if (typeof sitzordnungenToPerson !== 'undefined') {
      sitzordnungenToPerson.forEach(function (o) {
        o.seatings = o.seatings.filter(seating => seating.schueler.id != removedSchueler.id )
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

  removeSitzordnungenContainingSchulzimmer(selectedSchulzimmer: Schulzimmer, sitzordnungenToPerson: Sitzordnung[]):[Sitzordnung[], number]{ 
    debugger;
    let numFiltered = 0
    sitzordnungenToPerson = sitzordnungenToPerson.filter(
       function(liste) { 
        if(liste.schulzimmerId == selectedSchulzimmer.id){
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