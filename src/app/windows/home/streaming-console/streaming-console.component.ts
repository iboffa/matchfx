import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from "@angular/forms";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EventManagerService } from "../../../core/services/event-manager.service";

const streamingFormValidator: () => ValidationErrors = () => {
  return (form: FormGroup) => {
    if (!(form.get("saveLocal").value || form.get("youtube").value)) {
      return { noOutputChannel: true };
    }
    if (
      form.get("youtube").value &&
      (form.get("ytKey").value as string).trim().length === 0
    ) {
      return { missingYoutubeStreamingKey: true };
    }
    return null;
  };
};

@Component({
  selector: "app-streaming-console",
  templateUrl: "./streaming-console.component.html",
  styleUrls: ["./streaming-console.component.scss"],
})
export class StreamingConsoleComponent implements OnInit {
  streamingForm: FormGroup;
  streaming = false;

  videoSources$: Observable<any>;
  audioSources$: Observable<any>;

  constructor(private evmg: EventManagerService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.streamingForm = this.fb.group(
      {
        saveLocal: new FormControl(true),
        youtube: new FormControl(false),
        ytKey: new FormControl(null),
      },
      // eslint-disable-next-line @typescript-eslint/unbound-method
      {
        validators: [streamingFormValidator],
      }
    );

    const devices = from(navigator.mediaDevices.enumerateDevices());
    this.videoSources$ = devices.pipe(
      map((devices) => devices.filter((device) => device.kind === "videoinput"))
    );
    this.audioSources$ = devices.pipe(
      map((devices) => devices.filter((device) => device.kind === "audioinput"))
    );
  }

  stream(): void {
    this.evmg.sendEvent("start-stream", this.streamingForm.value);
    this.streaming = true;
  }

  stopStreaming(): void {
    this.evmg.sendEvent("stop-stream", null);
    this.streaming = false;
  }

  setVideoSource(event:any):void{
    this.evmg.sendEvent('set-video-source', event.value);
  }
}
