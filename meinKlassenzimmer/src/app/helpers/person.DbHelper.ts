import { Person } from "app/models/person";
import { PersonService } from "app/services/person.service";
import { AuthService } from 'app/services/auth/auth.service';
import { Injectable } from "@angular/core";


@Injectable()
export class PersonDbHelper {
  
  
 

  
  constructor(private personService: PersonService, private auth: AuthService) {
  }
  

  personNeedInsert = true;
  personData : Person;

    getPerson() {
    
      this.personService.getPerson().subscribe(data => {
        if(data['Person'].length >0){
          console.log("Anzahl geladene Personen");
          console.log(data['Person'].length);
          this.personNeedInsert = false;
        }
      })
    }
     savePerson(){
      this.auth.getProfile((err, profile) => {
        debugger;
        this.personData = new Person();
        this.personData.id = profile.sub.split('|')[1];
        this.personData.geschlecht = profile.gender;
        this.personData.name = profile.family_name;
        this.personData.vorname = profile.given_name;
        this.personData.nickname = profile.nickname;
        console.log("SavingPersonData");
        console.log(this.personData);
        console.log("Insert of Person?");
        console.log(this.personNeedInsert);
        if(this.personNeedInsert){
          this.personService.createPerson(this.personData);
          this.personNeedInsert = false;

        }else{
          this.personService.updatePerson(this.personData);
          

        }


    })
      

    }




   








}