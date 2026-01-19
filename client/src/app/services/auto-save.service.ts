import { Injectable, inject } from '@angular/core';
import { Subject, timer, from, EMPTY } from 'rxjs';
import { debounce, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { DataService } from './data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveSnackBarComponent } from '../components/save-snack-bar/save-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  private userChanges = new Subject<User>();
  private dataService = inject(DataService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.userChanges.pipe(
      debounce(() => timer(2000)), // Wait for 2s of inactivity
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(user =>
        from(this.dataService.updateUser(user)).pipe(
          tap(() => this.showSavedIndicator()),
          catchError(error => {
            console.error('Auto-save failed:', error);
            this.showErrorIndicator();
            return EMPTY; // Continue the stream
          })
        )
      )
    ).subscribe();
  }

  notifyUserChange(user: User) {
    // Deep copy to prevent mutation issues
    this.userChanges.next(JSON.parse(JSON.stringify(user)));
  }

  private showSavingIndicator() {
    this.snackBar.openFromComponent(SaveSnackBarComponent, {
      data: { message: 'Speichern...', status: 'saving' },
    });
  }

  private showSavedIndicator() {
    this.snackBar.dismiss();
    this.snackBar.openFromComponent(SaveSnackBarComponent, {
      data: { message: 'Gespeichert', status: 'saved' },
      duration: 1000,
    });
  }

  private showErrorIndicator() {
    this.snackBar.dismiss();
    this.snackBar.openFromComponent(SaveSnackBarComponent, {
      data: { message: 'Speichern fehlgeschlagen', status: 'error' },
      duration: 5000,
    });
  }
}
