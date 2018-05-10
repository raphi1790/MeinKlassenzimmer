import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { Schulklasse } from '../models/schulklasse';
import { Schueler } from '../models/schueler';
import { AuthService } from 'app/services/auth/auth.service';
import { HttpHeaderResponse, HttpResponse } from '@angular/common/http/src/response';
import { Response } from 'express';



@Injectable()
export class SchulklassenService {

  private klassenUrl = 'api/schulklasse';  // URL to web api
 



  constructor(private http: HttpClient, private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }


  getKlassenAndSchuelerByPersonid() {
    return this.http
      .get<Schulklasse[]>(this.klassenUrl,
        {
          headers: new HttpHeaders({'Content-Type':  'application/json', 'Authorization': this._authHeader})
        }

    ).map(data => {
      debugger;
      console.log("Geladene Schulklassen:");
      console.log( data['Schulklassen']);
      console.log("Geladene Schueler:");
      console.log(data['Schueler']);
      var klassenToPerson = new Array<Schulklasse>();
      for (let indexKlasse = 0; indexKlasse < data['Schulklassen'].length; indexKlasse++) {
        debugger;
        klassenToPerson[indexKlasse] = new Schulklasse();
        klassenToPerson[indexKlasse].id = data['Schulklassen'][indexKlasse].Id;
        klassenToPerson[indexKlasse].personid = data['Schulklassen'][indexKlasse].PersonId;
        klassenToPerson[indexKlasse].name = data['Schulklassen'][indexKlasse].Name;
        klassenToPerson[indexKlasse].schueler = new Array<Schueler>();
        for (let indexSchueler = 0; indexSchueler < data['Schueler'].length; indexSchueler++) {
          if (klassenToPerson[indexKlasse].id == data['Schueler'][indexSchueler].SchulklassenId) {
            debugger;
            var schueler = new Schueler();
            schueler.id = data['Schueler'][indexSchueler].Id
            schueler.name = data['Schueler'][indexSchueler].Name;
            schueler.vorname = data['Schueler'][indexSchueler].Vorname;
            klassenToPerson[indexKlasse].schueler.push(schueler);
          }
        }
      }
      console.log(klassenToPerson);
      return klassenToPerson;
      
    }).catch(this._handleError)
  

  }
  updateKlassenAndSchueler(neueSchulklassen: Schulklasse[]): Observable<Schulklasse[]> {
    debugger;
    const body = neueSchulklassen;
    return this.http.post(this.klassenUrl, body, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    }).catch(this._handleError)
       
  };

  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return Observable.throw(errorMsg);
  }

}