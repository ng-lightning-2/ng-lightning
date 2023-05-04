import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-progressbar-basic',
  templateUrl: './basic.html',
})
export class DemoProgressBarBasic {

  value = 40;
  variant: string = null;
  size = 'large';

  private sizes: string[] = ['x-small', 'small', 'medium', 'large'];

  random() {
    this.value = Math.floor(Math.random() * 100 + 1);
  }

  changeVariant() {
    this.variant = this.variant ? null : 'circular';
  }

  changeSize() {
    this.size = this.sizes[(this.sizes.indexOf(this.size) + 1) % this.sizes.length];
  }
}
