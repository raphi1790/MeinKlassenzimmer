import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitzordnungInfoDialogComponent } from './sitzordnung-info-dialog.component';

describe('SitzordnungInfoDialogComponent', () => {
  let component: SitzordnungInfoDialogComponent;
  let fixture: ComponentFixture<SitzordnungInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitzordnungInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitzordnungInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
