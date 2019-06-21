import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { AuthService } from '../services/auth/auth.service';
import * as CONFIG from '../../config.json';
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
        regelnToPerson[indexRegel].id = data['Regeln'][indexRegel].Id;
        regelnToPerson[indexRegel].personId = data['Regeln'][indexRegel].PersonId;
        regelnToPerson[indexRegel].type = data['Regeln'][indexRegel].Type;
        regelnToPerson[indexRegel].beschreibung = data['Regeln'][indexRegel].Beschreibung;
        regelnToPerson[indexRegel].tischId = data['Regeln'][indexRegel].TischId;
        regelnToPerson[indexRegel].schueler1Id = data['Regeln'][indexRegel].Schueler1Id;
        regelnToPerson[indexRegel].schueler2Id = data['Regeln'][indexRegel].Schueler2Id;
        regelnToPerson[indexRegel].active = true;
        
      }
      console.log(regelnToPerson);
      return regelnToPerson;
      
    }).catch(this._handleError)
  

  }
  updateRegeln(neueRegeln: Regel[]): Observable<Regel[]> {
    debugger;
    const body = neueRegeln;
    return this.http.post<Regel[]>(this.regelnUrl, body, {
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