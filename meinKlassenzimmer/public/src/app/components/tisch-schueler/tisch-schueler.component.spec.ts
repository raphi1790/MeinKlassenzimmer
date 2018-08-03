import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TischSchuelerComponent } from './tisch-schueler.component';

describe('TischSchuelerComponent', () => {
  let component: TischSchuelerComponent;
  let fixture: ComponentFixture<TischSchuelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TischSchuelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TischSchuelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
