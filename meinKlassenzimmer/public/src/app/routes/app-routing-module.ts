import { NgModule } from '@angular/core';
import {RouterModule, Routes}from '@angular/router';

import {SchulklassenComponent} from '../components/schulklassen/schulklassen.component';
import {SchulzimmerComponent} from'../components/schulzimmer/schulzimmer.component';
import {SitzordnungComponent} from '../components/sitzordnung/sitzordnung.component'
import {StartseiteComponent} from '../components/startseite/startseite.component';
import {ProfileComponent} from '../components/profile/profile.component';
import {CallbackComponent} from '../components/callback/callback.component';
import {PingComponent} from '../components/ping/ping.component';

const routes: Routes = [

      {
          path: 'verwaltung/klassen',
          component: SchulklassenComponent
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
      },
      {   path: 'ping', 
          component: PingComponent },
    

    ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}