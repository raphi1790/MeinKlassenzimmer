import { NgModule } from '@angular/core';
import {RouterModule, Routes}from '@angular/router';

import {SchulklassenComponent} from '../components/schulklassen/schulklassen.component';
import {SchulzimmerComponent} from'../components/schulzimmer/schulzimmer.component';
import {SitzordnungComponent} from '../components/sitzordnung/sitzordnung.component'
import {StartseiteComponent} from '../components/startseite/startseite.component';
import { UnsavedGuard} from '../helpers/guards/unsaved.guard'
import { AuthGuard} from '../helpers/guards/auth.guard'
import { AnleitungComponent } from '../components/anleitung/anleitung.component';
import { RegelnComponent } from '../components/regeln/regeln.component';
import { TimerComponent } from '../components/timer/timer.component';
import { ZufallsgeneratorComponent } from '../components/zufallsgenerator/zufallsgenerator.component';
import { ListenverwaltungComponent } from '../components/listenverwaltung/listenverwaltung.component';


const routes: Routes = [

      {
          path: 'verwaltung/klassen',
          component: SchulklassenComponent,
          canDeactivate: [UnsavedGuard],
          canActivate: [AuthGuard]
      },
      {
          path: 'verwaltung/schulzimmer',
          component: SchulzimmerComponent,
          canDeactivate: [UnsavedGuard],
          canActivate: [AuthGuard]
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
          component: SitzordnungComponent,
          // canActivate: [AuthGuard]
      },
      {
        path: 'listenverwaltung',
        component: ListenverwaltungComponent  ,
        canDeactivate: [UnsavedGuard],
        canActivate: [AuthGuard]
        
      },
      {
          path: 'anleitung',
          component: AnleitungComponent
      },
      {
        path: 'verwaltung/regeln',
        component: RegelnComponent,
        canDeactivate: [UnsavedGuard],
        canActivate: [AuthGuard]
    },
    {
        path: 'werkzeugkasten/timer',
        component: TimerComponent  
      },
    {
      path: 'werkzeugkasten/Zufallsgenerator',
      component: ZufallsgeneratorComponent
    }
     

    ];
@NgModule({
    imports: [RouterModule.forRoot(routes,{useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule{}