import { Schulklasse } from './schulklasse';
import { Schulzimmer } from './schulzimmer';
import { Regel } from './regel';
import { Klassenliste } from './klassenliste';
import { Sitzordnung } from './sitzordnung';


export class User {

  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
  schulklassen?: Schulklasse[];
  klassenlisten?: Klassenliste[];
  schulzimmer?: Schulzimmer[];
  regeln?: Regel[];
  sitzordnungen?: Sitzordnung[];


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
    user.sitzordnungen !== undefined ? this.sitzordnungen = user.sitzordnungen: this.sitzordnungen = new Array<Sitzordnung>()
 
  }
}

