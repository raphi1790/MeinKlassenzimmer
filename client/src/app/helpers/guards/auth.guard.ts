import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { LoggingService } from '../../services/logging.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);
  private logger = inject(LoggingService);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Always allow in development mode
    if (!environment.production) {
      return new BehaviorSubject(true);
    }

    // Use modern Firebase authState
    return authState(this.auth).pipe(
      take(1),
      map(user => !!user), // Check if Firebase Auth user exists
      tap(loggedIn => {
        if (!loggedIn) {
          this.logger.auth('Access denied - not authenticated in Firebase Auth');
          this.router.navigate(['/']);
        } else {
          this.logger.auth('Access granted - authenticated in Firebase Auth');
        }
      })
    );
  }
}