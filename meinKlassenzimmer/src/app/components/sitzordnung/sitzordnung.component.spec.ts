import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuordnungComponent } from './zuordnung.component';

describe('ZuordnungComponent', () => {
  let component: ZuordnungComponent;
  let fixture: ComponentFixture<ZuordnungComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZuordnungComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZuordnungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
