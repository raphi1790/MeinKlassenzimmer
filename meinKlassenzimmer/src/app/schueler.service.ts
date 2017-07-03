import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Klasse } from './models/klasse';
import { Schueler  } from './models/schueler';

@Injectable()
export class SchuelerService {

  private schuelerUrl = 'api/schueler';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'})
  
  constructor(private http: Http) { }


  getSchuelerByPersonid(): Promise<Schueler[]> {
    console.log("service");
    return this.http.get(this.schuelerUrl)
      .toPromise()
      .then(
        response => 
          response.json().data as Schueler[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

    create(vorname: string, name: string): Promise<Schueler> {
    return this.http
      .post(this.schuelerUrl, JSON.stringify({vorname: vorname, name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data as Schueler)
      .catch(this.handleError);
  }




}