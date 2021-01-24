import { Schulklasse } from '../models/schulklasse';
import { Schueler } from '../models/schueler';
import { Sitzordnung } from '../models/sitzordnung';
import { Schulzimmer } from '../models/schulzimmer';
import { TischOutput } from '../models/output.tisch';

export class SitzordnungenRemover {
  constructor() { }

  removeTischFromSeating(removedTischOutput: TischOutput, sitzordnungenToPerson: Sitzordnung[]  ): Sitzordnung[]{
    debugger;
    if (typeof sitzordnungenToPerson !== 'undefined') {
      sitzordnungenToPerson.forEach(function (o) {
        o.seatings = o.seatings.filter(seating => seating.tisch.position != removedTischOutput.position )
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