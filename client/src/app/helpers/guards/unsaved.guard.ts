import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UnsavedGuard implements CanDeactivate<any> {
    constructor(){}

    canDeactivate(component: any, 
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot): boolean {
      debugger;
          
      return component.canDeactivate() || window.confirm("Es gibt noch nicht gespeicherte Änderungen. Willst du die Seite trotzdem verlassen?");
      }
  }
