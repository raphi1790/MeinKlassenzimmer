import { NgModule } from '@angular/core';
import {RouterModule, Routes}from '@angular/router';

import {VerwaltungComponent} from './verwaltung/verwaltung.component';
import {KlassenComponent} from './klassen/klassen.component';
import {SchulzimmerComponent} from'./schulzimmer/schulzimmer.component';
import {SitzordnungComponent} from './sitzordnung/sitzordnung.component'
import {StartseiteComponent} from './startseite/startseite.component';

const routes: Routes = [
      
      {
        path: 'verwaltung',
        component: VerwaltungComponent
      },
      {
          path: 'verwaltung/klassen',
          component: KlassenComponent
      },
      {
          path: 'verwaltung/schulzimmer',
          component: SchulzimmerComponent
      },
      {
          path: 'home',
          component: StartseiteComponent
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full' 
      },
      { 
          path: 'sitzordnung',
          component: SitzordnungComponent
      },
    

    ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}