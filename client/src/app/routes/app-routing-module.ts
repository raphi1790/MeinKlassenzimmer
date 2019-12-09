import { NgModule } from '@angular/core';
import {RouterModule, Routes}from '@angular/router';

import {SchulklassenComponent} from '../components/schulklassen/schulklassen.component';
import {SchulzimmerComponent} from'../components/schulzimmer/schulzimmer.component';
import {SitzordnungComponent} from '../components/sitzordnung/sitzordnung.component'
import {StartseiteComponent} from '../components/startseite/startseite.component';
import { GruppeneinteilungComponent } from '../components/gruppeneinteilung/gruppeneinteilung.component';
import { UnsavedGuard} from '../helpers/guards/unsaved.guard'
import { AuthGuard} from '../helpers/guards/auth.guard'
import { AnleitungComponent } from '../components/anleitung/anleitung.component';
import { RegelnComponent } from '../components/regeln/regeln.component';


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
          canActivate: [AuthGuard]
      },
      {
        path: 'gruppeneinteilung',
        component: GruppeneinteilungComponent  ,
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
    }
     

    ];
@NgModule({
    imports: [RouterModule.forRoot(routes,{useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule{}