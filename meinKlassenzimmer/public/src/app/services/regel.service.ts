import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { AuthService } from 'app/services/auth/auth.service';
import * as CONFIG from '../../config.json';
import { SchuelerPreparer } from '../helpers/schueler.preparer';
import { Regel } from '../models/regel';




@Injectable()
export class RegelService {

  private regelnUrl = (<any>CONFIG).api.concat("/api/regel");  // URL to web api;


  constructor(private http: HttpClient, private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('tokenId')}`;
  }


  getRegelByPersonid() {
    return this.http
      .get<Regel[]>(this.regelnUrl,
        {
          headers: new HttpHeaders({'Content-Type':  'application/json', 'Authorization': this._authHeader})
        }

    ).map(data => {
      debugger;
      console.log("Geladene Regeln:");
      console.log( data['Regeln']);
      var regelnToPerson = new Array<Regel>();
      for (let indexRegel = 0; indexRegel < data['Regeln'].length; indexRegel++) {
        debugger;
        regelnToPerson[indexRegel] = new Regel();
        regelnToPerson[indexRegel].id = data['Regel'][indexRegel].Id;
        regelnToPerson[indexRegel].personId = data['Schulklassen'][indexRegel].PersonId;
        regelnToPerson[indexRegel].type = data['Schulklassen'][indexRegel].Type;
        regelnToPerson[indexRegel].beschreibung = data['Schulklassen'][indexRegel].Beschreibung;
        regelnToPerson[indexRegel].tischId = data['Schulklassen'][indexRegel].TischId;
        regelnToPerson[indexRegel].schueler1Id = data['Schulklassen'][indexRegel].Schueler1Id;
        regelnToPerson[indexRegel].schueler2Id = data['Schulklassen'][indexRegel].Schueler2Id;
        regelnToPerson[indexRegel].active = true;
        
      }
      console.log(regelnToPerson);
      return regelnToPerson;
      
    }).catch(this._handleError)
  

  }
  // updateKlassenAndSchueler(neueSchulklassen: Schulklasse[]): Observable<Schulklasse[]> {
  //   debugger;
  //   var prepareSchueler = new SchuelerPreparer();
  //   neueSchulklassen.forEach(element => { 
      
  //     element.schueler = prepareSchueler.prepareSchuelerNameKurz(element.schueler);
  //   });
  //   const body = neueSchulklassen;
  //   return this.http.post(this.regelnUrl, body, {
  //     headers: new HttpHeaders().set('Authorization', this._authHeader)
  //   }).catch(this._handleError)
       
  // };

  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return Observable.throw(errorMsg);
  }

}