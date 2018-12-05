import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegelDetailComponent } from './regel-detail.component';

describe('RegelDetailComponent', () => {
  let component: RegelDetailComponent;
  let fixture: ComponentFixture<RegelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
