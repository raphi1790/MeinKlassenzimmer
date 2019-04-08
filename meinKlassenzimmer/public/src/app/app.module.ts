import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from './material.module'
import { AppRoutingModule} from './routes/app-routing-module';
import { AppComponent } from './app.component';
import { SchulklassenComponent } from './components/schulklassen/schulklassen.component';
import { SchulzimmerComponent } from './components/schulzimmer/schulzimmer.component';
import { SitzordnungComponent } from './components/sitzordnung/sitzordnung.component';
import { SpeichernComponent} from './components/speichern/speichern.component';
import { SpeichernInfoDialogComponent} from './components/speichern-info-dialog/speichern-info-dialog.component'
import { StartseiteComponent } from './components/startseite/startseite.component'
import { SchulklassenService} from './services/schulklassen.service';
import { GruppeneinteilungComponent } from  './components/gruppeneinteilung/gruppeneinteilung.component';
import { SchulzimmerService} from './services/schulzimmer.service';
import { AuthService} from './services/auth/auth.service';
import { SchuelerComponent } from './components/schueler/schueler.component';
import { AnleitungComponent } from './components/anleitung/anleitung.component';
import { InlineEditComponent} from './components/inline-edit/inline-edit.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TischComponent } from './components/tisch/tisch.component';
import { TischSchuelerComponent } from './components/tisch-schueler/tisch-schueler.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { UnsavedGuard } from './helpers/guards/unsaved.guard';
import { Router } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { RegelnComponent } from './components/regeln/regeln.component';
import { RegelService } from './services/regel.service';
import { EinteilungInfoDialogComponent} from './components/einteilung-info-dialog/einteilung-info-dialog.component';
import { RegelInfoDialogComponent} from './components/regel-info-dialog/regel-info-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    SchulklassenComponent,
    SchulzimmerComponent,
    SitzordnungComponent,
    StartseiteComponent,
    SchuelerComponent,
    ToolbarComponent,
    TischComponent,
    AnleitungComponent,
    TischSchuelerComponent,
    GruppeneinteilungComponent,
    RegelnComponent,
    EinteilungInfoDialogComponent,
    SpeichernComponent,
    SpeichernInfoDialogComponent,
    InlineEditComponent,
    RegelInfoDialogComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule // imports firebase/auth, only needed for auth features

  ],
  providers: [SchulklassenService,SchulzimmerService, AuthService,RegelService, UnsavedGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:  AuthInterceptor,
      multi: true,
   }
  ],
  bootstrap: [AppComponent],
  entryComponents: [EinteilungInfoDialogComponent, SpeichernInfoDialogComponent, RegelInfoDialogComponent]
})
export class AppModule { }
