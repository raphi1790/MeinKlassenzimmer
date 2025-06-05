import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class UnsavedGuard implements CanDeactivate<any> {
    constructor(public dialog: MatDialog){}

    canDeactivate(component: any, 
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot): boolean {
      // console.log("UnsavedGuard");
      // console.log(route.params);
      // console.log(state.url);
      debugger;
          
      return component.canDeactivate() || window.confirm("Es gibt noch nicht gespeicherte Änderungen. Willst du die Seite trotzdem verlassen?")
      }
    
      
      
  }



