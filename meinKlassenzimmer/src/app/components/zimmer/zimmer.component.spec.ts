import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimmerComponent } from './zimmer.component';

describe('ZimmerComponent', () => {
  let component: ZimmerComponent;
  let fixture: ComponentFixture<ZimmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZimmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
