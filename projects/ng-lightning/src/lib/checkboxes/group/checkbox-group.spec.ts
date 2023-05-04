import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, selectElements } from '../../../../test/util';
import { NglCheckboxesModule } from '../module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getLabelElement(element: Element): HTMLLegendElement {
  return <HTMLLegendElement>element.querySelector('legend');
}

function getErrorElement(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.slds-form-element__help');
}

function getRequiredElement(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('abbr');
}

function getOptionElements(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'ngl-checkbox-option');
}

function getOptionLabelElements(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'label');
}

function getInputElements(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'input');
}

describe('`NglCheckboxGroup`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglCheckboxesModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;
    expect(element).toHaveClass('slds-form-element');

    const labelEl = getLabelElement(element);
    expect(labelEl).toHaveText('Group Label');

    // No messing with `button` type
    expect(fixture.nativeElement.querySelector('.slds-checkbox_button-group')).toBeFalsy();

    getOptionElements(element).forEach(e => {
      expect(e).toHaveClass('slds-checkbox');
      expect(e).not.toHaveClass('slds-button');
      expect(e).not.toHaveClass('slds-checkbox_button');
    });
  });

  it('should be able to change label', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.label = 'Another label';
    fixture.detectChanges();

    const labelEl = getLabelElement(fixture.nativeElement);
    expect(labelEl).toHaveText('Another label');
  });

  it('should render error message', () => {
    const fixture = createTestComponent(`
      <fieldset ngl-checkbox-group label [error]="error">
        <ngl-checkbox-option label><input ngl type="checkbox"></ngl-checkbox-option>
        <ngl-checkbox-option label><input ngl type="checkbox"></ngl-checkbox-option>
      </fieldset>
    `);
    const element = fixture.nativeElement.firstElementChild;

    expect(element).not.toHaveClass('slds-has-error');
    expect(getErrorElement(element)).toBeFalsy();
    fixture.componentInstance.error = 'This is an error!';
    fixture.detectChanges();

    const errorEl = getErrorElement(element);
    expect(element).toHaveClass('slds-has-error');
    expect(errorEl).toHaveText('This is an error!');

    const inputEls = getInputElements(fixture.nativeElement);
    inputEls.forEach(e => {
      expect(e.getAttribute('aria-describedby')).toEqual(errorEl.id);
    });
  });

  it('should render error message as template', () => {
    const fixture = createTestComponent(`
      <ng-template #err>This is an error!</ng-template>
      <fieldset ngl-checkbox-group label [error]="err">
        <ngl-checkbox-option label><input ngl type="checkbox"></ngl-checkbox-option>
        <ngl-checkbox-option label><input ngl type="checkbox"></ngl-checkbox-option>
      </fieldset>
    `);
    const element = fixture.nativeElement.firstElementChild;

    const errorEl = getErrorElement(element);
    expect(element).toHaveClass('slds-has-error');
    expect(errorEl).toHaveText('This is an error!');
  });

  it('should show required label indication', () => {
    const fixture = createTestComponent(`<fieldset ngl-checkbox-group label [required]="required"></fieldset>`);
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const abbrEl = getRequiredElement(fixture.nativeElement);
    expect(abbrEl).toHaveClass('slds-required');

    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should render options correctly', () => {
    const fixture = createTestComponent();
    const labelEls = getOptionLabelElements(fixture.nativeElement);
    expect(labelEls.map(e => e.textContent.trim())).toEqual(['Label One', 'Label Two']);

    const inputEls = getInputElements(fixture.nativeElement);
    expect(labelEls.map(e => e.getAttribute('for'))).toEqual(inputEls.map(e => e.getAttribute('id')));

    labelEls.forEach(e => expect(e).toHaveClass('slds-checkbox__label'));
  });

  it('should render button group', () => {
    const fixture = createTestComponent(`
      <ng-template #lbl>Label One</ng-template>
      <fieldset ngl-checkbox-group label type="button">
        <ngl-checkbox-option [label]="lbl"><input ngl type="checkbox"></ngl-checkbox-option>
        <ngl-checkbox-option [label]="'Label Two'"><input ngl type="checkbox"></ngl-checkbox-option>
      </fieldset>
    `);
    expect(fixture.nativeElement.querySelector('.slds-form-element__control').firstElementChild).toHaveClass('slds-checkbox_button-group');

    const labelEls = getOptionLabelElements(fixture.nativeElement);
    expect(labelEls.map(e => e.textContent.trim())).toEqual(['Label One', 'Label Two']);

    labelEls.forEach(e => {
      expect(e).toHaveClass('slds-checkbox_button__label');
      expect(e).not.toHaveClass('slds-checkbox__label');
    });

    getOptionElements(fixture.nativeElement).forEach(e => {
      expect(e).toHaveClass('slds-button');
      expect(e).toHaveClass('slds-checkbox_button');
      expect(e).not.toHaveClass('slds-checkbox');
    });
  });

  it('should render button group with dynamic options', () => {
    const fixture = createTestComponent(`
      <fieldset ngl-checkbox-group label type="button">
        <ngl-checkbox-option *ngFor="let opt of options" [label]="opt"><input ngl type="checkbox"></ngl-checkbox-option>
      </fieldset>
    `);
    expect(fixture.nativeElement.querySelector('.slds-form-element__control').firstElementChild).toHaveClass('slds-checkbox_button-group');

    const labelEls = getOptionLabelElements(fixture.nativeElement);
    expect(labelEls.map(e => e.textContent.trim())).toEqual(fixture.componentInstance.options);

    labelEls.forEach(e => {
      expect(e).toHaveClass('slds-checkbox_button__label');
      expect(e).not.toHaveClass('slds-checkbox__label');
    });

    getOptionElements(fixture.nativeElement).forEach(e => {
      expect(e).toHaveClass('slds-button');
      expect(e).toHaveClass('slds-checkbox_button');
      expect(e).not.toHaveClass('slds-checkbox');
    });
  });

});

@Component({
  template: `
  <fieldset ngl-checkbox-group [label]="label">
    <ngl-checkbox-option label="Label One">
      <input ngl type="checkbox">
    </ngl-checkbox-option>
    <ngl-checkbox-option label="Label Two">
      <input ngl type="checkbox">
    </ngl-checkbox-option>
  </fieldset>`,
})
export class TestComponent {
  label = 'Group Label';
  error: string;
  required: boolean;
  options = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
}
