import { Component, OnInit } from '@angular/core';
import { RegelService } from '../../services/regel.service';
import { AuthService } from '../../services/auth/auth.service';
import { Regel } from '../../models/regel';

@Component({
  selector: 'app-regeln',
  templateUrl: './regeln.component.html',
  styleUrls: ['./regeln.component.css']
})
export class RegelnComponent implements OnInit {



  savingIsActiv: boolean;
  isLoading: boolean;
  isSaving: boolean;

//   @Input() personid: number

  constructor(private regelService: RegelService, private auth : AuthService ) {
      this.maximalRegelId = 0;


  }

  regelnToPerson: Regel[];
  maximalRegelId: number;
//   neueSchulklasseName: string
//   neueSchulklasseForm = new FormControl('', [Validators.required, Validators.minLength(2)]);


getRegelnToPerson() {

    this.regelService.getRegelByPersonid().subscribe(
      (data:Regel[]) => {
        debugger;
        this.regelnToPerson = data;
        this.isLoading = false;});
  
  }


//   getErrorMessageNeueSchulklasse() {
//     return this.neueSchulklasseForm.hasError('required') ? 'Wert erforderlich' :
//         this.neueSchulklasseForm.hasError('minlength') ? 'Name zu kurz' :
//             '';
//   }


//   onSelect(klasse: Schulklasse): void {
//     debugger;
//     this.selectedRegel = klasse;


//   }
//   deleteSchulklasse(klasse: Schulklasse):void{
//     this.klassenToPerson = this.klassenToPerson.filter(
//       item =>
//         item.id !== klasse.id);
//     this.selectedRegel = null;
//     this.savingIsActiv = true;

//   }

//   addSchulklasse(): void {
//     debugger;
//     this.maximalKlassenId++;
//     var neueKlasseTmp = new Schulklasse();
//     neueKlasseTmp.name = this.neueSchulklasseName;
//     neueKlasseTmp.id = this.maximalKlassenId;
//     neueKlasseTmp.schueler = new Array<Schueler>();
//     this.klassenToPerson.push(neueKlasseTmp);
//     neueKlasseTmp = null;
//     this.selectedRegel = null;
//     this.savingIsActiv = true;
//     this.neueSchulklasseName = null;

//     this.neueSchulklasseForm.markAsPristine();
//     this.neueSchulklasseForm.markAsUntouched();
//     this.neueSchulklasseForm.updateValueAndValidity();

//   }

//   updateSchulklasse(updatedKlasse: Schulklasse): void {
//     debugger;
//     this.klassenToPerson = this.klassenToPerson.filter(
//       item =>
//         item.id !== updatedKlasse.id)
//     if (typeof this.klassenToPerson == 'undefined') {
//       console.log("klassenToPerson is undefined");
//     }
//     else {
//       this.klassenToPerson.push(updatedKlasse);
//     }
//     this.savingIsActiv = true;
//   }

  
//   async saveSchulklasseSchueler(): Promise<void> {
//     debugger;
//     this.savingIsActiv = false; 
//     this.isSaving = true;this.savingIsActiv
//     // this.personDbHelper.savePerson();
//     await this.klassenService.updateKlassenAndSchueler(this.klassenToPerson).subscribe(() => this.isSaving = false);
//   }

//   canDeactivate(){
//     debugger;
//     return !this.savingIsActiv;
//   }

  ngOnInit(){
    debugger;
    
    this.isLoading = true;
    this.getRegelnToPerson();

  }

 

}
