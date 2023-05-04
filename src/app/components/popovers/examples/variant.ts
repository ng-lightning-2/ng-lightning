import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-popovers-variant',
  templateUrl: './variant.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPopoversVariant {
  open: any = {};
}
