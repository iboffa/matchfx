import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { from, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { SubSink } from "subsink";
import { EventManagerService } from "../../../core/services/event-manager.service";

const streamingFormValidator: () => ValidationErrors = () => {
  return (form: UntypedFormGroup) => {
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
  streamingForm: UntypedFormGroup;
  streaming = false;

  sink = new SubSink();
  videoSources$: Observable<MediaDeviceInfo[]>;
  audioSources$: Observable<MediaDeviceInfo[]>;
  mics: string[] = [];
  microphonesForm: UntypedFormGroup;
  constructor(private evmg: EventManagerService, private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.streamingForm = this.fb.group(
      {
        saveLocal: new UntypedFormControl(true),
        youtube: new UntypedFormControl(false),
        ytKey: new UntypedFormControl(null),
      },
      // eslint-disable-next-line @typescript-eslint/unbound-method
      {
        validators: [streamingFormValidator],
      }
    );

    this.microphonesForm = new UntypedFormGroup({ microphones: new UntypedFormArray([]) });

    const devices = from(navigator.mediaDevices.enumerateDevices());
    this.videoSources$ = devices.pipe(
      map((devices) => devices.filter((device) => device.kind === "videoinput"))
    );
    this.audioSources$ = devices.pipe(
      map((devices) => devices.filter((device) => device.kind === "audioinput"))
    );
    this.sink.add(
      this.audioSources$.subscribe((devices) => {
        devices.forEach((device) => {
          this.mics.push(device.label);
          // eslint-disable-next-line @typescript-eslint/unbound-method
          const control = new UntypedFormControl(100, Validators.required);
          control.valueChanges.subscribe((val) =>
            this.evmg.sendEvent("set-audio-gain", {
              deviceId: device.deviceId,
              gain: val / 100,
            })
          );
          (this.microphonesForm.get('microphones') as UntypedFormArray).push(control);
        });
      })
    );
  }

  getMicrophones(): AbstractControl[] {
    return  (this.microphonesForm.get('microphones') as UntypedFormArray).controls;
  }

  stream(): void {
    this.evmg.sendEvent("start-stream", this.streamingForm.value);
    this.streaming = true;
  }

  stopStreaming(): void {
    this.evmg.sendEvent("stop-stream", null);
    this.streaming = false;
  }

  setVideoSource(event: any): void {
    this.evmg.sendEvent("set-video-source", event.value);
  }

  isStreamingButtonEnabled():boolean{
    if (this.streamingForm.get('youtube').value && !this.streamingForm.get('ytKey').value){
      return false;
    }
    if(!this.streamingForm.get('youtube').value && !this.streamingForm.get('saveLocal').value){
      return false;
    }
    return true;
  }
}
