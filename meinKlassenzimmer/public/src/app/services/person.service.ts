import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { Person } from '../models/person';
import { AuthService } from 'app/services/auth/auth.service';
import { HttpHeaderResponse } from '@angular/common/http/src/response';

var CONFIG = require('../../../config.json');


@Injectable()
export class PersonService {

  private personUrl = CONFIG.api.concat("/api/person");  // URL to web api;

  private headers = new Headers({ 'Content-Type': 'application/json' })


  constructor(private http: HttpClient, private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  getPerson(): Observable<any> {
    debugger
    return this.http
      .get(this.personUrl,
        {
          headers: new HttpHeaders({'Content-Type':  'application/json', 'Authorization': this._authHeader})
        }

    ).catch(this._handleError);

  }

  createPerson(newPerson: Person): void {
    const body = { name: newPerson.name, vorname: newPerson.vorname, nickname: newPerson.nickname, geschlecht: newPerson.geschlecht  };
    const req = this.http.post(this.personUrl, body, {
      headers: new HttpHeaders().set('Authorization', this._authHeader),
    })
    req.subscribe();
  }
  updatePerson(modifiedPerson: Person): void {
    const url = `${this.personUrl}/${modifiedPerson.id}`
    const body = { name: modifiedPerson.name, vorname: modifiedPerson.vorname, nickname: modifiedPerson.nickname, geschlecht: modifiedPerson.geschlecht  };
    const req = this.http.put(url, body, {
      headers: new HttpHeaders().set('Authorization', this._authHeader),
    })
    req.subscribe();
    

  }

  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return Observable.throw(errorMsg);
  }

}
