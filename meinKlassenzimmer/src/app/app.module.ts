import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule }from '@angular/router';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule} from './routes/app-routing-module';


import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { KlassenComponent } from './components/klassen/klassen.component';
import { SchulzimmerComponent } from './components/schulzimmer/schulzimmer.component';
import { ZimmerComponent } from './components/zimmer/zimmer.component';

import { SitzordnungComponent } from './components/sitzordnung/sitzordnung.component';
import { StartseiteComponent } from './components/startseite/startseite.component'
import { KlassenService} from './services/klassen.service';
import { PersonService} from './services/person.service';
import { SchulzimmerService} from './services/schulzimmer.service';
import { AuthService} from './services/auth/auth.service';


import { SchuelerComponent } from './components/schueler/schueler.component';
import { InlineEditorModule} from 'ng2-inline-editor';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PingComponent } from './components/ping/ping.component';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { HttpClient, HttpClientModule } from '@angular/common/http';


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('access_token')),
    globalHeaders: [{'Content-Type': 'application/json'}],
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    KlassenComponent,
    SchulzimmerComponent,
    SitzordnungComponent,
    StartseiteComponent,
    SchuelerComponent,
    InlineEditComponent,
    NavbarComponent,
    ZimmerComponent,
    ToolbarComponent,
    CallbackComponent,
    ProfileComponent,
    PingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    InlineEditorModule,
    BrowserAnimationsModule

  ],
  providers: [PersonService,KlassenService,SchulzimmerService,
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
