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
import { AuthService} from './services/auth/auth.service';
import { SchuelerComponent } from './components/schueler/schueler.component';
import { AnleitungComponent } from './components/anleitung/anleitung.component';
import { InlineEditSmallComponent} from './components/inline-edit-small/inline-edit-small.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from '../environments/environment';
import { UnsavedGuard } from './helpers/guards/unsaved.guard';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { RegelnComponent } from './components/regeln/regeln.component';
import { RegelDialogComponent} from './components/regel-dialog/regel-dialog.component';
import { InfoDialogComponent} from './components/info-dialog/info-dialog.component';
import { AuthGuard } from './helpers/guards/auth.guard';
import { UserService } from './services/user.service';
import { TimerComponent } from './components/timer/timer.component';
import {ZufallsgeneratorComponent} from './components/zufallsgenerator/zufallsgenerator.component';
import {SaveSnackBarComponent} from './components/save-snack-bar/save-snack-bar.component';
import { CountdownModule } from 'ngx-countdown';
import { DummyService } from './services/dummy.service';
import {ListenverwaltungComponent} from './components/listenverwaltung/listenverwaltung.component';
import {KlassenlisteComponent} from './components/klassenliste/klassenliste.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SitzordnungManagementComponent } from './components/sitzordnung-management/sitzordnung.management.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { DataService } from './services/data.service';
import { BoxComponent } from './components/box/box.component';


@NgModule({
  declarations: [
    AppComponent,
    SchulklassenComponent,
    SchulzimmerComponent,
    SitzordnungComponent,
    StartseiteComponent,
    SchuelerComponent,
    ToolbarComponent,
    AnleitungComponent,
    RegelnComponent,
    SpeichernComponent,
    SpeichernInfoDialogComponent,
    RegelDialogComponent,
    TimerComponent,
    ZufallsgeneratorComponent,
    SaveSnackBarComponent,
    ListenverwaltungComponent,
    KlassenlisteComponent,
    InlineEditSmallComponent,
    InfoDialogComponent,
    SitzordnungManagementComponent,
    BoxComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    CountdownModule,
    DragDropModule,
    ScrollingModule

  ],
  providers: [ AuthService,
    {
      provide: DataService, 
      useClass: environment.production? UserService: DummyService
    },
    ,
    UnsavedGuard,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:  AuthInterceptor,
      multi: true,
   }


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
