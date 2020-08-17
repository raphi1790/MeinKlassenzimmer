import { Schulklasse } from './schulklasse';
import { Schulzimmer } from './schulzimmer';
import { Regel } from './regel';
import { Schueler } from './schueler';
import { Tisch } from './tisch';
import { PositionTisch } from './position.tisch';

export class User {

    uid: string;
    email: string;
    photoURL: string;
    displayName: string;
    schulklassen?: Schulklasse[];
    schulzimmer?: Schulzimmer[];
    regeln?: Regel[];


    constructor(user: User) {
      this.uid = user.uid;
      this.email = user.email;
      this.photoURL = user.photoURL;
      this.displayName = user.displayName;
      this.regeln = user.regeln;
      debugger;
      // prepare schulklassen-array
      if (user.hasOwnProperty("schulklassen") && user.schulklassen != null && user.schulklassen != undefined){
        this.schulklassen = Object.keys(user.schulklassen).map(function(klassenIndex){
          let klasse = new Schulklasse()
          klasse.id =  user.schulklassen[klassenIndex].id;
          klasse.name = user.schulklassen[klassenIndex].name;
          klasse.personId = user.uid;
          if(user.schulklassen[klassenIndex].hasOwnProperty("schueler") && user.schulklassen[klassenIndex].schueler != null && user.schulklassen[klassenIndex].schueler!= undefined){
            var schueler:Schueler[] = Object.keys(user.schulklassen[klassenIndex].schueler).map(function(schuelerIndex){
              let singleTisch = new Schueler({
                id: user.schulklassen[klassenIndex].schueler[schuelerIndex].id,
                schulklassenId:klasse.id,
                name:user.schulklassen[klassenIndex].schueler[schuelerIndex].name,
                vorname:user.schulklassen[klassenIndex].schueler[schuelerIndex].vorname
              });
              return singleTisch
            
            })
            klasse.schueler = schueler
          }
          else {
            klasse.schueler = new Array<Schueler>()
          }
          return klasse
          })
      }
      else{
        this.schulklassen = new Array<Schulklasse>();
      }
      //prepare schulzimmer-array
      if (user.hasOwnProperty("schulzimmer") && user.schulzimmer != null && user.schulzimmer != undefined){
        this.schulzimmer = Object.keys(user.schulzimmer).map(function(zimmerIndex){
          let zimmer = new Schulzimmer()
          zimmer.id =  user.schulzimmer[zimmerIndex].id;
          zimmer.name = user.schulzimmer[zimmerIndex].name;
          zimmer.personId = user.uid;
          if(user.schulzimmer[zimmerIndex].hasOwnProperty("tische")&& user.schulzimmer[zimmerIndex].tische != null && user.schulzimmer[zimmerIndex].tische != undefined){
            var tische:Tisch[] = Object.keys(user.schulzimmer[zimmerIndex].tische).map(function(tischIndex){
              let singleTisch = new Tisch();
              singleTisch.id = user.schulzimmer[zimmerIndex].tische[tischIndex].id;
              singleTisch.position = new PositionTisch(user.schulzimmer[zimmerIndex].tische[tischIndex].position.row,
                                                        user.schulzimmer[zimmerIndex].tische[tischIndex].position.column) ;
              singleTisch.active = user.schulzimmer[zimmerIndex].tische[tischIndex].active;
              singleTisch.tischNumber = user.schulzimmer[zimmerIndex].tische[tischIndex].tischNumber;
              singleTisch.schulzimmerId = zimmer.id;
              return singleTisch
            
            })
            zimmer.tische = tische
          }
          else {
            zimmer.tische = new Array<Tisch>()
          }
          return zimmer
          })
      }
      else{
        this.schulzimmer = new Array<Schulzimmer>();
      }
       //prepare regel-array
       if (user.hasOwnProperty("regeln") && user.regeln != null && user.regeln != undefined){
        debugger;
        this.regeln = Object.keys(user.regeln).map(function(regelIndex){
          let regel = new Regel()
          regel.id =  user.regeln[regelIndex].id;
          regel.type = user.regeln[regelIndex].type;
          regel.beschreibung = user.regeln[regelIndex].beschreibung;
          regel.personId = user.uid;
          regel.tischId = user.regeln[regelIndex].tischId;
          regel.schueler1Id = user.regeln[regelIndex].schueler1Id;
          regel.schueler2Id = user.regeln[regelIndex].schueler2Id;
          return regel
          })
      }
      else{
        this.regeln = new Array<Regel>();
      }
      
    }
  }

  