import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: './intro.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.intro]': 'true',
  },
})
export class IntroComponent {}
