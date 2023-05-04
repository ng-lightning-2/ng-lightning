import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, HostListener,
        HostBinding, ContentChild, ViewChild, TemplateRef, OnInit, AfterContentInit, Optional, Inject } from '@angular/core';
import { NglRatingIconTemplate } from './icons';
import { InputBoolean } from '../util/convert';
import { NGL_RATING_CONFIG, NglRatingConfig } from './config';

@Component({
  selector: 'ngl-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating.html',
  host: {
    'style': 'white-space: nowrap;',
    'tabindex': '0',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max',
  },
})
export class NglRating implements OnInit, AfterContentInit {

  range: number[] = [];
  currentRate: number;

  @Input() icon = 'favorite';

  @Input() size: 'x-small' | 'small' | 'large';

  @Input('isReadonly') @InputBoolean() readonly = false;

  @Input() set rate(rate: number) {
    this.inputRate = rate;
    this.currentRate = rate;
  }

  @ViewChild('t', { static: true }) defaultTemplate: TemplateRef<any>;
  @ContentChild(NglRatingIconTemplate) iconTemplate: NglRatingIconTemplate;

  @Input() set max(max: number | string) {
    this._max = +max;
    this.setRange();
  }
  get max() {
    return this._max;
  }

  @Input() colorOn: string;
  @Input() colorOff: string;

  @Output() rateChange = new EventEmitter<number>();
  @Output() hover = new EventEmitter<number>();

  _template: TemplateRef<any>;
  private _max = 5;
  private inputRate: number;

  constructor(@Optional() @Inject(NGL_RATING_CONFIG) defaultConfig: NglRatingConfig) {
    const config = { ...new NglRatingConfig(), ...defaultConfig };
    this.colorOn = config.colorOn;
    this.colorOff = config.colorOff;
  }

  ngOnInit() {
    this.setRange();
  }

  ngAfterContentInit() {
    this._template = this.iconTemplate ? this.iconTemplate.templateRef : this.defaultTemplate;
  }

  update(value: number) {
    if (value < 1 || value > this.max || this.readonly || value === this.inputRate) { return; }
    this.rateChange.emit(value);
  }

  enter(value: number) {
    if (this.readonly) { return; }

    this.currentRate = value;
    this.hover.emit(value);
  }

  getFill(value: number) {
    if (value <= this.currentRate) {
      return 100;
    }
    if (Math.ceil(this.currentRate) < value) {
      return 0;
    }

    return Math.round(100 * (this.currentRate % 1));
  }

  @HostListener('mouseleave') reset() {
    this.currentRate = this.inputRate;
  }

  // Keyboard interactions
  @HostListener('keydown.ArrowUp', ['$event'])
  @HostListener('keydown.ArrowRight', ['$event'])
  keyboardIncrease(evt: KeyboardEvent) {
    evt.preventDefault();
    this.update(this.inputRate + 1);
  }

  @HostListener('keydown.ArrowDown', ['$event'])
  @HostListener('keydown.ArrowLeft', ['$event'])
  keyboardDecrease(evt: KeyboardEvent) {
    evt.preventDefault();
    this.update(this.inputRate - 1);
  }

  // ARIA
  @HostBinding('attr.aria-valuenow') get ariaValuenow() {
    return this.inputRate;
  }

  private setRange() {
    this.range = Array.apply(null, {length: this.max}).map((value: any, index: number) => index + 1);
  }
}
