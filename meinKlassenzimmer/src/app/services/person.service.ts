import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { Person } from '../models/person';
import { AuthService } from 'app/services/auth/auth.service';
import { HttpHeaderResponse } from '@angular/common/http/src/response';


@Injectable()
export class PersonService {

  private personUrl = 'api/person';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' })


  constructor(private http: HttpClient, private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  getPerson() {
    debugger;
    return this.http
      .get<Person>(this.personUrl, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      }).catch(this._handleError);
  }

  createPerson(neuePerson: Person): void {
    const body = { name: neuePerson.name, vorname: neuePerson.vorname, nickname: neuePerson.nickname, geschlecht: neuePerson.geschlecht  };
    const req = this.http.post(this.personUrl, body, {
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
