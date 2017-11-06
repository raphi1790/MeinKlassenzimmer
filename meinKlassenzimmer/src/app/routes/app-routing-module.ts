import { NgModule } from '@angular/core';
import {RouterModule, Routes}from '@angular/router';

import {VerwaltungComponent} from '../components/verwaltung/verwaltung.component';
import {KlassenComponent} from '../components/klassen/klassen.component';
import {SchulzimmerComponent} from'../components/schulzimmer/schulzimmer.component';
import {SitzordnungComponent} from '../components/sitzordnung/sitzordnung.component'
import {StartseiteComponent} from '../components/startseite/startseite.component';
import {ProfileComponent} from '../components/profile/profile.component';
import {CallbackComponent} from '../components/callback/callback.component';
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
      { 
          path: 'profile', 
          component: ProfileComponent 
      },
      {   path: 'callback', 
          component: CallbackComponent
      }
    

    ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}