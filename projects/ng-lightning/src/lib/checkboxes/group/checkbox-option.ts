import { Component, TemplateRef, Input, ContentChild, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NglCheckboxInput } from '../input/input';
import { HostService } from '../../common/host/host.service';

@Component({
  selector: 'ngl-checkbox-option',
  templateUrl: './checkbox-option.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HostService],
})
export class NglCheckboxOption {
  @Input() label: string | TemplateRef<any>;

  @ContentChild(NglCheckboxInput, { static: true }) input: NglCheckboxInput;

  constructor(private cd: ChangeDetectorRef, private element: ElementRef, private hostService: HostService) {}

  set type(type: string) {
    this._type = type;
    this.setHostClass();
    this.cd.detectChanges();
  }
  get type() {
    return this._type;
  }

  private _type: string;

  setError(id: string) {
    this.input.describedBy = id;
  }

  private setHostClass() {
    this.hostService.updateClass(this.element, {
      [`slds-checkbox`]: this.type === 'list',
      [`slds-button`]: this.type === 'button',
      [`slds-checkbox_button`]: this.type === 'button',
    });
  }

}
