import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KlassenlisteComponent } from './klassenliste.component';

describe('KlassenlisteComponent', () => {
  let component: KlassenlisteComponent;
  let fixture: ComponentFixture<KlassenlisteComponent>;

  beforeEach(async(() => {
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
