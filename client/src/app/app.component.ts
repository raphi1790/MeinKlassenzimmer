import { Component, Inject } from "@angular/core";
import { AuthService } from "./services/auth/auth.service";
import { User } from "./models/user";
import { environment } from "../environments/environment";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  isDarkTheme: boolean = false;

  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
    console.log(environment.production ? "production" : "dev");
  }

  opened: boolean;
  showTools = false;
  showVerwaltung = false;

  toggleToolsMenu() {
    this.showTools = !this.showTools;
  }
  toggleVerwaltungMenu() {
    this.showVerwaltung = !this.showVerwaltung;
  }

  changeTheme(): void {
    if (this.isDarkTheme) {
      this.document.body.classList.remove("dark-theme");
      this.isDarkTheme = false;
    } else {
      this.isDarkTheme = true;
      this.document.body.classList.add("dark-theme");
    }
  }

  title = "app";
}
