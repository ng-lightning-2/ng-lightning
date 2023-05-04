import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IHSV, getHexFromHsv, getHsvFromHex } from '../util';

@Component({
  selector: 'ngl-colorpicker-custom',
  templateUrl: './colorpicker-custom.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglColorpickerCustom implements OnChanges {

  @Input() hsv: IHSV;

  @Output() hsvChange = new EventEmitter<IHSV>();

  hex: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'slds-color-picker__custom');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hsv) {
      this.hex = getHexFromHsv(this.hsv);
    }
  }

  onHsvChange($event: IHSV) {
    this.hsvChange.emit($event);
  }

  onHexChange(hex: string) {
    const hsv = getHsvFromHex(hex);
    this.hsvChange.emit(hsv);
  }
}
