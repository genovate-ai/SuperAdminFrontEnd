import { Injectable } from "@angular/core";
import { EventModel } from "../../models/Event.Model";
import { ScreenModel } from "../../models/Screen.Model";
import { BehaviorSubject } from "rxjs/Rx";
import { UserVModel } from "../../models/users/UserV.Model";
import { AccessRightVModel } from "../../models/roles/AccessRightV.Model";
import { ScreenVPermission } from "../../models/ScreenPermissionV.Model";
import { ReportsVModel } from "../../models/reports/Reports.V.Model";
@Injectable({
  providedIn: "root",
})
export class ExplorerService {
  constructor() {}

  // colorMap: any = null;
  // imageryLayer = "RGB";
  // imagerySource = 1;
  isAlignment = false;

  // clear() {
  //   this.colorMap = null;
  //   this.imageryLayer = "RGB";
  //   this.imagerySource = 1;
  // }
  
}
