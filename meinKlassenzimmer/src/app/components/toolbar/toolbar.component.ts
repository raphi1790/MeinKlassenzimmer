import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  providers: [AuthService]
})
export class ToolbarComponent {
  constructor(private auth: AuthService) {}
  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }
}
