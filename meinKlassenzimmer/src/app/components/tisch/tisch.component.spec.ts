import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TischComponent } from './tisch.component';

describe('TischComponent', () => {
  let component: TischComponent;
  let fixture: ComponentFixture<TischComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TischComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TischComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
