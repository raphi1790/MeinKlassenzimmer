import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KlassenlistenInfoDialogComponent } from './klassenlisten-info-dialog.component';

describe('KlassenlistenInfoDialogComponent', () => {
  let component: KlassenlistenInfoDialogComponent;
  let fixture: ComponentFixture<KlassenlistenInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KlassenlistenInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlassenlistenInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
