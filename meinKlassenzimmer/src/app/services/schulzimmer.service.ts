import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Schulzimmer } from '../models/schulzimmer';

@Injectable()
export class SchulzimmerService {

    private schulzimmerUrl = 'api/schulzimmer';  // URL to web api
    private zimmerUrl = 'api/zimmer';  // URL to web api
    private headers = new Headers({ 'Content-Type': 'application/json' })


    constructor(private http: Http) { }

    getSchulzimmerByPersonid(): Promise<Schulzimmer[]> {
        return this.http.get(this.schulzimmerUrl)
            .toPromise()
            .then(response => response.json().data as Schulzimmer[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getZimmerByPersonid(): Promise<Schulzimmer[]> {
        return this.http.get(this.zimmerUrl)
            .toPromise()
            .then(response => response.json().data as Schulzimmer[])
            .catch(this.handleError);
    }

    createSchulzimmer(name: string): Promise<Schulzimmer> {
        return this.http
            .post(this.schulzimmerUrl, JSON.stringify({ name: name }), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data as Schulzimmer)
            .catch(this.handleError);
    }
}