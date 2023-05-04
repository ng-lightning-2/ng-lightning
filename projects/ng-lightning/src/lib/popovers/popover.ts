import { Component, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef,
  TemplateRef, ElementRef, Renderer2, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { uniqueId, ngClassCombine } from '../util/util';
import { Placement, POSITION_MAP, getPlacementStyles } from '../util/overlay-position';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { Variant, Size } from './trigger';
import { HostService } from '../common/host/host.service';
import { isTemplateRef } from '../util/check';
import { OnChange } from '../util/property-watch-decorator';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'section[ngl-popover]',
  templateUrl: './popover.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HostService],
  host: {
    'role': 'dialog',
    '[class.slds-popover]': 'true',
  },
})
export class NglPopover implements OnInit, OnDestroy {

  template: string | TemplateRef<void>;

  header: string | TemplateRef<void>;

  footer: string | TemplateRef<void>;

  closeTitle: string;

  closeVisible: boolean;

  @OnChange() popoverClass: any;

  @OnChange() size: Size;

  @OnChange() variant: Variant;

  @OnChange() placement: Placement;

  @HostBinding('attr.aria-labelledby')
  get labelledby() {
    return this.header ? `${this.uid}-heading` : null;
  }

  @HostBinding('attr.aria-describedby')
  get describedby() {
    return this.template ? this.uid : null;
  }

  close = new EventEmitter();

  isTemplateRef = isTemplateRef;
  canClose: boolean;
  uid = uniqueId('popover');
  inverseCloseButton: boolean;

  private nubbin: Placement;

  /** The class that traps and manages focus within the dialog. */
  private focusTrap: FocusTrap;

  constructor(
    private hostService: HostService,
    public element: ElementRef,
    public renderer: Renderer2,
    private focusTrapFactory: FocusTrapFactory,
    private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.focusTrap = this.focusTrapFactory.create(this.element.nativeElement);
    this.focusTrap.focusInitialElementWhenReady();
  }

  ngOnDestroy() {
  if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = null;
    }
  }

  nglOnPropertyChange(prop) {
    if (prop === 'size' || prop === 'popoverClass') {
      this.setHostClass();
    } else if (prop === 'placement') {
      this.nubbin = POSITION_MAP[this.placement].nubbin;
      this.setHostClass();
    } else if (prop === 'variant') {
      this.inverseCloseButton = ['walkthrough', 'feature', 'error'].indexOf(this.variant) > -1;
      this.setHostClass();
    }
  }

  markForCheck() {
    this.cd.markForCheck();
  }

  onClose() {
    this.close.emit();
  }

  private setHostClass() {
    this.hostService.updateClass(this.element, ngClassCombine(this.popoverClass, {
      [`slds-nubbin_${this.nubbin}`]: true,
      [`slds-popover_${this.size}`]: !!this.size,
      [`slds-popover_walkthrough`]: this.variant === 'feature',
      [`slds-popover_${this.variant}`]: !!this.variant,
    }));

    this.hostService.updateStyle(this.element, getPlacementStyles(this.nubbin));
  }

}
