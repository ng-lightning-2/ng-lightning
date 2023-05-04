import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../../test/util';
import { NglCheckboxesModule } from '../module';
import { getInputElement, getRequiredElement, getErrorElement } from '../input/input.spec';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getLabelElement(element: Element): HTMLLabelElement {
  return <HTMLLabelElement>element.querySelector('.slds-form-element__label');
}

function getEnabledTextElement(element: Element): HTMLSpanElement {
  return <HTMLSpanElement>element.querySelector('.slds-checkbox_on');
}

function getDisabledTextElement(element: Element): HTMLSpanElement {
  return <HTMLSpanElement>element.querySelector('.slds-checkbox_off');
}

describe('`NglCheckboxToggle`', () => {

  beforeEach(() => TestBed.configureTestingModule({ declarations: [TestComponent], imports: [NglCheckboxesModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;
    expect(element).toHaveClass('slds-form-element');

    const labelEl = getLabelElement(fixture.nativeElement);
    expect(labelEl).toHaveText('My label');

    const enabledText = getEnabledTextElement(fixture.nativeElement);
    expect(enabledText).toHaveText('Enabled');

    const disabledText = getDisabledTextElement(fixture.nativeElement);
    expect(disabledText).toHaveText('Disabled');

    expect(getErrorElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should set `aria-describedby` correctly', () => {
    const fixture = createTestComponent();
    const { nativeElement } = fixture;

    const inputEl = getInputElement(fixture.nativeElement);
    const containerEl = nativeElement.querySelector('span.slds-checkbox_faux_container');
    expect(containerEl.id).toEqual(inputEl.getAttribute('aria-describedby'));
  });

  it('should hook label indication on input required', () => {
    const fixture = createTestComponent(`<ngl-checkbox-toggle><input ngl type="checkbox" [required]="required" /></ngl-checkbox-toggle>`);
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const abbrEl = getRequiredElement(fixture.nativeElement);
    expect(abbrEl).toHaveClass('slds-required');

    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should show error correctly', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.error = 'An error';
    fixture.detectChanges();

    const errorEl = getErrorElement(fixture.nativeElement);
    expect(errorEl).toHaveText('An error');
  });

  it('should be able to configure enabled/disabled text correctly', () => {
    const fixture = createTestComponent(`
      <ngl-checkbox-toggle [enabledText]="enabledText" [disabledText]="disabledText">
        <input ngl type="checkbox" />
      </ngl-checkbox-toggle>`);
    fixture.componentInstance.enabledText = 'On';
    fixture.componentInstance.disabledText = 'Off';
    fixture.detectChanges();

    const enabledTextEl = getEnabledTextElement(fixture.nativeElement);
    expect(enabledTextEl).toHaveText('On');

    const disabledTextEl = getDisabledTextElement(fixture.nativeElement);
    expect(disabledTextEl).toHaveText('Off');
  });

});

@Component({
  template: `
    <ngl-checkbox-toggle [label]="label" [error]="error">
      <input ngl type="checkbox" />
    </ngl-checkbox-toggle>
  `,
})
export class TestComponent {
  label = 'My label';
  required: boolean;
  error: string;
  enabledText: string;
  disabledText: string;
}
