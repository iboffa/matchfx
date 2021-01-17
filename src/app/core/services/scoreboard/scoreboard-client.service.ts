import { Injectable } from '@angular/core';
import { Team } from '../../../models/team';
import {EventManagerService} from '../event-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreboardClientService {

  constructor(private evmg: EventManagerService) { }

  setHome(team: Team): void {
    this.evmg.sendEvent('home', team);
  }

  setAway(team: Team): void {
    this.evmg.sendEvent('away', team);
  }

  show(visible: boolean):void{
    this.evmg.sendEvent('visible', visible);
  }
}
