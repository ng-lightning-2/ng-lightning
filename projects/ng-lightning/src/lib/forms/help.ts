import { Component, Input, ChangeDetectionStrategy, TemplateRef } from '@angular/core';

@Component({
  selector: 'ngl-form-help',
  templateUrl: './help.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-form-element__icon]': 'true',
  },
})
export class NglFormHelp {

  isOpen = false;

  @Input() content: string | TemplateRef<any>;

}
