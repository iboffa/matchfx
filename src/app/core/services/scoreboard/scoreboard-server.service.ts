import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { Team } from '../../../models/team';


import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root",
})
export class ScoreboardServerService {
  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on("home", (event, val: Team) => {
      this.home$.next(val);
    });
    this.electron.ipcRenderer.on("away", (event, val: Team) => {
      this.away$.next(val);
    });
    this.electron.ipcRenderer.on("visible", (event, val: boolean) => {
      this.show$.next(val);
    });
  }

  private home$ = new BehaviorSubject<Team>({
    name: "Home",
    points: 0,
    fouls: 0,
    sets: 0,
  });
  private away$ = new BehaviorSubject<Team>({
    name: "Away",
    points: 0,
    fouls: 0,
    sets: 0,
  });

  private show$ = new BehaviorSubject<boolean>(true);
  visible = this.show$.asObservable();

  get home(): Observable<Team> {
    return this.home$.asObservable();
  }

  get away(): Observable<Team> {
    return this.away$.asObservable();
  }
}
