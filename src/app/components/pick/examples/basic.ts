import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-pick-basic',
  templateUrl: './basic.html',
})
export class DemoPickBasic {

  selected = 'middle';

  multiple = ['middle', 'right'];

  multipleObject = {
    left: true,
    middle: true,
  };
}
