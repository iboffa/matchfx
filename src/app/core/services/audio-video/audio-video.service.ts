import { Injectable } from "@angular/core";
import { from, Observable, of, Subject, zip } from "rxjs";
import {
  concatMap,
  map,
} from "rxjs/operators";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root",
})
export class AudioVideoService {
  private _ac = new AudioContext();
  private videoSource$ = new Subject<MediaStream>();
  private audioSource$ = new Subject<MediaStream>();
  private _videoStreams: { [x: string]: MediaStream } = {};
  private _audioNodes: { [x: string]: GainNode } = {};
  private _mergedAudio: MediaStreamAudioDestinationNode;

  get mergedAudio(): MediaStream {
    return this._mergedAudio.stream;
  }

  get videoSource(): Observable<MediaStream> {
    return this.videoSource$.asObservable();
  }
  get audioSource(): Observable<MediaStream> {
    return this.audioSource$.asObservable();
  }

  constructor(private electron: ElectronService) {
    //video
    this.getStreamToDeviceId("videoinput")
      .subscribe(
        ([deviceId, stream]) => (this._videoStreams[deviceId] = stream)
      );

    //audio
    this._mergedAudio = this._ac.createMediaStreamDestination();
    this.getStreamToDeviceId("audioinput").subscribe(([deviceId, stream]) => {
      const source = this._ac.createMediaStreamSource(stream);
      this._audioNodes[deviceId] = this._ac.createGain();
      source.connect(this._audioNodes[deviceId]);
      this._audioNodes[deviceId].connect(this._mergedAudio);
    });

    this.electron.ipcRenderer.on("set-video-source", (event, arg) => {
      this.videoSource$.next(this._videoStreams[arg]);
    });

    this.electron.ipcRenderer.on("set-audio-gain", (event, arg) => {
      this.setGain(arg.deviceId, arg.gain);
    });
  }

  private getStreamToDeviceId(deviceKind: "audioinput" | "videoinput") {
    return from(navigator.mediaDevices.enumerateDevices()).pipe(
      map((devices) =>
        devices
          .filter((device) => device.kind === deviceKind)
          .map((device) => device.deviceId)
      ),
      concatMap((deviceIds) => of(...deviceIds)),
      concatMap((deviceId) =>
        zip(
          of(deviceId),
          from(
            navigator.mediaDevices.getUserMedia({
              audio: deviceKind === "audioinput" ? { deviceId } : false,
              video: deviceKind === "videoinput" ? { deviceId } : false,
            })
          )
        )
      ),
    );
  }

  private setGain(deviceId: string, gain: number): void {
    this._audioNodes[deviceId].gain.setValueAtTime(gain, this._ac.currentTime);
  }

}
