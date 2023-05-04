import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-popovers-size',
  templateUrl: './size.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPopoversSize {
  open: any = {};
}
