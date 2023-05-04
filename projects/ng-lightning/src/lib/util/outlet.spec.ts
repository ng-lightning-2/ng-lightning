import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../test/util';
import { NglInternalOutletModule } from './outlet.module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getElement(fixture: ComponentFixture<TestComponent>) {
  return fixture.nativeElement.firstElementChild;
}

describe('`NglInternalOutlet`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglInternalOutletModule]}));

  it('should render string', () => {
    const fixture = createTestComponent(null, false);
    fixture.componentInstance.isTemplate = false;
    fixture.detectChanges();
    expect(getElement(fixture)).toHaveText('String content');
  });

  it('should render template', () => {
    const fixture = createTestComponent();
    expect(getElement(fixture)).toHaveText('Template content. Count is 10');
  });

  it('could switch between string and template', () => {
    const fixture = createTestComponent();
    expect(getElement(fixture)).not.toHaveText('String content');

    fixture.componentInstance.isTemplate = false;
    fixture.detectChanges();
    expect(getElement(fixture)).toHaveText('String content');
  });

  it('should be able to update variables in template', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.count = 15;
    fixture.detectChanges();
    expect(getElement(fixture)).toHaveText('Template content. Count is 15');

    fixture.componentInstance.count = 20;
    fixture.detectChanges();
    expect(getElement(fixture)).toHaveText('Template content. Count is 20');
  });
});


@Component({
  template: `
    <ng-template #tpl>Template content. Count is {{ count }}</ng-template>
    <span [nglInternalOutlet]="isTemplate ? tpl : str"></span>
  `,
})
export class TestComponent {
  isTemplate = true;
  str = 'String content';
  count = 10;
}
