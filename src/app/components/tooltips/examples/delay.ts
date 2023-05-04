import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-tooltips-delay',
  templateUrl: './delay.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoTooltipsDelay {
  open = false;
}
