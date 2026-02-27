import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
  // Removed providers: [AuthService] - this was causing separate instances!
})
export class ToolbarComponent{
  isDarkMode = false;
  
  constructor(public auth: AuthService) {
    const savedTheme = localStorage.getItem('mk-theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  showEmail(){
    if (environment.production){
      if (this.auth.authState !== null && this.auth.authState !== undefined){
        return this.auth.authState.email
      }
      else{
        return "Log In"
      }
    }else{
      return "Development"
    }
  }
  
  login() {
    console.log('🔧 Login button clicked');
    this.auth.login().then(result => {
      console.log('🔧 Login result:', result);
    });
  }

  logout() {
    this.auth.logout();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('mk-theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }
} 
