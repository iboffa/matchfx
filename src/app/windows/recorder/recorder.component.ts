import { Component, OnDestroy, OnInit } from "@angular/core";
import {RecorderService} from "../../core/services/recorder/recorder.service";

@Component({
  selector: "app-recorder",
  templateUrl: './recorder.component.html',
})
export class RecorderComponent implements OnInit, OnDestroy {
  constructor(private recorderService: RecorderService) {}



  ngOnInit():void {
    this.recorderService.init();
  }

  ngOnDestroy():void{
    this.recorderService.stopStream();
  }
}
