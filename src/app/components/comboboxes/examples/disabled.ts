import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-comboboxes-disabled',
  templateUrl: './disabled.html',
})
export class DemoComboboxesDisabled {
  options = ['One', 'Two', 'Three'];

  selection: string = null;

  open = false;
}
