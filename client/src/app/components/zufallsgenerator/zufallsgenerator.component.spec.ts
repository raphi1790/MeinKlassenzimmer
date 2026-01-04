import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Schulklasse } from '../../models/schulklasse';
import { Schueler } from '../../models/schueler';
import { User } from '../../models/user';
import { ZufallsgeneratorComponent } from './zufallsgenerator.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockDataService {
  mapUser() {
    const schueler1 = new Schueler({ id: '1', vorname: 'Max', name: 'Muster', schulklassenId: '1' });
    const schueler2 = new Schueler({ id: '2', vorname: 'Erika', name: 'Mustermann', schulklassenId: '1' });
    const schueler3 = new Schueler({ id: '3', vorname: 'Hans', name: 'Peter', schulklassenId: '1' });
    const schulklasse = new Schulklasse();
    schulklasse.id = '1';
    schulklasse.name = 'Test Klasse';
    schulklasse.schueler = [schueler1, schueler2, schueler3];

    const user = new User({ 
      uid: 'test-uid', 
      email: 'test@test.com', 
      displayName: 'Test User', 
      photoURL: '', 
      schulklassen: [schulklasse] 
    });
    return of(user);
  }
}

describe('ZufallsgeneratorComponent', () => {
  let component: ZufallsgeneratorComponent;
  let fixture: ComponentFixture<ZufallsgeneratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, NoopAnimationsModule],
      providers: [{ provide: DataService, useClass: MockDataService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZufallsgeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load klassenToPerson on init', () => {
    component.ngOnInit();
    expect(component.klassenToPerson.length).toBe(1);
    expect(component.klassenToPerson[0].name).toBe('Test Klasse');
  });

  it('should select a specified number of students', () => {
    component.ngOnInit();
    component.selectedSchulklasse = component.klassenToPerson[0];
    component.selectedNumberSchuelerInput = 2;
    component.selectInputNumberSchueler();
    expect(component.selectedSchueler.length).toBe(2);
  });

  it('should select students from the correct class', () => {
    component.ngOnInit();
    component.selectedSchulklasse = component.klassenToPerson[0];
    component.selectedNumberSchuelerInput = 3;
    component.selectInputNumberSchueler();
    
    const selectedIds = component.selectedSchueler.map(s => s.id);
    const originalIds = component.selectedSchulklasse.schueler.map(s => s.id);
    
    selectedIds.forEach(id => {
      expect(originalIds).toContain(id);
    });
  });

  it('should handle selecting more students than available', () => {
    component.ngOnInit();
    component.selectedSchulklasse = component.klassenToPerson[0];
    component.selectedNumberSchuelerInput = 5; // More than in the mock
    component.selectInputNumberSchueler();
    expect(component.selectedSchueler.length).toBe(3); // Should select all available students
  });
});
