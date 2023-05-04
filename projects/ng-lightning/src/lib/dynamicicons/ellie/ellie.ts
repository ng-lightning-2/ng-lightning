import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseDynamicIconComponent } from '../base-dynamic-icon';

@Component({
  selector: 'ngl-dynamic-icon-ellie',
  templateUrl: './ellie.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglDynamicIconEllie extends BaseDynamicIconComponent {
}
