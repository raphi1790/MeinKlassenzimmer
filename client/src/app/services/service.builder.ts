import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { DummyService } from "./dummy.service";
import { UserService } from "./user.service";

@Injectable({ providedIn: "root" })
export class ServiceBuilder {
  private isProductionMode: boolean;
  constructor(private userService: UserService, private dummyService: DummyService) {
    this.onNetworkModeChange();
  }
 
  private onNetworkModeChange() {
    debugger;
    this.isProductionMode = false
    console.log("this.isProductionMode", this.isProductionMode)
  }
 
  public getService(): DataService {
    debugger;
    return this.isProductionMode ? this.userService : this.dummyService;
  }
}