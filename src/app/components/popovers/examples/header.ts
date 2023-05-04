import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-popovers-header',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPopoversHeader {
  open = false;
}
