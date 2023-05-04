import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngl-badge',
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglBadge {
  @Input() theme: string;
}
