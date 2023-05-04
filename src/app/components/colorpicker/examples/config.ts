import { Component } from '@angular/core';
import { NGL_COLORPICKER_CONFIG, NglColorpickerConfig } from 'ng-lightning';

@Component({
  selector: 'app-demo-colorpicker-config',
  templateUrl: './config.html',
  providers: [
    {
      provide: NGL_COLORPICKER_CONFIG,
      useValue: <NglColorpickerConfig>{
        swatchColors: ['#000000', '#fe4a49', '#2ab7ca', '#fed766', '#e6e6ea', '#f4f4f8', '#ffffff'],
        variant: 'swatches',
      }
    },
  ],
})
export class DemoColorpickerConfig {
  color: string;
}
