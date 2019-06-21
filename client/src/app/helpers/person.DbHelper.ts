import { Person } from "../models/person";
import { PersonService } from "../services/person.service";
import { AuthService } from '../services/auth/auth.service';
import { Injectable } from "@angular/core";


@Injectable()
export class PersonDbHelper {



  constructor(private personService: PersonService, private auth:AuthService) {
  }


  personNeedInsert = true;
  personData: Person;

  getPerson() {

    this.personService.getPerson().subscribe(data => {
      if (data['Person'].length > 0) {
        console.log("Anzahl geladene Personen");
        console.log(data['Person'].length);
        this.personNeedInsert = false;
      }
    })
  }
  savePerson() {

    this.getPersonDataFromToken();
       console.log("SavingPersonData");
      console.log(this.personData);
      console.log("Insert of Person?");
      console.log(this.personNeedInsert);
      if (this.personNeedInsert) {
        this.personService.createPerson(this.personData);
        this.personNeedInsert = false;

      } else {
        this.personService.updatePerson(this.personData);


      }


    
  }
  getPersonDataFromToken() {
    var userToken =  this.auth.authState.
    this.personData = new Person();
    console.log("UserToken");
    console.log(userToken);
   

  }
















}