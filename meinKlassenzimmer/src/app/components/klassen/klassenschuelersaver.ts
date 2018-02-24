import { Klasse } from "app/models/klasse";
import { Schueler } from "app/models/schueler";
import { KlassenService } from "app/services/klassen.service";
import { PersonService } from "app/services/person.service";
import { Person } from "app/models/person";
import { AuthService } from 'app/services/auth/auth.service';
import { SaveChecker } from 'app/savechecker';

export class KlassenSchuelerSaver {

    klassenService: KlassenService;
    personService: PersonService;
    auth: AuthService
    saveChecker: SaveChecker;



    public save(addedKlasse: Klasse[], deletedKlasse: Klasse[],
        addedSchueler: Schueler[], deletedSchueler: Schueler[]): void {

        if (addedKlasse.length > 0) {
            for (let klasse of addedKlasse) {
                this.klassenService.createKlasseToPersonid(klasse);
            };

        }
        if (deletedKlasse.length > 0) {
            for (let klasse of deletedKlasse) {
                this.klassenService.deleteKlasseToPersonid(klasse.id);
            };

        }

        if (addedSchueler.length > 0) {
            for (let schueler of addedSchueler) {
                this.klassenService.createSchuelerToKlassenid(schueler);
            };

        }
        if (deletedSchueler.length > 0) {
            for (let schueler of deletedSchueler) {
                this.klassenService.deleteSchuelerToKlassenid(schueler.id);
            };
        }

        if (this.saveChecker.personNeedSaving()) {
            var neuePersonTmp: Person;
            neuePersonTmp = this.prepareSavingPerson();
            this.personService.createPerson(neuePersonTmp);
        }
    }


    private prepareSavingPerson(): Person {
        var savingPerson: Person;
        this.auth.getProfile((err, profile) => {
            savingPerson.geschlecht = profile.gender;
            savingPerson.name = profile.family_name;
            savingPerson.vorname = profile.given_name;
            savingPerson.nickname = profile.nickname;
        });
    
        return savingPerson

    }


}