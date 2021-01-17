import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  interval,
  Observable,
  Subscription,
  timer,
} from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { TimerStatus } from "../../../models/timer-status";
import { EventManagerService } from "../event-manager.service";

@Injectable({
  providedIn: 'root'
})
export class TimerClientService {

  private lastTick: number;
  private directionUp: boolean;
  private delay: number;
  private expectedTick: any;
  private time: number;
  private interval = 1000;
  private timer$ = new BehaviorSubject<TimerStatus>({
    minutes: "00",
    seconds: "00",
  });
  private running$ = new BehaviorSubject<boolean>(false);
  private expired$ = new BehaviorSubject<boolean>(false);
  private runnerSub: Subscription;

  get timer(): Observable<TimerStatus> {
    return this.timer$.asObservable();
  }
  get running(): Observable<boolean> {
    return this.running$.pipe(distinctUntilChanged());
  }


  get expired(): Observable<boolean> {
    return this.expired$.pipe(distinctUntilChanged());
  }

  constructor(private evmg: EventManagerService) {}

  private timeRunner() {
    this.lastTick = Date.now();
    if (this.directionUp) {
      this.time++;
      this.emitTime();
    } else {
      if (this.time > 0) {
        this.time--;
        this.emitTime();
      } else {
        this.runnerSub.unsubscribe();
        this.running$.next(false);
        this.expired$.next(true);
      }
    }
  }

  run(): void {
    if (this.directionUp && this.delay === 0) {
      this.runnerSub = interval(this.interval).subscribe(() =>
        this.timeRunner()
      );
    } else {
      if (this.delay > 0) {
        this.expectedTick = Date.now() + this.delay;
      }
      this.runnerSub = timer(this.delay, this.interval).subscribe(() =>
        this.timeRunner()
      );
    }

    this.running$.next(true);
  }

  private emitTime() {
    const now: { minutes: string; seconds: string } = {
      minutes: Math.floor(this.time / 60)
        .toString()
        .padStart(2, "0"),
      seconds: (this.time % 60).toString().padStart(2, "0"),
    };
    this.timer$.next(now);
    this.evmg.sendEvent("time", now);
  }

  set(time: TimerStatus): void {
    this.time = parseInt(time.minutes) * 60 + parseInt(time.seconds);
    this.delay = 0;
    if (this.time > 0) this.expired$.next(false);
    this.emitTime();
  }

  setDirection(direction: "up" | "down"): void {
    this.delay=0;
    this.directionUp = direction === "up";
    if (this.directionUp) {
      this.expired$.next(false);
    }
  }

  setPeriod(period: string): void {
    this.evmg.sendEvent("period", period);
  }

  stop(): void {
    this.running$.next(false);
    this.runnerSub.unsubscribe();
    const stopTime = Date.now();
    if (stopTime > this.expectedTick || !this.expectedTick) {
      this.delay = this.interval - (stopTime - this.lastTick);
    } else {
      this.delay = this.expectedTick - stopTime;
    }
  }
}
