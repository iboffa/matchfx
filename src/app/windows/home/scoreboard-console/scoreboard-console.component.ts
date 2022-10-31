import { Component, OnInit } from "@angular/core";
import { AbstractControl, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { combineLatest } from "rxjs";
import { debounceTime, take } from "rxjs/operators";
import { ScoreboardServerService } from "../../../core/services/scoreboard/scoreboard-server.service";
import {ScoreboardClientService} from '../../../core/services/scoreboard/scoreboard-client.service';
import { Team } from "../../../models/team";

@Component({
  selector: "app-scoreboard-console",
  templateUrl: "./scoreboard-console.component.html",
  styleUrls: ["./scoreboard-console.component.scss"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardConsoleComponent implements OnInit {
  scoreboardForm = new UntypedFormGroup({
    visible: new UntypedFormControl(),
    home: new UntypedFormGroup({
      name: new UntypedFormControl(),
      points: new UntypedFormControl(),
      sets: new UntypedFormControl(),
      fouls: new UntypedFormControl(),
      bgColor: new UntypedFormControl(),
      textColor: new UntypedFormControl(),
    }),
    away: new UntypedFormGroup({
      name: new UntypedFormControl(),
      points: new UntypedFormControl(),
      sets: new UntypedFormControl(),
      fouls: new UntypedFormControl(),
      bgColor: new UntypedFormControl(),
      textColor: new UntypedFormControl(),
    }),
  });

  constructor(private scoreboardClient: ScoreboardClientService, private scoreboardServer: ScoreboardServerService) {}

  ngOnInit(): void {
    combineLatest([
      this.scoreboardServer.home,
      this.scoreboardServer.away,
      this.scoreboardServer.visible,
    ])
      .pipe(take(1))
      .subscribe(([home, away, visible]) => {
        (this.scoreboardForm.get("home") as UntypedFormGroup).patchValue(home);
        (this.scoreboardForm.get("away") as UntypedFormGroup).patchValue(away);
        this.scoreboardForm.get("visible").setValue(visible);
      });

    (this.scoreboardForm.get("home") as UntypedFormGroup).valueChanges
      .pipe(debounceTime(250))
      .subscribe((team: Team) => {
        console.log(team);
        this.scoreboardClient.setHome(team);
      });
    (this.scoreboardForm.get("away") as UntypedFormGroup).valueChanges
      .pipe(debounceTime(250))
      .subscribe((team: Team) => {
        this.scoreboardClient.setAway(team);
      });
    this.scoreboardForm
      .get("visible")
      .valueChanges.subscribe((visible: boolean) =>
        this.scoreboardClient.show(visible)
      );
  }

  getVisibleControl(): AbstractControl {
    return this.scoreboardForm.get("visible");
  }
}
