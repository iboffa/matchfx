import { Injectable } from "@angular/core";
import { ChildProcess } from "child_process";
import moment from "moment";
import { from } from "rxjs";
import { catchError, map, switchMap, take } from "rxjs/operators";
import { ElectronService } from "../electron/electron.service";
import * as path from "path";
import { ffmpegBaseParams, YT_URL } from "./consts";
import { StreamingInfo } from "../../../models/streaming-info";

declare let MediaRecorder: any;

@Injectable({
  providedIn: "root",
})
export class RecorderService {
  private ffmpeg: ChildProcess;
  private recorder: any;

  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on(
      "start-stream",
      (event, arg: StreamingInfo) => {
        this.startStream(arg);
      }
    );
    this.electron.ipcRenderer.on("stop-stream", () => {
      this.stopStream();
    });
  }

  init(): void {
    //get "Preview" window
    from(this.electron.desktopCapturer.getSources({ types: ["window"] }))
      .pipe(
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
          return from(
            // Forced to cast to "any" as chromeMediaSource and chromeMediaSourceId are not standard WebRTC constraints
            (<any>navigator.mediaDevices).getUserMedia(constraints)
          );
        }),
        take(1)
      )
      .subscribe((stream: MediaStream) => {
        // get stream from Preview window and creates recorder
        this.recorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=h264",
          videoBitsPerSecond: 3 * 1024 * 1024,
        });
        this.recorder.ondataavailable = (e) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.readyState === 2) {
              const buffer = Buffer.from(reader.result as ArrayBuffer);
              if (!this.ffmpeg.stdin.writableEnded)
                this.ffmpeg.stdin.write(buffer);
            }
          };
          reader.readAsArrayBuffer(e.data);
        };
      });
  }

  private startStream(arg: StreamingInfo): void {
    const videoDir = path.normalize(
      this.electron.remote.app.getAppPath() + "/video"
    );
    const localPath = path.normalize(
      videoDir +"/"+ moment().format("YYYYMMDD[_]HHmmss") + ".flv"
    );

    const localParams = [...ffmpegBaseParams, localPath];

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const ytParams = [...ffmpegBaseParams, `${YT_URL}/${arg.ytKey}`];
    let ffmpegParams = [];
    if (arg.youtube) {
      ffmpegParams = [...ffmpegParams, ...ytParams];
    }
    if (arg.saveLocal) {
      from(this.electron.fs.promises.access(videoDir))
        .pipe(
          catchError(() => {
            return from(this.electron.fs.promises.mkdir(videoDir));
          }),
          take(1)
        )
        .subscribe(() => {
          ffmpegParams = [...ffmpegParams, ...localParams];
          this.spawnFfmpegProcess(ffmpegParams);
        });
    } else this.spawnFfmpegProcess(ffmpegParams);
  }

  private spawnFfmpegProcess(options: string[]) {
    this.ffmpeg = this.electron.childProcess.spawn(
      path.normalize(this.electron.remote.app.getAppPath() + "/ffmpeg.exe"),
      options
    );
    this.ffmpeg.on("finish", () => this.ffmpeg.kill("SIGINT"));
    this.recorder.start(10);
  }

  stopStream(): void {
    this.recorder.stop();
    if (this.ffmpeg && !this.ffmpeg.killed) this.ffmpeg.stdin.end();
  }

}
