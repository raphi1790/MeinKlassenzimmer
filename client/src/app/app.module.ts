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
import { GruppeneinteilungComponent } from  './components/gruppeneinteilung/gruppeneinteilung.component';
import { AuthService} from './services/auth/auth.service';
import { SchuelerComponent } from './components/schueler/schueler.component';
import { AnleitungComponent } from './components/anleitung/anleitung.component';
import { InlineEditComponent} from './components/inline-edit/inline-edit.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TischComponent } from './components/tisch/tisch.component';
import { TischSchuelerComponent } from './components/tisch-schueler/tisch-schueler.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from '../environments/environment';
import { UnsavedGuard } from './helpers/guards/unsaved.guard';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { RegelnComponent } from './components/regeln/regeln.component';
import { EinteilungInfoDialogComponent} from './components/einteilung-info-dialog/einteilung-info-dialog.component';
import { RegelInfoDialogComponent} from './components/regel-info-dialog/regel-info-dialog.component';
import { AuthGuard } from './helpers/guards/auth.guard';
import { UserService } from './services/user.service';
import { TimerComponent } from './components/timer/timer.component';
import {ZufallsgeneratorComponent} from './components/zufallsgenerator/zufallsgenerator.component';
import {SaveSnackBarComponent} from './components/save-snack-bar/save-snack-bar.component';
import { CountdownModule } from 'ngx-countdown';
import { DummyService } from './services/dummy.service';


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
    RegelInfoDialogComponent,
    TimerComponent,
    ZufallsgeneratorComponent,
    SaveSnackBarComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,// imports firebase/auth, only needed for auth features
    AngularFirestoreModule,
    CountdownModule

  ],
  providers: [ AuthService,UserService,DummyService,
    UnsavedGuard,
    AuthGuard,
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
