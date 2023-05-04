import { Directive, HostBinding, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { InputBoolean } from '../util/convert';
import { NglCarouselImage } from './carousel-image';
import { uniqueId } from '../util/util';

@Directive({
  selector: '[nglCarouselIndicator]',
})
export class NglCarouselIndicator implements OnChanges {

  @HostBinding('class.slds-is-active')
  @HostBinding('attr.aria-selected')
  @Input() @InputBoolean() isActive;

  @HostBinding('attr.tabindex')
  get tabindex() {
    return this.isActive ? 0 : -1;
  }

  @Input() image: NglCarouselImage;

  @HostBinding('attr.id')
  uid = uniqueId('carousel-indicator');

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    this.image.active = this.isActive;

    if (changes.image) {
      this.image.labelledby = this.uid;
    }
  }

  focus() {
    this.el.nativeElement.focus();
  }
}
