import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { Klasse } from '../models/klasse';
import { Schueler } from '../models/schueler';
import { AuthService } from 'app/services/auth/auth.service';
import { HttpHeaderResponse } from '@angular/common/http/src/response';


@Injectable()
export class KlassenService {

  private klassenUrl = 'api/schulklasse';  // URL to web api
  private schuelerUrl = 'api/schueler';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' })


  constructor(private http: HttpClient, private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  getKlassenByPersonid(): Observable<Klasse[]> {

    return this.http
      .get(this.klassenUrl, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)

      }).catch(this._handleError);
  }

  createKlasseToPersonid(neueKlasse: Klasse): void {
    const body = { name: neueKlasse.name };
    const req = this.http.post(this.klassenUrl, body, {
      headers: new HttpHeaders().set('Authorization', this._authHeader),
    })
    req.subscribe();

  };

  deleteKlasseToPersonid(deletedKlasseid: number): void {
    const url = `${this.klassenUrl}/${deletedKlasseid}`
    const req = this.http.delete(url, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      });
     req.subscribe(); 
  }

  getSchuelerByPersonid(): Observable<Schueler[]> {

    return this.http.get(this.schuelerUrl, {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    }).catch(this._handleError);

  }
  createSchuelerToKlassenid(neuerSchueler: Schueler): void {
    const body = {klassenid: neuerSchueler.klassenid, vorname: neuerSchueler.vorname, name: neuerSchueler.name}
    const req = this.http
      .post(this.schuelerUrl, body,
      { headers: new HttpHeaders().set('Authorization', this._authHeader) });
    req.subscribe();

  }

  deleteSchuelerToKlassenid(deletedSchuelerid: number): void {
    const url = `${this.schuelerUrl}/${deletedSchuelerid}`
    const req = this.http
      .delete(url, { headers: new HttpHeaders().set('Authorization', this._authHeader) });
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