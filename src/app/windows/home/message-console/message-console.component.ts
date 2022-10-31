import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EventManagerService } from '../../../core/services/event-manager.service';

@Component({
  selector: 'app-message-console',
  templateUrl: './message-console.component.html',
  styleUrls: ['./message-console.component.scss']
})
export class MessageConsoleComponent  {

  constructor(private evmg:EventManagerService) { }

  messageForm=new UntypedFormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    title: new UntypedFormControl(null, Validators.required),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    detail: new UntypedFormControl(null, Validators.required)
  });

  sendMessage():void{
    this.evmg.sendEvent('message', this.messageForm.value);
  }

}
