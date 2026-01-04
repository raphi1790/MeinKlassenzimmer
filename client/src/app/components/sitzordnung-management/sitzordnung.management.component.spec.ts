import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SitzordnungManagementComponent } from './sitzordnung.management.component';
import { DataService } from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { User } from '../../models/user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { Schulklasse } from '../../models/schulklasse';
import { Schulzimmer } from '../../models/schulzimmer';

class MockDataService {
  mapUser() {
    return of(new User({ uid: 'test-uid', email: 'test@test.com', displayName: 'Test User', photoURL: '', schulklassen: [], schulzimmer: [], sitzordnungen: [] }));
  }
  updateUser() {
    //
  }
}

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true),
      componentInstance: {
        submitClicked: of({ selected: [] })
      }
    };
  }
}

describe('SitzordnungManagementComponent', () => {
  let component: SitzordnungManagementComponent;
  let fixture: ComponentFixture<SitzordnungManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [SitzordnungManagementComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatSnackBar, useValue: {} },
        { provide: MatDialog, useClass: MatDialogMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitzordnungManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new Sitzordnung', () => {
    // Arrange
    component.ngOnInit(); // Load initial user data
    expect(component.sitzordnungenToPerson.length).toBe(0);
    component.selectedSitzordnungNameInput = 'Neue Test Sitzordnung';
    
    // Correct instantiation for Schulklasse
    const mockSchulklasse = new Schulklasse();
    mockSchulklasse.id = 'sk1';
    mockSchulklasse.name = 'Test Klasse';
    component.selectedSchulklasse = mockSchulklasse;

    // Correct instantiation for Schulzimmer
    const mockSchulzimmer = new Schulzimmer();
    mockSchulzimmer.id = 'sz1';
    mockSchulzimmer.name = 'Test Zimmer';
    component.selectedSchulzimmer = mockSchulzimmer;

    component.createFormControls();
    component.createForm();
    component.myListForm.controls['name'].setValue(component.selectedSitzordnungNameInput);
    component.myListForm.controls['klasse'].setValue(component.selectedSchulklasse);
    component.myListForm.controls['zimmer'].setValue(component.selectedSchulzimmer);

    // Act
    component.createSitzordnung();

    // Assert
    expect(component.sitzordnungenToPerson.length).toBe(1);
    expect(component.sitzordnungenToPerson[0].name).toBe('Neue Test Sitzordnung');
    expect(component.savingIsActiv).toBe(true);
  });
});
