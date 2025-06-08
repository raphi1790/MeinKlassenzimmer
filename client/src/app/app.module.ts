import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { MatChipsModule } from '@angular/material/chips'; // Explicit import now handled by generated list
/* import {MaterialModule} from './material.module'; */ // This was already commented by the script
/* import {MaterialModule} from './material.module'; */ // Ensuring this is commented
/* import {MaterialModule}from './material.module'; */ // Actual line to comment
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
    BrowserAnimationsModule,
    CdkTableModule,
    // FormsModule, // Removed duplicate, it's imported below already
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule, // Ensuring comma
    MatChipsModule,    // Ensuring comma
    MatDatepickerModule, // Ensuring comma
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
/*
    MaterialModule,
 */
    // MatChipsModule, // Explicit import - will rely on the one from the generated list
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
