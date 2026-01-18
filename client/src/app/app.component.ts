import { Component} from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import {environment} from '../environments/environment'
import { AutoSaveService } from './services/auto-save.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,})
export class AppComponent {

  constructor(public auth: AuthService, private autoSaveService: AutoSaveService) {
    console.log(environment.production? "production": "dev")
    
      
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
  deployTag = environment.deployTag;

  
}

