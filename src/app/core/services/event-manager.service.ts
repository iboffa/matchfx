import { Injectable } from "@angular/core";
import { ElectronService } from "./electron/electron.service";


@Injectable({
  providedIn: "root",
})
export class EventManagerService {
  constructor(
    private electron: ElectronService
  ) {

  }

  sendEvent(eventName: string, value: any):void {
    console.log(eventName, value);
    this.electron.ipcRenderer.send(eventName, value);
  }
}
