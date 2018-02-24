import { Klasse } from "app/models/klasse";
import { Schueler } from "app/models/schueler";
import { Person } from "app/models/person";
import { PersonService } from "app/services/person.service";

export class SaveChecker {

    personService: PersonService;

    public personNeedSaving(): boolean {
        if (this.personService.getPerson()) {
            return false;
        }
        else {
            return true;
        }
    }

    public klasseSchuelerNeedSaving(neueKlassen: Klasse[],deletedKlassen: Klasse[], neueSchueler: Schueler[],deletedSchuelerTmp: Schueler[]): boolean {
        if ((neueSchueler == null || neueSchueler.length == 0)
            && (deletedSchuelerTmp == null || deletedSchuelerTmp.length == 0)
            && (neueKlassen == null || neueKlassen.length == 0)
            && (deletedKlassen == null || deletedKlassen.length == 0)) {
            return false;
        }
        else {
            return true;
        }
    }






}


