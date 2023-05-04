import { Component, ChangeDetectionStrategy, Input, HostBinding, OnChanges } from '@angular/core';
import { NglDatatableColumn } from './column';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'td[nglDatatatableCell_]',
  templateUrl: './cell-internal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglInternalDatatableCell implements OnChanges {
  @Input() row: any;
  @Input() column: NglDatatableColumn;
  @Input() index: number;

  @HostBinding('attr.data-label')
  get dataLabel() {
    return this.column.heading;
  }

  context: any;

  ngOnChanges() {
    this.context =  {
      $implicit: this.value,
      row: this.row,
      index: this.index,
    };
  }

  get value() {
    const { key } = this.column;
    return key ? this.row[ key ] : null;
  }
}
