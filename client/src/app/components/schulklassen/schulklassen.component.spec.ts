import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SchulklassenComponent } from './schulklassen.component';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { User } from '../../models/user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';

class MockDataService {
  mapUser() {
    return of(new User({ uid: 'test-uid', email: 'test@test.com', displayName: 'Test User', photoURL: '', schulklassen: [] }));
  }
  updateUser() {
    //
  }
}

describe('SchulklassenComponent', () => {
  let component: SchulklassenComponent;
  let fixture: ComponentFixture<SchulklassenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SchulklassenComponent],
      imports: [ FormsModule, ReactiveFormsModule, NoopAnimationsModule, MaterialModule ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchulklassenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new Schulklasse', () => {
    // Arrange
    component.ngOnInit(); // Load initial user data
    expect(component.klassenToPerson.length).toBe(0);
    component.neueSchulklasseName = 'Neue Testklasse';

    // Act
    component.addSchulklasse();

    // Assert
    expect(component.klassenToPerson.length).toBe(1);
    expect(component.klassenToPerson[0].name).toBe('Neue Testklasse');
    expect(component.savingIsActiv).toBe(true);
  });
});
