import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegelInfoDialogComponent } from './regel-info-dialog.component';

describe('RegelInfoDialogComponent', () => {
  let component: RegelInfoDialogComponent;
  let fixture: ComponentFixture<RegelInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegelInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegelInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
