import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService} from '../../services/auth/auth.service'
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {


      return environment.production ? this.auth.user.pipe(
           take(1),
           map(user => !!user),
           tap(loggedIn => {
             if (!loggedIn) {
               console.log('access denied')
               this.router.navigate(['/']);
             }
         })) : new BehaviorSubject(true)
   
  }
}