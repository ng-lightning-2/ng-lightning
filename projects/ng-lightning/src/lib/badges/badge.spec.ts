import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../test/util';
import { NglBadgesModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getBadgeElement(element: Element): HTMLSpanElement {
  return <HTMLSpanElement>element.querySelector('span');
}

describe('Badge Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglBadgesModule]}));

  it('should render the badge element with default class', () => {
    const fixture = createTestComponent(`<ngl-badge></ngl-badge>`);
    const badge = getBadgeElement(fixture.nativeElement);
    expect(badge).toBeDefined();
    expect(badge.classList.toString()).toEqual('slds-badge');
  });

  it('should have the appropriate classes for the selected type', () => {
    const fixture = createTestComponent(`<ngl-badge [theme]="theme"></ngl-badge>`);
    const { componentInstance, nativeElement } = fixture;

    const badge = getBadgeElement(nativeElement);
    expect(badge.classList.toString()).toEqual('slds-badge slds-theme_default');

    componentInstance.theme = 'shade';
    fixture.detectChanges();
    expect(badge.classList.toString()).toEqual('slds-badge slds-theme_shade');

    componentInstance.theme = null;
    fixture.detectChanges();
    expect(badge.classList.toString()).toEqual('slds-badge');
  });

});

@Component({ template: '' })
export class TestComponent {
  theme = 'default';
}
