import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }from '@angular/router';

import { AppRoutingModule} from './routes/app-routing-module';


import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VerwaltungComponent } from './components/verwaltung/verwaltung.component';
import { KlassenComponent } from './components/klassen/klassen.component';
import { SchulzimmerComponent } from './components/schulzimmer/schulzimmer.component';
import { ZimmerComponent } from './components/zimmer/zimmer.component';

import { SitzordnungComponent } from './components/sitzordnung/sitzordnung.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { StartseiteComponent } from './components/startseite/startseite.component'
import { KlassenService} from './services/klassen.service';
import { SchulzimmerService} from './services/schulzimmer.service';
import { AuthService} from './services/auth.service';


import { SchuelerComponent } from './components/schueler/schueler.component';
import { InlineEditorModule} from 'ng2-inline-editor';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VerwaltungComponent,
    KlassenComponent,
    SchulzimmerComponent,
    SitzordnungComponent,
    WrapperComponent,
    StartseiteComponent,
    SchuelerComponent,
    InlineEditComponent,
    NavbarComponent,
    ZimmerComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    InlineEditorModule
  ],
  providers: [KlassenService,SchulzimmerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
