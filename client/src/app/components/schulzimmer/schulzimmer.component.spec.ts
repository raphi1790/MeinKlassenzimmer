import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchulzimmerComponent } from './schulzimmer.component';

describe('SchulzimmerComponent', () => {
  let component: SchulzimmerComponent;
  let fixture: ComponentFixture<SchulzimmerComponent>;

  beforeEach(waitForAsync(() => {
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
