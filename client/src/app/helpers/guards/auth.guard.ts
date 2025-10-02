import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService} from '../../services/auth/auth.service'
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
    if (!environment.production) {
      return new BehaviorSubject(true);
    }

    // Use Firebase authState directly instead of Firestore user document
    return this.auth.afAuth.authState.pipe(
      take(1),
      map(user => !!user), // Check if Firebase Auth user exists
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('access denied - not authenticated in Firebase Auth');
          this.router.navigate(['/']);
        } else {
          console.log('access granted - authenticated in Firebase Auth');
        }
      })
    );
  }
}