import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZimmerVereinfachtComponent } from './zimmer-vereinfacht.component';

describe('ZimmerVereinfachtComponent', () => {
  let component: ZimmerVereinfachtComponent;
  let fixture: ComponentFixture<ZimmerVereinfachtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZimmerVereinfachtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZimmerVereinfachtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
