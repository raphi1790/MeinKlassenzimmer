import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchulzimmerComponent } from './schulzimmer.component';

describe('SchulzimmerComponent', () => {
  let component: SchulzimmerComponent;
  let fixture: ComponentFixture<SchulzimmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchulzimmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchulzimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
