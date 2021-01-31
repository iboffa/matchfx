import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { gsap } from "gsap";
import { EMPTY, Observable, of, timer } from "rxjs";
import { concatMap, delay, filter, startWith, tap } from "rxjs/operators";
import { SubSink } from "subsink";

import { ScoreboardServerService } from "../../core/services/scoreboard/scoreboard-server.service";
import { TimerServerService } from "../../core/services/timer/timer-server.service";
import { AudioVideoService } from "../../core/services/audio-video/audio-video.service";
import { Team } from "../../models/team";
import { TimerStatus } from "../../models/timer-status";
import {
  rowStyle,
  scoreItemStyle,
  teamItemStyle,
  scoreStyle,
  teamsStyle,
  circleStyle,
  timerItemStyle,
} from "./styles";
import { EventManagerService } from "../../core/services/event-manager.service";
import { MessageService } from "../../core/services/message/message.service";
import { Message } from "../../models/message";
import { merge } from "rxjs";

@Component({
  selector: "app-graphics",
  templateUrl: "./graphics.component.html",
  styleUrls: ["./graphics.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicsComponent implements OnInit, OnDestroy {
  @ViewChild("video", { static: false }) video: ElementRef;

  rowStyle = rowStyle;
  scoreItemStyle = scoreItemStyle;
  teamItemStyle = teamItemStyle;
  scoreStyle = scoreStyle;
  teamsStyle = teamsStyle;
  circleStyle = circleStyle;
  timerItemStyle = timerItemStyle;

  tl!: gsap.core.Timeline;

  home$: Observable<Team>;
  away$: Observable<Team>;
  period$: Observable<string>;
  timer$: Observable<any>;
  subsink = new SubSink();

  home: Team;
  away: Team;
  period: string;
  timer: TimerStatus;
  stream: MediaStream;
  message$: Observable<Message>;

  constructor(
    private scoreService: ScoreboardServerService,
    private timerService: TimerServerService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private avService: AudioVideoService,
    private evmg: EventManagerService
  ) {}

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  show(): void {
    this.tl.play(0);
  }

  hide(): void {
    this.tl.reverse();
  }

  ngOnInit(): void {
    this.home$ = this.scoreService.home;
    this.away$ = this.scoreService.away;
    this.period$ = this.timerService.period;
    this.timer$ = this.timerService.timer;
    const gsapMakeOpaque = (_) => {
      gsap
        .fromTo("#message", { opacity: 0 }, { opacity: 1, duration: "0.5" })
        .reverse()
        .delay(5);
    };

    // Solution
    this.message$ = this.messageService.message.pipe(
      concatMap((msg) =>
        EMPTY.pipe(
          delay(6000),
          startWith(msg),
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          tap(gsapMakeOpaque)
        )
      )
    );
    this.tl = gsap.timeline();
    this.tl.fromTo(
      ".container",
      { opacity: 0 },
      { opacity: 1, duration: 0.25 }
    );
    this.tl.fromTo(
      "#score",
      { ...this.scoreStyle, width: 80 },
      { ...this.scoreStyle, width: 250, duration: 0.5 }
    );
    this.tl.fromTo(
      "#teams",
      { ...this.teamsStyle, width: 80 },
      { ...this.teamsStyle, width: 200, duration: 0.5 },
      "-=0.5"
    );
    this.tl.fromTo(".text", { opacity: 0 }, { opacity: 1, duration: 0.5 });
    this.subsink.add(
      this.home$.subscribe((home) => {
        console.log(home);
        this.home = home;
        this.cd.detectChanges();
      })
    );
    this.subsink.add(
      this.away$.subscribe((away) => {
        console.log(away);
        this.away = away;
        this.cd.detectChanges();
      })
    );
    this.subsink.add(
      this.period$.subscribe((period) => {
        this.period = period;
        this.cd.detectChanges();
      })
    );
    this.subsink.add(
      this.timer$.subscribe((timer) => {
        this.timer = timer;
        this.cd.detectChanges();
      })
    );
    this.subsink.add(
      this.scoreService.visible.subscribe((visible) =>
        visible ? this.show() : this.hide()
      )
    );
    navigator.getUserMedia(
      { video: true, audio: false },
      (stream) => {
        this.stream = stream;
        this.cd.detectChanges();
      },
      (err) => console.log(err)
    );

    this.subsink.add(
      this.avService.videoSource.subscribe((videoSrc) => {
        const srcInfo = videoSrc.getVideoTracks()[0].getSettings();
        this.evmg.sendEvent("set-preview-size", {
          width: srcInfo.width,
          height: srcInfo.height,
        });
        this.stream = videoSrc;
        this.cd.detectChanges();
      })
    );
  }

  play(): void {
    (this.video.nativeElement as HTMLVideoElement).play();
  }
}
