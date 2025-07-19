import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  providers: [AuthService]
})
export class ToolbarComponent{
  
  constructor(public auth: AuthService) {}

  showEmail(){
    if (environment.production){
      if (this.auth.authState !== undefined){
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
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }


}
