import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { from, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { SubSink } from "subsink";
import { ElectronService } from "../../../core/services/electron/electron.service";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"],
})
export class PreviewComponent implements OnInit {
  stream$: Observable<MediaStream>;
  @ViewChild("preview", { static: false }) video: ElementRef;
  subsink = new SubSink();
  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
    this.stream$ = from(
      this.electron.desktopCapturer.getSources({ types: ["window"] })
    ).pipe(
      //transform capturer source in media constraints
      map((sources) => {
        return {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: sources.filter(
                (source) => source.name === "Preview"
              )[0].id,
            },
          },
        };
      }),
      switchMap((constraints) => {
        // Forced to cast to "any" as chromeMediaSource and chromeMediaSourceId are not standard WebRTC constraints
        return from(
          (<any>navigator.mediaDevices).getUserMedia(constraints)
        ) as Observable<MediaStream>;
      })
    );
  }

  play(): void {
    (this.video.nativeElement as HTMLVideoElement).play();
  }
}
