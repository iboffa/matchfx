import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


import { HomeComponent } from "./home.component";
import { ScoreboardConsoleComponent } from "./scoreboard-console/scoreboard-console.component";
import { TimerConsoleComponent } from "./timer-console/timer-console.component";
import { MessageConsoleComponent } from "./message-console/message-console.component";
import { StreamingConsoleComponent } from "./streaming-console/streaming-console.component";

import { RouterModule, Routes } from "@angular/router";

import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { SelectButtonModule } from "primeng/selectbutton";
import { CheckboxModule } from "primeng/checkbox";
import { TooltipModule } from "primeng/tooltip";
import { DropdownModule } from "primeng/dropdown";

import { ReactiveFormsModule } from "@angular/forms";

import {CardModule} from 'primeng/card';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    CardModule,
    TooltipModule,
    DropdownModule
  ],
  declarations: [
    HomeComponent,
    ScoreboardConsoleComponent,
    TimerConsoleComponent,
    MessageConsoleComponent,
    StreamingConsoleComponent
  ],
})
export class HomeModule {}
