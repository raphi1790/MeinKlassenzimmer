import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import {MaterialModule} from './material.module'
import { AppRoutingModule} from './routes/app-routing-module';
import { AppComponent } from './app.component';
import { SchulklassenComponent } from './components/schulklassen/schulklassen.component';
import { SchulzimmerComponent } from './components/schulzimmer/schulzimmer.component';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { SitzordnungComponent } from './components/sitzordnung/sitzordnung.component';
import { StartseiteComponent } from './components/startseite/startseite.component'
import { SchulklassenService} from './services/schulklassen.service';
import { PersonService} from './services/person.service';
import { SchulzimmerService} from './services/schulzimmer.service';
import { AuthService} from './services/auth/auth.service';
import { SchuelerComponent } from './components/schueler/schueler.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CallbackComponent } from './components/callback/callback.component';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TischComponent } from './components/tisch/tisch.component';
import { TischSchuelerComponent } from './components/tisch-schueler/tisch-schueler.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    SchulklassenComponent,
    SchulzimmerComponent,
    SitzordnungComponent,
    StartseiteComponent,
    SchuelerComponent,
    ToolbarComponent,
    CallbackComponent,
    TischComponent,
    TischSchuelerComponent,
    KontaktComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule // imports firebase/auth, only needed for auth features

  ],
  providers: [SchulklassenService,SchulzimmerService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }