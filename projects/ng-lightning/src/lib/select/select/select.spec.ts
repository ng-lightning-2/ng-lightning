import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../../test/util';
import { NglSelectModule } from '../module';
import { getLabelElement, getRequiredElement, getErrorElement } from '../input/input.spec';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getInputElement(element: Element): HTMLSelectElement {
  return <HTMLSelectElement>element.querySelector('select');
}

describe('`NglSelect`', () => {

  beforeEach(() => TestBed.configureTestingModule({ declarations: [TestComponent], imports: [NglSelectModule] }));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;
    expect(element).toHaveClass('slds-form-element');

    const labelEl = getLabelElement(element);
    expect(labelEl).toHaveText('My label');

    const inputEl = getInputElement(element);
    expect(inputEl).toHaveClass('slds-select');

    const inputId = inputEl.getAttribute('id');
    expect(inputId).toEqual(labelEl.getAttribute('for'));
  });

  it('should hook label indication on input required', () => {
    const fixture = createTestComponent(`<ngl-select label><select ngl [required]="required"></select></ngl-select>`);
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const abbrEl = getRequiredElement(fixture.nativeElement);
    expect(abbrEl).toHaveClass('slds-required');

    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should render error message', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.error = 'An error';
    fixture.detectChanges();

    const errorEl = getErrorElement(fixture.nativeElement);
    const inputEl = getInputElement(fixture.nativeElement);
    expect(errorEl).toHaveText('An error');
    expect(errorEl.id).toEqual(inputEl.getAttribute('aria-describedby'));
  });

  it('should render error message as template', () => {
    const fixture = createTestComponent(`<ng-template #err>This is an error!</ng-template><ngl-select label [error]="err"><select ngl></select></ngl-select>`);
    const element = fixture.nativeElement.firstElementChild;

    const errorEl = getErrorElement(fixture.nativeElement);
    expect(element).toHaveClass('slds-has-error');
    expect(errorEl).toHaveText('This is an error!');
  });

  it('should handle error as `false` string', () => {
    const fixture = createTestComponent(`<ngl-select label error="false"><select ngl></select></ngl-select>`);
    const element = fixture.nativeElement.firstElementChild;

    const errorEl = getErrorElement(fixture.nativeElement);
    expect(element).not.toHaveClass('slds-has-error');
    expect(errorEl).toBeFalsy();
  });

  it('should throw error if structure is wrong', () => {
    expect(() => createTestComponent(`<ngl-select label><select></select></ngl-select>`)).toThrowError();
  });

});


@Component({
  template: `
    <ngl-select [label]="label" [error]="error">
      <select ngl></select>
    </ngl-select>
  `,
})
export class TestComponent {
  label = 'My label';
  required: boolean;
  error: string;
}
