import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-popovers-placement',
  templateUrl: './placement.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPopoversPlacement {
  open: any = {};
}
