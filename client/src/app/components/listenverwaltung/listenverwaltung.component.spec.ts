import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListenverwaltungComponent } from './listenverwaltung.component';

describe('ZufallsgeneratorComponent', () => {
  let component: ListenverwaltungComponent;
  let fixture: ComponentFixture<ListenverwaltungComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListenverwaltungComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListenverwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
