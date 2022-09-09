import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZufallsgeneratorComponent } from './zufallsgenerator.component';

describe('ZufallsgeneratorComponent', () => {
  let component: ZufallsgeneratorComponent;
  let fixture: ComponentFixture<ZufallsgeneratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZufallsgeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZufallsgeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
