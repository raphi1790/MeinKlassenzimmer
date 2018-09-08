import { NgModule } from '@angular/core';
import {RouterModule, Routes}from '@angular/router';

import {SchulklassenComponent} from '../components/schulklassen/schulklassen.component';
import {SchulzimmerComponent} from'../components/schulzimmer/schulzimmer.component';
import {SitzordnungComponent} from '../components/sitzordnung/sitzordnung.component'
import {StartseiteComponent} from '../components/startseite/startseite.component';
import {KontaktComponent} from '../components/kontakt/kontakt.component';
import { GruppeneinteilungComponent } from '../components/gruppeneinteilung/gruppeneinteilung.component';
import { UnsavedGuard} from '../helpers/guards/unsaved.guard'
import { AnleitungComponent } from '../components/anleitung/anleitung.component';


const routes: Routes = [

      {
          path: 'verwaltung/klassen',
          component: SchulklassenComponent,
          canDeactivate: [UnsavedGuard]
      },
      {
          path: 'verwaltung/schulzimmer',
          component: SchulzimmerComponent,
          canDeactivate: [UnsavedGuard]
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
        path: 'kontakt',
        component: KontaktComponent
      },
      {
        path: 'gruppeneinteilung',
        component: GruppeneinteilungComponent   
      },
      {
          path: 'anleitung',
          component: AnleitungComponent
      }
     

    ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}