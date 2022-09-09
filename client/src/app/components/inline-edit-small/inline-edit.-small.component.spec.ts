import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InlineEditSmallComponent } from './inline-edit-small.component';

describe('InlineEditComponent', () => {
  let component: InlineEditSmallComponent;
  let fixture: ComponentFixture<InlineEditSmallComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
