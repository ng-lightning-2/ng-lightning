import { fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Injectable, OnDestroy, ViewChild } from '@angular/core';
import { createGenericTestComponent, dispatchEvent } from '../../../test/util';
import { NglTooltipsModule } from './module';
import { HostService } from '../common/host/host.service';
import { expectPlacementStyles } from '../popovers/popover.spec';
import { NglTooltipTrigger } from './trigger';
import { NGL_TOOLTIP_CONFIG, NglTooltipConfig } from './config';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

export function getTooltipElement(): HTMLElement {
  return document.querySelector('.slds-popover_tooltip');
}

describe('Tooltips', () => {
  let fixture: any;

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [TestComponent, DestroyableComponent],
    imports: [NglTooltipsModule],
    providers: [SpyService, HostService],
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should render the created tooltip correctly', () => {
    fixture = createTestComponent();
    const tooltipEl = getTooltipElement();
    expect(tooltipEl).toHaveClass('slds-popover');
    expect(tooltipEl.getAttribute('role')).toBe('tooltip');
    expect(tooltipEl).toHaveClass('slds-nubbin_bottom'); // Top placement
    expect(tooltipEl.textContent.trim()).toBe('I am a tooltip');
  });

  it('should render aria correctly', () => {
    fixture = createTestComponent();
    const tooltipEl = getTooltipElement();
    const triggerEl = fixture.nativeElement.firstElementChild;
    expect(tooltipEl.getAttribute('id')).toBe(triggerEl.getAttribute('aria-describedby'));
  });

  it('should render tooltip with string content', () => {
    fixture = createTestComponent(`<button [nglTooltip]="text" nglTooltipOpen="true"></button>`, false);
    fixture.componentInstance.text = 'I am a string';
    fixture.detectChanges();

    const tooltipEl = getTooltipElement();
    expect(tooltipEl.textContent.trim()).toBe('I am a string');

    fixture.componentInstance.text = 'A new string';
    fixture.detectChanges();
    expect(tooltipEl.textContent.trim()).toBe('A new string');
  });

  it('should render tooltip with template content', () => {
    fixture = createTestComponent(`
      <ng-template #tooltip>I am a string</ng-template>
      <a [nglTooltip]="tooltip" nglTooltipOpen="true"></a>
    `);
    const tooltipEl = getTooltipElement();
    expect(tooltipEl.textContent.trim()).toBe('I am a string');
  });

  it('should change visibility based on trigger', () => {
    fixture = createTestComponent();
    expect(getTooltipElement()).toBeTruthy();

    fixture.componentInstance.open = false;
    fixture.detectChanges();

    expect(getTooltipElement()).toBeFalsy();
  });

  it('should change nubbin based on placement', () => {
    fixture = createTestComponent();
    const { componentInstance } = fixture;
    const tooltipEl = getTooltipElement();

    expect(tooltipEl).toHaveClass('slds-nubbin_bottom');
    expectPlacementStyles(tooltipEl, { bottom: '1rem' });

    componentInstance.placement = 'left';
    fixture.detectChanges();
    expect(tooltipEl).toHaveClass('slds-nubbin_right');
    expect(tooltipEl).not.toHaveClass('slds-nubbin_bottom');
    expectPlacementStyles(tooltipEl, { right: '1rem' });

    componentInstance.placement = 'right-top';
    fixture.detectChanges();
    expect(tooltipEl).toHaveClass('slds-nubbin_left-top');
    expectPlacementStyles(tooltipEl, { left: '1rem', top: '-1.5rem' });

    componentInstance.placement = 'left-bottom';
    fixture.detectChanges();
    expect(tooltipEl).toHaveClass('slds-nubbin_right-bottom');
    expectPlacementStyles(tooltipEl, { right: '1rem', bottom: '-1.5rem' });

    componentInstance.placement = 'bottom';
    fixture.detectChanges();
    expect(tooltipEl).toHaveClass('slds-nubbin_top');
    expect(tooltipEl).not.toHaveClass('slds-nubbin_right');
    expectPlacementStyles(tooltipEl, { top: '1rem' });

    componentInstance.placement = 'left-bottom-corner';
    fixture.detectChanges();
    expect(tooltipEl).toHaveClass('slds-nubbin_right-bottom-corner');
    expectPlacementStyles(tooltipEl, { right: '1rem', bottom: '-0.75rem' });
  });

  it('should destroy tooltip when host is destroyed', () => {
    fixture = createTestComponent(`<ng-template #tip></ng-template><button *ngIf="exists" [nglTooltip]="tip" nglTooltipOpen="true"></button>`, false);
    const { componentInstance } = fixture;

    componentInstance.exists = true;
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();

    componentInstance.exists = false;
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();
  });

  it('should support "manual" opening', fakeAsync(() => {
    fixture = createTestComponent(`<button nglTooltipDelay="200" nglTooltip="tip" (nglTooltipOpenChange)="cb($event)"></button>`);
    const { componentInstance } = fixture;

    componentInstance.tooltip.open();
    fixture.detectChanges();
    expect(componentInstance.cb).not.toHaveBeenCalled();

    tick(200);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(true);
  }));

  it('should support "manual" closing', fakeAsync(() => {
    fixture = createTestComponent(`<button nglTooltipDelay="200" nglTooltip="tip" nglTooltipOpen="true" (nglTooltipOpenChange)="cb($event)"></button>`);
    const { componentInstance } = fixture;

    componentInstance.tooltip.close();
    fixture.detectChanges();
    expect(componentInstance.cb).not.toHaveBeenCalled();

    tick(200);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(false);
  }));

  it('should support "manual" opening and closing with custom delay', () => {
    fixture = createTestComponent(`<button nglTooltip="tip" nglTooltipDelay="200" [(nglTooltipOpen)]="open"></button>`);
    const tooltip = fixture.componentInstance.tooltip;

    expect(getTooltipElement()).toBeTruthy();

    tooltip.close(0);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();

    tooltip.open(0);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();
  });

  it('should support "manual" toggle', () => {
    fixture = createTestComponent();
    const tooltip = fixture.componentInstance.tooltip;

    expect(getTooltipElement()).toBeTruthy();

    tooltip.toggle();
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();

    tooltip.toggle();
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();
  });

  it('should change visibility based on mouse', () => {
    fixture = createTestComponent();
    const triggerEl = fixture.nativeElement.firstElementChild;

    dispatchEvent(triggerEl, 'mouseleave');
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();

    dispatchEvent(triggerEl, 'mouseenter');
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();
  });

  it('should change visibility based on focus', () => {
    fixture = createTestComponent();
    const triggerEl = fixture.nativeElement.firstElementChild;

    dispatchEvent(triggerEl, 'blur');
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();

    dispatchEvent(triggerEl, 'focus');
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();
  });

  it('should support delayed opening/closing based on focus', fakeAsync(() => {
    fixture = createTestComponent(`<button nglTooltip="tip" nglTooltipDelay="200" [(nglTooltipOpen)]="open" (nglTooltipOpenChange)="cb($event)"></button>`);
    const { componentInstance } = fixture;

    expect(componentInstance.cb).not.toHaveBeenCalled();
    const triggerEl = fixture.nativeElement.firstElementChild;

    dispatchEvent(triggerEl, 'blur');
    fixture.detectChanges();
    expect(componentInstance.cb).not.toHaveBeenCalled();

    tick(200);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(false);

    dispatchEvent(triggerEl, 'focus');
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(true);
  }));

  it('should support delayed opening/closing based on mouse', fakeAsync(() => {
    fixture = createTestComponent(
      `<button nglTooltip="tip" nglTooltipDelay="200" [(nglTooltipOpen)]="open" (nglTooltipOpenChange)="cb($event)"></button>`);
    const { componentInstance } = fixture;

    expect(componentInstance.cb).not.toHaveBeenCalled();
    const triggerEl = fixture.nativeElement.firstElementChild;

    dispatchEvent(triggerEl, 'mouseleave');
    fixture.detectChanges();
    expect(componentInstance.cb).not.toHaveBeenCalled();

    tick(200);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(false);

    dispatchEvent(triggerEl, 'mouseenter');
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(true);
  }));

  it('should support different opening and closing delays', fakeAsync(() => {
    fixture = createTestComponent(
      '<button nglTooltip="tip" [(nglTooltipOpen)]="open" [nglTooltipDelay]="[100, 500]" (nglTooltipOpenChange)="cb($event)"></button>');
    const { componentInstance } = fixture;

    const triggerEl = fixture.nativeElement.firstElementChild;

    dispatchEvent(triggerEl, 'blur');
    fixture.detectChanges();
    expect(componentInstance.cb).not.toHaveBeenCalled();

    tick(500);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(false);

    dispatchEvent(triggerEl, 'focus');
    fixture.detectChanges();

    tick(100);
    fixture.detectChanges();
    expect(componentInstance.cb).toHaveBeenCalledWith(true);
  }));

  it('should not create more than one instances', () => {
    fixture = createTestComponent();
    const triggerEl = fixture.nativeElement.firstElementChild;
    dispatchEvent(triggerEl, 'focus');
    fixture.detectChanges();
    dispatchEvent(triggerEl, 'mouseenter');
    fixture.detectChanges();
    expect(document.querySelectorAll('.slds-popover_tooltip').length).toBe(1);
  });

  it('should support interaction with content', fakeAsync(() => {
    fixture = createTestComponent('<button nglTooltip="tip" nglTooltipInteractive="true" [nglTooltipDelay]="[0, 200]" [(nglTooltipOpen)]="open"></button>');
    let overlayElement = fixture.componentInstance.tooltip.overlayRef.overlayElement;
    const triggerEl = fixture.nativeElement.firstElementChild;

    expect(getTooltipElement()).toBeTruthy();

    dispatchEvent(triggerEl, 'mouseleave');
    fixture.detectChanges();

    dispatchEvent(getTooltipElement(), 'mouseenter');
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();

    dispatchEvent(overlayElement, 'mouseleave');
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();

    // Open the tooltip again to check that interactivity still works
    dispatchEvent(triggerEl, 'mouseenter');
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();
    overlayElement = fixture.componentInstance.tooltip.overlayRef.overlayElement;

    dispatchEvent(triggerEl, 'mouseleave');
    fixture.detectChanges();

    dispatchEvent(getTooltipElement(), 'mouseenter');
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();

    dispatchEvent(overlayElement, 'mouseleave');
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();
  }));

  it('should properly destroy TemplateRef content', () => {
    fixture = createTestComponent(`
      <ng-template #t><destroyable></destroyable></ng-template>
      <a [nglTooltip]="t" [(nglTooltipOpen)]="open"></a>
    `);
    const tooltip = fixture.componentInstance.tooltip;

    const spyService = fixture.debugElement.injector.get(SpyService);
    expect(spyService.called).not.toHaveBeenCalled();

    tooltip.close();
    fixture.detectChanges();
    expect(spyService.called).toHaveBeenCalled();
  });

  it('should not close if open is called before delay finishes', fakeAsync(() => {
    fixture = createTestComponent();
    const tooltip = fixture.componentInstance.tooltip;

    tooltip.close(1000);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();

    tooltip.open(0);
    tick(1000);
    fixture.detectChanges();
    expect(getTooltipElement()).toBeTruthy();
  }));

  it('should be able to trigger open/close without input binding', () => {
    fixture = createTestComponent(`<button nglTooltip="Text string" nglTooltipOpenAuto></button>`);
    expect(getTooltipElement()).toBeFalsy();

    const triggerEl = fixture.nativeElement.firstElementChild;
    dispatchEvent(triggerEl, 'mouseenter');
    fixture.detectChanges();
    expect(getTooltipElement().textContent.trim()).toBe('Text string');

    dispatchEvent(triggerEl, 'mouseleave');
    fixture.detectChanges();
    expect(getTooltipElement()).toBeFalsy();
  });

  it('should support custom classes', () => {
    fixture = createTestComponent(`<button
      [nglTooltip]="tip"
      [nglTooltipClass]="tooltipClass"
      [nglTooltipOpen]="true"></button>`);

    const tooltipEl = getTooltipElement();
    fixture.componentInstance.tooltipClass = ['cl1', 'cl2'];
    fixture.detectChanges();
    expect(tooltipEl).toHaveClass('slds-popover');
    expect(tooltipEl).toHaveClass('slds-popover_tooltip');
    expect(tooltipEl).toHaveClass('slds-nubbin_bottom');
    expect(tooltipEl).toHaveClass('cl1');
    expect(tooltipEl).toHaveClass('cl2');

    fixture.componentInstance.tooltipClass = { cl1: true, cl3: true, cl4: false };
    fixture.detectChanges();
    expect(tooltipEl).toHaveClass('slds-nubbin_bottom');
    expect(tooltipEl).toHaveClass('cl1');
    expect(tooltipEl).not.toHaveClass('cl2');
    expect(tooltipEl).toHaveClass('cl3');
    expect(tooltipEl).not.toHaveClass('cl4');
  });

  describe('custom configuration', () => {
    it('should have configurable "placement" and "openAuto"', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: NGL_TOOLTIP_CONFIG, useValue: <NglTooltipConfig>{ placement: 'left', openAuto: true } },
        ],
      });

      fixture = createTestComponent(`<div style="padding: 200px"><button nglTooltip="Config works"></button></div>`);
      expect(getTooltipElement()).toBeFalsy();

      const triggerEl = fixture.nativeElement.querySelector('button');
      dispatchEvent(triggerEl, 'mouseenter');
      fixture.detectChanges();

      const tooltipEl = getTooltipElement();
      expect(tooltipEl.textContent.trim()).toBe('Config works');
      expect(tooltipEl).toHaveClass('slds-nubbin_right');
    });

    it('should have configurable "delay"', fakeAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: NGL_TOOLTIP_CONFIG, useValue: <NglTooltipConfig>{ delay: [500, 1000] } },
        ],
      });

      fixture = createTestComponent(`<div style="padding: 200px"><button nglTooltip="Config works" (nglTooltipOpenChange)="cb($event)"></button></div>`);
      const { componentInstance } = fixture;
      const triggerEl = fixture.nativeElement.querySelector('button');

      dispatchEvent(triggerEl, 'focus');
      fixture.detectChanges();
      expect(componentInstance.cb).not.toHaveBeenCalled();

      dispatchEvent(triggerEl, 'blur');
      fixture.detectChanges();
      expect(componentInstance.cb).not.toHaveBeenCalled();

      tick(1000);
      fixture.detectChanges();
      expect(componentInstance.cb).toHaveBeenCalledWith(false);

      dispatchEvent(triggerEl, 'focus');

      tick(500);
      fixture.detectChanges();
      expect(componentInstance.cb).toHaveBeenCalledWith(true);
    }));
  });
});

@Component({
  template: `
    <ng-template #tip>I am a tooltip</ng-template>
    <button
      [nglTooltip]="tip"
      [nglTooltipPlacement]="placement"
      [(nglTooltipOpen)]="open"
      (nglTooltipOpenChange)="cb($event)">Open here
    </button>
  `,
})
export class TestComponent {
  @ViewChild(NglTooltipTrigger) tooltip: NglTooltipTrigger;
  placement: string;
  open = true;
  exists: boolean;
  text: string;

  cb = jasmine.createSpy('cb');
}


@Injectable()
class SpyService {
  called = jasmine.createSpy('spyCall');
}

// tslint:disable-next-line:component-selector
@Component({selector: 'destroyable', template: 'Some content'})
export class DestroyableComponent implements OnDestroy {

  constructor(private service: SpyService) {}

  ngOnDestroy() {
    this.service.called();
  }
}
