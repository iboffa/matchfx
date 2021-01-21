import { Injectable } from "@angular/core";
import { from, Observable, Subject } from "rxjs";
import { map, take } from "rxjs/operators";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root",
})
export class AudioVideoService {
  private videoSource$ = new Subject<MediaStream>();
  private audioSource$ = new Subject<MediaStream>();
  private _videoStreams: { [x: string]: MediaStream } = {};
  private _audioStreams: { [x: string]: MediaStream } = {};

  get videoSource(): Observable<MediaStream> {
    return this.videoSource$.asObservable();
  }
  get audioSource(): Observable<MediaStream> {
    return this.audioSource$.asObservable();
  }

  constructor(private electron: ElectronService) {
    from(navigator.mediaDevices.enumerateDevices())
      .pipe(
        map((devices) =>
          devices
            .filter((device) => device.kind === "videoinput")
            .map((device) => device.deviceId)
        ),
        take(1)
      )
      .subscribe((deviceIds) => {
        deviceIds.forEach((deviceId) => {
          from(
            navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                deviceId,
              },
            })
          )
            .pipe(take(1))
            .subscribe((stream) => (this._videoStreams[deviceId] = stream));
        });
      });

    from(navigator.mediaDevices.enumerateDevices())
      .pipe(
        map((devices) =>
          devices
            .filter((device) => device.kind === "audioinput")
            .map((device) => device.deviceId)
        ),
        take(1)
      )
      .subscribe((deviceIds) => {
        deviceIds.forEach((deviceId) => {
          from(
            navigator.mediaDevices.getUserMedia({
              audio: {
                deviceId
              },
              video: false
            })
          )
            .pipe(take(1))
            .subscribe((stream) => (this._audioStreams[deviceId] = stream));
        });
      });

    this.electron.ipcRenderer.on("set-video-source", (event, arg) => {
      this.videoSource$.next(this._videoStreams[arg]);
    });

    this.electron.ipcRenderer.on("set-video-source", (event, arg) => {
      this.audioSource$.next(this._audioStreams[arg]);
    });
  }

  getDefaultMicrophone(): void {
    this.audioSource$.next(this._audioStreams.default);
  }
}
