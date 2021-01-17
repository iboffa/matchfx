import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SubSink } from "subsink";

import * as Mousetrap from "mousetrap";
import { combineLatest } from "rxjs";
import { TimerClientService } from "../../core/services/timer/timer-client.service";
import { map } from "rxjs/operators";
@Component({
  selector: "app-timer-console",
  templateUrl: "./timer-console.component.html",
  styleUrls: ["./timer-console.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerConsoleComponent implements OnInit, OnDestroy {
  private sink = new SubSink();
  running$ = this.timer.running;
  expired$ = this.timer.expired;
  directions = [
    { label: "Up", value: "up" },
    { label: "Down", value: "down" },
  ];
  timeForm = new FormGroup({
    minutes: new FormControl(null, Validators.min(0)),
    seconds: new FormControl(null, [Validators.min(0), Validators.max(59)]),
    direction: new FormControl("up"),
    period: new FormControl(""),
  });

  constructor(private timer: TimerClientService) {}

  ngOnInit(): void {
    this.sink.add(
      this.timeForm
        .get("direction")
        .valueChanges.subscribe((val) => this.timer.setDirection(val))
    );
    this.sink.add(
      combineLatest([
        this.timeForm.get("minutes").valueChanges,
        this.timeForm.get("seconds").valueChanges,
      ]).subscribe(() => this.setTime())
    );
    this.sink.add(
      this.timer.timer
        .pipe(
          map((status) => {
            const _status: { minutes: number; seconds: number } = {
              minutes: parseInt(status.minutes),
              seconds: parseInt(status.seconds),
            };
            return _status;
          })
        )
        .subscribe((status) => {
          this.timeForm.patchValue(status, { emitEvent: false });
        })
    );
    this.sink.add(
      combineLatest([this.running$, this.expired$])
        .subscribe(([running, expired]) => {
          Mousetrap.reset();
          if (running) {
            this.timeForm.disable();
            Mousetrap.bind("space", () => this.stop());
          } else if (!expired) {
            Mousetrap.bind("space", () => this.run());
            this.timeForm.enable();
          }
        })
    );
    this.sink.add(
      this.timeForm.get("period").valueChanges.subscribe((val) => {
        this.timer.setPeriod(val);
      })
    );
  }

  ngOnDestroy(): void {
    this.sink.unsubscribe();
  }

  run(): void {
    this.timer.run();
  }

  stop(): void {
    this.timer.stop();
  }

  setTime(): void {
    this.timer.set({
      minutes: this.timeForm.get("minutes").value,
      seconds: this.timeForm.get("seconds").value,
    });
  }
}
