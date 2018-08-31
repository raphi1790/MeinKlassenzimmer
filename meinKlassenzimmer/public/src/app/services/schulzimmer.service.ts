import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { Schulzimmer } from '../models/schulzimmer';
import { PositionTisch } from '../models/position.tisch';
import { Tisch } from '../models/tisch';
import { AuthService } from 'app/services/auth/auth.service';
import * as CONFIG from '../../config.json';

@Injectable()
export class SchulzimmerService {

    private schulzimmerUrl = (<any>CONFIG).api.concat("/api/schulzimmer");  // URL to web api;



    constructor(private http: HttpClient, private auth: AuthService) { }

    private get _authHeader(): string {
      return `Bearer ${localStorage.getItem('tokenId')}`;
    }

  
      getSchulzimmerAndTischeByPersonid() {
        return this.http
          .get<Schulzimmer[]>(this.schulzimmerUrl,
            {
              headers: new HttpHeaders({'Content-Type':  'application/json', 'Authorization': this._authHeader})
            }
    
        ).map(
          data => {
            debugger;

            console.log("Schulzimmer " + data['Schulzimmer']);
            console.log("Tische " + data['Tische']);
            var schulzimmerToPerson = new Array<Schulzimmer>();
            for (let indexZimmer = 0; indexZimmer < data['Schulzimmer'].length; indexZimmer++) {
              schulzimmerToPerson[indexZimmer] = new Schulzimmer();
              schulzimmerToPerson[indexZimmer].id = data['Schulzimmer'][indexZimmer].Id;
              schulzimmerToPerson[indexZimmer].personid = data['Schulzimmer'][indexZimmer].PersonId;
              schulzimmerToPerson[indexZimmer].name = data['Schulzimmer'][indexZimmer].Name;
              schulzimmerToPerson[indexZimmer].tische = new Array<Tisch>();
              for (let indexTisch = 0; indexTisch < data['Tische'].length; indexTisch++) {
                if (schulzimmerToPerson[indexZimmer].id == data['Tische'][indexTisch].SchulzimmerId) {
                  debugger;
                  var tischTmp = new Tisch()
                  tischTmp.position = new PositionTisch(data['Tische'][indexTisch].RowNumber, data['Tische'][indexTisch].ColumnNumber);
                  tischTmp.active = true;
                  schulzimmerToPerson[indexZimmer].tische.push(tischTmp);
                }
              }
      
      
            }
            console.log(schulzimmerToPerson);
            return schulzimmerToPerson;
          }

        ).catch(this._handleError);
    
      }
      updateSchulzimmerAndTische(newSchulzimmer: Schulzimmer[]): Observable<Schulzimmer[]> {
        debugger;
        const body = newSchulzimmer;
        return this.http.post(this.schulzimmerUrl, body, {
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

