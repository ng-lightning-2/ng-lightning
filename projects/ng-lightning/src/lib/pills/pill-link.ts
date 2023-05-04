import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NglPill } from './pill';

@Component({
  //  tslint:disable-next-line:component-selector
  selector: 'a[nglPillAction]',
  templateUrl: './pill-link.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-pill__action]': 'true',
  }
})
export class NglPillLink {

  constructor(pill: NglPill) {
    pill.linked = true;
  }

}
