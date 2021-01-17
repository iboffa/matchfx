import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TimerStatus } from '../../../models/timer-status';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class TimerServerService {

  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on("time", (event, val: TimerStatus) => {
      this.timer$.next(val);
    });
    this.electron.ipcRenderer.on("period", (event, val: string) => {
      this.period$.next(val);
    });
  }

  private timer$ = new BehaviorSubject<TimerStatus>({
    minutes: "00",
    seconds: "00",
  });

  get timer():Observable<TimerStatus>{
    return this.timer$.asObservable();
  }

  private period$ = new BehaviorSubject<string>(null);

  get period(): Observable<string>{
    return this.period$.pipe(debounceTime(250));
  }
}
