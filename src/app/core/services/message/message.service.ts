import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Message } from "../../../models/message";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private message$ = new BehaviorSubject<Message>(null);
  get message(): Observable<Message> {
    return this.message$.asObservable();
  }

  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on('message',(event, arg)=>{
      this.message$.next(arg);
    });
  }
}
