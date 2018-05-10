import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TischVereinfachtComponent } from './tisch-vereinfacht.component';

describe('TischVereinfachtComponent', () => {
  let component: TischVereinfachtComponent;
  let fixture: ComponentFixture<TischVereinfachtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TischVereinfachtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TischVereinfachtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
