import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListenverwaltungComponent } from './listenverwaltung.component';
import { DataService } from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { User } from '../../models/user';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockDataService {
  mapUser() {
    return of(new User({ uid: 'test-uid', email: 'test@test.com', displayName: 'Test User', photoURL: '', schulklassen: [], klassenlisten: [], regeln: [] }));
  }
  updateUser() {
    //
  }
}

describe('ListenverwaltungComponent', () => {
  let component: ListenverwaltungComponent;
  let fixture: ComponentFixture<ListenverwaltungComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [ ListenverwaltungComponent ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: MatSnackBar, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListenverwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
