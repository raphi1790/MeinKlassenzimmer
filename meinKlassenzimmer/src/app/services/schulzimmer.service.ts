import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { Schulzimmer } from '../models/schulzimmer';
import { Tisch } from '../models/tisch';
import { AuthService } from 'app/services/auth/auth.service';
import { HttpHeaderResponse, HttpResponse } from '@angular/common/http/src/response';
import { Response } from 'express';

@Injectable()
export class SchulzimmerService {

    private schulzimmerUrl = 'api/schulzimmer';// URL to web api
    private schulzimmerAndTischeUrl = 'api/schulzimmertische';
    private tischeUrl = 'api/tisch';
    private headers = new Headers({ 'Content-Type': 'application/json' })


    constructor(private http: HttpClient, private auth: AuthService) { }

    private get _authHeader(): string {
      return `Bearer ${localStorage.getItem('access_token')}`;
    }

    getSchulzimmerByPersonid(): Observable<any> {
        return this.http
          .get(this.schulzimmerUrl,
            {
              headers: new HttpHeaders({'Content-Type':  'application/json', 'Authorization': this._authHeader})
            }
    
        ).catch(this._handleError);
    
      }

      // getSchulzimmerAndTischeByPersonid(): Observable<any> {
      //   return this.http
      //     .get(this.schulzimmerAndTischeUrl,
      //       {
      //         headers: new HttpHeaders({'Content-Type':  'application/json', 'Authorization': this._authHeader})
      //       }
    
      //   ).catch(this._handleError);
    
      // }

      getTischeBySchulzimmerId(schulzimmerId: number): Observable<any> {
        const url = `${this.tischeUrl}/${schulzimmerId}`
        return this.http
          .get(url,  
             {
            headers: new HttpHeaders({'Content-Type':  'application/json', 'Authorization': this._authHeader})
                }
        ).catch(this._handleError);
    
      }

      private _handleError(err: HttpErrorResponse | any) {
        const errorMsg = err.message || 'Error: Unable to complete request.';
        if (err.message && err.message.indexOf('No JWT present') > -1) {
          this.auth.login();
        }
        return Observable.throw(errorMsg);
      }
    

}

