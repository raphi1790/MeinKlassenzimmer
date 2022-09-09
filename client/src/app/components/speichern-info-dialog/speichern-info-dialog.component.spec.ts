import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpeichernInfoDialogComponent } from './speichern-info-dialog.component';

describe('SpeichernInfoDialogComponent', () => {
  let component: SpeichernInfoDialogComponent;
  let fixture: ComponentFixture<SpeichernInfoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeichernInfoDialogComponent ]
    })
    .compileComponents();
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
