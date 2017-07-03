import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchuelerComponent } from './schueler.component';

describe('SchuelerComponent', () => {
  let component: SchuelerComponent;
  let fixture: ComponentFixture<SchuelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchuelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchuelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
