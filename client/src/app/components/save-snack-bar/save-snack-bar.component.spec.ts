import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaveSnackBarComponent } from './save-snack-bar.component';

describe('SaveSnackBarComponent', () => {
  let component: SaveSnackBarComponent;
  let fixture: ComponentFixture<SaveSnackBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveSnackBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
