import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { SchulklassenComponent } from "../../components/schulklassen/schulklassen.component";
import { SchulzimmerComponent } from "../../components/schulzimmer/schulzimmer.component";

export class UnsavedGuard implements CanDeactivate<any> { 
    canDeactivate(component: any, 
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot): boolean {
      console.log("UnsavedGuard");
      console.log(route.params);
      console.log(state.url);
      return component.canDeactivate() || window.confirm("Es gibt noch nicht gespeicherte Änderungen. Willst du die Seite trotzdem verlassen?");
    }
  }

