import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BaseDynamicIconComponent } from '../base-dynamic-icon';

export type NglDynamicIconScoreOption = 'positive' | 'negative';

@Component({
  selector: 'ngl-dynamic-icon-score',
  templateUrl: './score.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglDynamicIconScore extends BaseDynamicIconComponent {

  @Input() set option(option: NglDynamicIconScoreOption) {
    this._option = option || 'positive';
  }
  get option() {
    return this._option;
  }

  private _option: NglDynamicIconScoreOption;

}
