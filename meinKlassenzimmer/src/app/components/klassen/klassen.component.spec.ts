import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KlassenComponent } from './klassen.component';

describe('KlassenComponent', () => {
  let component: KlassenComponent;
  let fixture: ComponentFixture<KlassenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KlassenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlassenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
