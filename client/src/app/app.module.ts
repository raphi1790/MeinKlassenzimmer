import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CountdownModule } from 'ngx-countdown';

// MODERN Firebase imports - REMOVE old compat imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './routes/app-routing-module';
import { AppComponent } from './app.component';
import { SchulklassenComponent } from './components/schulklassen/schulklassen.component';
import { SchulzimmerComponent } from './components/schulzimmer/schulzimmer.component';
import { SitzordnungComponent } from './components/sitzordnung/sitzordnung.component';
import { StartseiteComponent } from './components/startseite/startseite.component';
import { SchuelerComponent } from './components/schueler/schueler.component';
import { AnleitungComponent } from './components/anleitung/anleitung.component';
import { InlineEditSmallComponent } from './components/inline-edit-small/inline-edit-small.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { environment } from '../environments/environment';
import { UnsavedGuard } from './helpers/guards/unsaved.guard';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { RegelnComponent } from './components/regeln/regeln.component';
import { RegelDialogComponent } from './components/regel-dialog/regel-dialog.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { UserService } from './services/user.service';
import { TimerComponent } from './components/timer/timer.component';
import { ZufallsgeneratorComponent } from './components/zufallsgenerator/zufallsgenerator.component';
import { SaveSnackBarComponent } from './components/save-snack-bar/save-snack-bar.component';
import { DummyService } from './services/dummy.service';
import { ListenverwaltungComponent } from './components/listenverwaltung/listenverwaltung.component';
import { KlassenlisteComponent } from './components/klassenliste/klassenliste.component';
import { SitzordnungManagementComponent } from './components/sitzordnung-management/sitzordnung.management.component';
import { DataService } from './services/data.service';
import { BoxComponent } from './components/box/box.component';
import { MaterialModule } from './material.module';

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
    RegelDialogComponent,
    TimerComponent,
    ZufallsgeneratorComponent,
    ListenverwaltungComponent,
    KlassenlisteComponent,
    InlineEditSmallComponent,
    InfoDialogComponent,
    SitzordnungManagementComponent,
    BoxComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    CountdownModule,
    DragDropModule,
    ScrollingModule,
    MaterialModule,
  ],
  providers: [
    // Modern Firebase providers
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    // Other providers
    {
      provide: DataService,
      useClass: environment.production ? UserService : DummyService,
    },
    UnsavedGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}