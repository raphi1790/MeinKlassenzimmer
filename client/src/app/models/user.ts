import { Schulklasse } from './schulklasse';
import { Schulzimmer } from './schulzimmer';
import { Regel } from './regel';
import { Schueler } from './schueler';
import { Tisch } from './tisch';
import { PositionTisch } from './position.tisch';
import { Klassenliste } from './klassenliste';
import { Gruppe } from './gruppe';

export class User {

  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
  schulklassen?: Schulklasse[];
  klassenlisten?: Klassenliste[];
  schulzimmer?: Schulzimmer[];
  regeln?: Regel[];


  constructor(user: User) {
    debugger;
    this.uid = user.uid;
    this.email = user.email;
    this.photoURL = user.photoURL;
    this.displayName = user.displayName;
    user.regeln !== undefined ? this.regeln = user.regeln: this.regeln = new Array<Regel>();
    user.schulklassen !== undefined ? this.schulklassen = user.schulklassen: this.schulklassen = new Array<Schulklasse>();
    user.schulzimmer !== undefined ? this.schulzimmer = user.schulzimmer: this.schulzimmer = new Array<Schulzimmer>();
    user.klassenlisten !== undefined ? this.klassenlisten = user.klassenlisten: this.klassenlisten = new Array<Klassenliste>()
 
  }
}

