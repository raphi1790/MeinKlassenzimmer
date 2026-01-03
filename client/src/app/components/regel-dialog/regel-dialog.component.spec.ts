import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegelDialogComponent } from './regel-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Regel } from 'src/app/models/regel';
import { SelectionModel } from '@angular/cdk/collections';

describe('RegelDialogComponent', () => {
  let component: RegelDialogComponent;
  let fixture: ComponentFixture<RegelDialogComponent>;
  let dialogRef: MatDialogRef<RegelDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [RegelDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } }, // Mock MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {
          input: new MatTableDataSource<Regel>([(() => {
            const regel = new Regel();
            regel.id = '1';
            regel.beschreibung = 'Testregel';
            return regel;
          })()]),
          output: new SelectionModel<Regel>(true, [])
        } } // Mock MAT_DIALOG_DATA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegelDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when confirm is called', () => {
    spyOn(dialogRef, 'close');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should select all rows when masterToggle is called and not all are selected', () => {
    spyOn(component.selection, 'select');
    component.masterToggle();
    expect(component.selection.select).toHaveBeenCalledWith(component.data.input.data[0]);
  });
});
