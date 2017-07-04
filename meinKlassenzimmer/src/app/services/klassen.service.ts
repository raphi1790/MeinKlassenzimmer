import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Klasse } from '../models/klasse';

@Injectable()
export class KlassenService {

  private klassenUrl = 'api/klassen';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'})
  
  constructor(private http: Http) { }

  getKlassenByPersonid(): Promise<Klasse[]> {
    return this.http.get(this.klassenUrl)
      .toPromise()
      .then(response => response.json().data as Klasse[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  create(name: string): Promise<Klasse> {
    return this.http
      .post(this.klassenUrl, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Klasse)
      .catch(this.handleError);
  }

}