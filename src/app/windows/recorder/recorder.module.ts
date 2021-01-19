import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecorderComponent } from './recorder.component';
import { RecorderRoutingModule } from './recorder-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RecorderRoutingModule
  ],
  declarations: [RecorderComponent]
})
export class RecorderModule { }
