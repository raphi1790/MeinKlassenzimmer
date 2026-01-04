import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpeichernInfoDialogComponent } from './speichern-info-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/*
describe('SpeichernInfoDialogComponent', () => {
  let component: SpeichernInfoDialogComponent;
  let fixture: ComponentFixture<SpeichernInfoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [SpeichernInfoDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } }, // Mock MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} } // Mock MAT_DIALOG_DATA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeichernInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
