import { Component} from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { User } from './models/user';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthService) {
    
      
  }

  opened: boolean;
  showTools = false;
  showVerwaltung = false;


  toggleToolsMenu() {
    this.showTools = !this.showTools;
 }
 toggleVerwaltungMenu(){
  this.showVerwaltung = !this.showVerwaltung;
 }

  title = 'app';

  
}

