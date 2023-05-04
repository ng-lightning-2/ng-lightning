import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NglDropdown } from './dropdown';
import { createGenericTestComponent, dispatchFixtureKeyEvent } from '../../../test/util';
import { By } from '@angular/platform-browser';
import { NglMenusModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getDropdownElement(element: HTMLElement): HTMLElement {
  return <HTMLElement>element.firstElementChild;
}

function getDropdownTrigger(element: HTMLElement): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

function getDropdownItem(element: HTMLElement): HTMLElement {
  return <HTMLElement>element.querySelector('[nglDropdownItem]');
}

function getOutsideDropdownElement(element: HTMLElement): HTMLElement {
  return <HTMLElement>element.children[1];
}

describe('`nglDropdown`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglMenusModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const dropdownEl = getDropdownElement(fixture.nativeElement);
    expect(dropdownEl).toHaveClass('slds-dropdown-trigger');
    expect(dropdownEl).toHaveClass('slds-dropdown-trigger_click');
    fixture.destroy();
  });

  it('should be closed when initialized as closed', () => {
    const fixture = createTestComponent();
    const dropdownEl = getDropdownElement(fixture.nativeElement);
    expect(dropdownEl).not.toHaveClass('slds-is-open');
    expect(dropdownEl.getAttribute('aria-expanded')).toBe('false');
    fixture.destroy();
  });

  it('should be opened when input variable `open` is set to true', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const dropdownEl = getDropdownElement(fixture.nativeElement);
    expect(dropdownEl).toHaveClass('slds-is-open');
    expect(dropdownEl.getAttribute('aria-expanded')).toBe('true');
    fixture.destroy();
  });

  describe('when anything outside the dropdown is clicked', () => {
    it('should close', async(() => {
      const fixture = createTestComponent(null, false);
      const outsideDropdownElement = getOutsideDropdownElement(fixture.nativeElement);
      fixture.componentInstance.open = true;
      fixture.detectChanges();

      setTimeout(() => { // Wait for document subsription
        expect(fixture.componentInstance.setOpen).not.toHaveBeenCalled();
        outsideDropdownElement.click();
        expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(false);
        fixture.destroy();
      });
    }));

    it('should not close when handlePageEvents is false', async(() => {
      const fixture = createTestComponent(`
        <div nglDropdown [open]="open" (openChange)="setOpen($event)" [handlePageEvents]="handlePageEvents">
          <button type="button" nglDropdownTrigger></button>
          <div nglDropdownItem></div>
        </div>
        <div></div>`, false);
      const outsideDropdownElement = getOutsideDropdownElement(fixture.nativeElement);
      fixture.componentInstance.handlePageEvents = false;
      fixture.componentInstance.open = true;
      fixture.detectChanges();

      setTimeout(() => { // Wait for document subsription
        expect(fixture.componentInstance.setOpen).not.toHaveBeenCalled();
        outsideDropdownElement.click();
        expect(fixture.componentInstance.setOpen).not.toHaveBeenCalled();
        fixture.destroy();
      });
    }));
  });

  it('should not close when something inside is clicked, and then removed from DOM', async(() => {
    const fixture = createTestComponent(`
      <div nglDropdown [open]="open" (openChange)="setOpen($event)">
        <button type="button" *ngIf="!disappear" (click)="disappear = true"></button>
      </div>`, false);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    setTimeout(() => { // Wait for document subsription
      const disappearElement = fixture.nativeElement.querySelector('button');
      disappearElement.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button')).toBeNull();
      expect(fixture.componentInstance.setOpen).not.toHaveBeenCalled();
      fixture.destroy();
    });
  }));

  it('should be closed when the ESC key is pressed', () => {
    const fixture = createTestComponent();
    const dropdownTrigger = getDropdownTrigger(fixture.nativeElement);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    expect(fixture.componentInstance.setOpen).not.toHaveBeenCalled();
    expect(<Element>dropdownTrigger).not.toEqual(document.activeElement);

    dispatchFixtureKeyEvent(fixture, By.directive(NglDropdown), 'keydown.esc');
    expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(false);
    expect(<Element>dropdownTrigger).toEqual(document.activeElement);
    fixture.destroy();
  });

  it('should focus on the first item onced opened and the down arrow key is pressed', () => {
    const fixture = createTestComponent();
    const dropdownTrigger = getDropdownTrigger(fixture.nativeElement);
    const dropdownItem = getDropdownItem(fixture.nativeElement);

    dropdownTrigger.click();
    expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(true);

    dispatchFixtureKeyEvent(fixture, By.directive(NglDropdown), 'keydown.arrowdown');
    expect(<Element>dropdownItem).toEqual(document.activeElement);
    fixture.destroy();
  });
});

@Component({
  template: `
    <div nglDropdown [open]="open" (openChange)="setOpen($event)">
      <button type="button" nglDropdownTrigger></button>
      <div nglDropdownItem></div>
    </div>
    <div></div>`,
})
export class TestComponent {
  open = false;
  handlePageEvents: boolean;

  setOpen = jasmine.createSpy('setOpenDropdown');
}
