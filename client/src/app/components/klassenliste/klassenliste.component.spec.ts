import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KlassenlisteComponent } from './klassenliste.component';

describe('KlassenlisteComponent', () => {
  let component: KlassenlisteComponent;
  let fixture: ComponentFixture<KlassenlisteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KlassenlisteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlassenlisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
