import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';


import { Klasse } from '../models/klasse';
import { Schueler  } from '../models/schueler';

@Injectable()
export class KlassenService {

  private klassenUrl = 'api/klassen';  // URL to web api
  private schuelerUrl = 'api/schueler';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'})
  
  
  constructor(private http: Http) { }

  getKlassenByPersonid(): Promise<Klasse[]> {
    return this.http.get(this.klassenUrl)
      .toPromise()
      .then(
        response =>
          {
          debugger;
          let responseObject = response.json();
          if (responseObject.Klasse) {
            return responseObject.Klasse as Klasse[];
          } 
          return [];
          }) 
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


  createKlasseToPersonid( neueKlasse: Klasse): Promise<Klasse> {
    return this.http
      .post(this.klassenUrl, JSON.stringify({personid: neueKlasse.personid, name:neueKlasse.name}), {headers: this.headers})
      .toPromise()
      .then(
        response =>
          {
          debugger;
          let responseObject = response.json();
          if (responseObject.Klasse) {
            return responseObject.Klasse as Klasse;
          } 
          return [];
          }) 
      .catch(this.handleError);
  }
   
    deleteKlasseToPersonid( deletedKlasseid: number): Promise<void> {
      const url = `${this.klassenUrl}/${deletedKlasseid}`
      return this.http
        .delete(url,  {headers: this.headers})
        .toPromise()
        .then(
          response =>
            {
            debugger;
            let responseObject = response.json();
            return [];
            }) 
        .catch(this.handleError);
    }

  getSchuelerByPersonid():Promise<Schueler[]> {
    return this.http.get(this.schuelerUrl)
      .toPromise()
      .then(
        response =>
          {
          debugger;
          let responseObject = response.json();
          if (responseObject.Schueler) {
            return responseObject.Schueler as Schueler[];
          } 
          return [];
          }) 
      .catch(this.handleError);
  }

    createSchuelerToKlassenid( neuerSchueler: Schueler): Promise<Schueler> {
    return this.http
      .post(this.schuelerUrl, JSON.stringify({klassenid: neuerSchueler.klassenid, vorname:neuerSchueler.vorname, name:neuerSchueler.name}), {headers: this.headers})
      .toPromise()
      .then(
        response =>
          {
          debugger;
          let responseObject = response.json();
          if (responseObject.Schueler) {
            return responseObject.Schueler as Schueler;
          } 
          return [];
          }) 
      .catch(this.handleError);
  }

      deleteSchuelerToKlassenid( deletedSchuelerid: number): Promise<void> {
      const url = `${this.schuelerUrl}/${deletedSchuelerid}`
      return this.http
        .delete(url,  {headers: this.headers})
        .toPromise()
        .then(
          response =>
            {
            debugger;
            let responseObject = response.json();
            return [];
            }) 
        .catch(this.handleError);
    }

}