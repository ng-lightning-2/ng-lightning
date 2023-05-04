import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, selectElements, dispatchFixtureKeyEvent } from '../../../test/util';
import { NglTabsModule } from './module';
import { By } from '@angular/platform-browser';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getTabsContainer(element: Element): HTMLElement {
  return <HTMLElement>element.firstElementChild;
}

function getTabsElement(element: Element): HTMLUListElement {
  return <HTMLUListElement>element.querySelector('ul');
}

function getTabHeaders(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'li > a');
}

function getTabContent(element: HTMLElement): string {
  return element.querySelector('.slds-tabs_default__content.slds-show').textContent;
}

function expectHeaders(element: HTMLElement, expected: string[]) {
  const headers = getTabHeaders(element);
  expect(headers.map((h: HTMLElement) => h.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim())).toEqual(expected);
}

describe('Tabs Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglTabsModule]}));

  it('should render the tabs container', () => {
    const fixture = createTestComponent();
    const host = getTabsContainer(fixture.nativeElement);
    const tabs = getTabsElement(host);

    expect(host).toHaveClass('slds-tabs_default');
    expect(tabs.tagName).toBe('UL');
    expect(tabs).toHaveClass('slds-tabs_default__nav');
  });

  it('should render the tab headers', () => {
    const fixture = createTestComponent();
    expectHeaders(fixture.nativeElement, ['First', 'Second',  'Third tab', 'Fourth tab']);
  });

  it('should have the proper aria attributes for headers and content', () => {
    const fixture = createTestComponent();

    const items = selectElements(fixture.nativeElement, 'li.slds-tabs_default__item');
    const contents = selectElements(fixture.nativeElement, '.slds-tabs_default__content');

    expect(items.length).toBe(4);
    expect(contents.length).toBe(4);
    for (let i = 0; i < 4; i++) {
      const item = items[i];
      const content = contents[i];
      expect(item.getAttribute('aria-controls')).toEqual(content.getAttribute('id'));
      expect(content.getAttribute('aria-labelledby')).toEqual(item.getAttribute('id'));
    }
  });

  it('should render tab headers based on template', () => {
    const fixture = createTestComponent(`<ngl-tabset [(selected)]="selectedTab">
          <ng-template #h><b>My header</b></ng-template>
          <ng-template ngl-tab [label]="h"></ng-template>
          <ngl-tab label="Simple">
            <ng-template ngl-tab-content></ng-template>
          </ngl-tab>
          <ngl-tab>
            <ng-template ngl-tab-label><i>Another</i> header</ng-template>
            <ng-template ngl-tab-content></ng-template>
          </ngl-tab>
        </ngl-tabset>`);
    expectHeaders(fixture.nativeElement, ['<b>My header</b>', 'Simple', '<i>Another</i> header']);
  });

  it('should activate tab based on id', () => {
    const fixture = createTestComponent();
    expect(getTabContent(fixture.nativeElement)).toBe('Tab 2');
  });

  it('should render the appropriate attributes based on selection', () => {
    const fixture = createTestComponent();
    const headers = getTabHeaders(fixture.nativeElement);

    for (let i = 0; i < 4; i++) {
      const isSelected = i === 1;
      expect(headers[i].getAttribute('aria-selected')).toEqual(`${isSelected}`);
      expect(headers[i].getAttribute('tabindex')).toEqual(isSelected ? `0` : `-1`);
    }
  });

  it('should request tab activation on header click', () => {
    const fixture = createTestComponent();

    const headers = getTabHeaders(fixture.nativeElement);
    headers[2].click();
    fixture.detectChanges();
    expect(getTabContent(fixture.nativeElement)).toBe('Tab 3');

    headers[3].click();
    fixture.detectChanges();
    expect(getTabContent(fixture.nativeElement)).toBe('Tab 4');
  });

  it('should activate tab based on keyboard', () => {
    const fixture = createTestComponent();
    const predicate = By.css('ul[role=tablist]');

    dispatchFixtureKeyEvent(fixture, predicate, `keydown.ArrowLeft`);
    fixture.detectChanges();
    expect(getTabContent(fixture.nativeElement)).toBe('Tab 1');

    dispatchFixtureKeyEvent(fixture, predicate, `keydown.ArrowRight`);
    fixture.detectChanges();
    expect(getTabContent(fixture.nativeElement)).toBe('Tab 2');

    dispatchFixtureKeyEvent(fixture, predicate, `keydown.ArrowRight`);
    fixture.detectChanges();
    expect(getTabContent(fixture.nativeElement)).toBe('Tab 3');
  });

  it('should call activate/deactivate methods accordingly', () => {
    const fixture = createTestComponent();
    const { componentInstance } = fixture;

    expect(componentInstance.activate).not.toHaveBeenCalled();
    componentInstance.selectedTab = 'three';
    fixture.detectChanges();
    expect(componentInstance.activate).toHaveBeenCalledWith(true);

    componentInstance.selectedTab = 3; // index based
    fixture.detectChanges();
    expect(componentInstance.activate).toHaveBeenCalledWith(false);
    expect(componentInstance.activate).toHaveBeenCalledWith(4, true);

    componentInstance.selectedTab = 'two';
    fixture.detectChanges();
    expect(componentInstance.activate).toHaveBeenCalledWith(4, false);
  });

  it('should allow activating tab from outside', () => {
    const fixture = createTestComponent(`
      <ngl-tabset [selected]="selectedTab" (selectedChange)="change($event)">
        <ng-template ngl-tab></ng-template>
        <ng-template ngl-tab id="another" #anotherTab="nglTab">Another tab</ng-template>
      </ngl-tabset>
      <button (click)="selectedTab = anotherTab"></button>
    `, false);
    fixture.componentInstance.selectedTab = 0;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');

    expect(getTabContent(fixture.nativeElement)).not.toBe('Another tab');
    button.click();
    fixture.detectChanges();
    expect(getTabContent(fixture.nativeElement)).toBe('Another tab');
  });

  it('should render scoped tabs correctly', () => {
    const fixture = createTestComponent(`
      <ngl-tabset variant="scoped">
        <ng-template ngl-tab></ng-template>
      </ngl-tabset>
    `);

    const host = getTabsContainer(fixture.nativeElement);
    const tabs = getTabsElement(host);

    expect(host).toHaveClass('slds-tabs_scoped');
    expect(host).not.toHaveClass('slds-tabs_default');
    expect(tabs).toHaveClass('slds-tabs_scoped__nav');
  });

  it('should have the proper aria attributes for headers and content', () => {
    const fixture = createTestComponent(`
      <ngl-tabset selected="1" [lazy]="lazy">
        <ng-template ngl-tab>Tab 0</ng-template>
        <ng-template ngl-tab>Tab 1</ng-template>
        <ng-template ngl-tab>Tab 2</ng-template>
      </ngl-tabset>
    `);
    const contents = <HTMLDivElement[]>selectElements(fixture.nativeElement, '.slds-tabs_default__content');

    expect(contents.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      const isActive = i === 1;
      expect(contents[i]).toHaveClass('slds-tabs_default__content');
      expect(contents[i]).toHaveClass(isActive ? 'slds-show' : 'slds-hide');
      expect(contents[i].textContent).toEqual(isActive ? `Tab ${i}` : '');
    }

    fixture.componentInstance.lazy = false;
    fixture.detectChanges();
    expect(contents.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      const isActive = i === 1;
      expect(contents[i]).toHaveClass('slds-tabs_default__content');
      expect(contents[i]).toHaveClass(isActive ? 'slds-show' : 'slds-hide');

      // Content always exists
      expect(contents[i].textContent).toEqual(`Tab ${i}`);
    }
  });

});

@Component({
  template: `
    <ngl-tabset [selected]="selectedTab" (selectedChange)="change($event)">
      <ng-template ngl-tab label="First">Tab 1</ng-template>
      <ng-template ngl-tab id="two" label="Second">Tab 2</ng-template>
      <ng-template ngl-tab id="three" label="Third tab" (activate)="activate(true)"
            (deactivate)="activate(false)">Tab 3</ng-template>
      <ngl-tab (activate)="activate(4, true)" (deactivate)="activate(4, false)">
        <ng-template ngl-tab-label>Fourth tab</ng-template>
        <ng-template ngl-tab-content>Tab 4</ng-template>
      </ngl-tab>
    </ngl-tabset>
  `,
})
export class TestComponent {
  selectedTab: string | number = 'two';
  titleCaps: string | boolean = false;
  lazy = true;
  change = jasmine.createSpy('selectedChange').and.callFake(($event: any) => {
    this.selectedTab = $event;
  });
  activate = jasmine.createSpy('activate');
}
