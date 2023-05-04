import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BaseDynamicIconComponent } from '../base-dynamic-icon';

export type NglDynamicIconEqOption = 'play' | 'stop';

@Component({
  selector: 'ngl-dynamic-icon-eq',
  templateUrl: './eq.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglDynamicIconEq extends BaseDynamicIconComponent {

  @Input() set option(option: NglDynamicIconEqOption) {
    this._option = option || 'play';
  }
  get option() {
    return this._option;
  }

  private _option: NglDynamicIconEqOption;

  isAnimated() {
    return this.option !== 'stop';
  }

}
