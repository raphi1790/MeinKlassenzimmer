import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }from '@angular/router';

import { AppRoutingModule} from './app-routing-module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VerwaltungComponent } from './verwaltung/verwaltung.component';
import { KlassenComponent } from './klassen/klassen.component';
import { SchulzimmerComponent } from './schulzimmer/schulzimmer.component';

import { SitzordnungComponent } from './sitzordnung/sitzordnung.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { StartseiteComponent } from './startseite/startseite.component'
import { KlassenService} from './klassen.service';
import { SchuelerService} from './schueler.service';
import { SchuelerComponent } from './schueler/schueler.component';

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
    SchuelerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ],
  providers: [KlassenService, SchuelerService, KlassenComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
