import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }from '@angular/router';

import { AppRoutingModule} from './routes/app-routing-module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VerwaltungComponent } from './components/verwaltung/verwaltung.component';
import { KlassenComponent } from './components/klassen/klassen.component';
import { SchulzimmerComponent } from './components/schulzimmer/schulzimmer.component';

import { SitzordnungComponent } from './components/sitzordnung/sitzordnung.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { StartseiteComponent } from './components/startseite/startseite.component'
import { KlassenService} from './services/klassen.service';
import { SchuelerService} from './services/schueler.service';
import { SchuelerComponent } from './components/schueler/schueler.component';
import {InlineEditorModule} from 'ng2-inline-editor';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    VerwaltungComponent,
    KlassenComponent,
    SchulzimmerComponent,
    SitzordnungComponent,
    WrapperComponent,
    StartseiteComponent,
    SchuelerComponent,
    InlineEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule,
    FormsModule,
    InlineEditorModule
  ],
  providers: [KlassenService, SchuelerService, KlassenComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
