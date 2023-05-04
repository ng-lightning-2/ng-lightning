import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../test/util';
import { NglIconsModule } from './module';
import { NGL_ICON_CONFIG, NglIconConfig } from './config';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

describe('SVG icon Component', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [TestComponent],
    imports: [NglIconsModule],
  }));

  it('should render correctly', () => {
    const fixture = createTestComponent(`<svg nglIconName="warning"></svg>`);
    const svg = fixture.nativeElement.firstElementChild;
    const use = svg.querySelector('use');

    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(use.getAttribute('xlink:href')).toBe('/mypath/utility-sprite/svg/symbols.svg#warning');
  });

  it('should change `use` path based on input', () => {
    const fixture = createTestComponent(`<svg [nglIconName]="iconName"></svg>`, false);
    fixture.componentInstance.iconName = 'custom:icon1';
    fixture.detectChanges();

    const use = fixture.nativeElement.firstElementChild.querySelector('use');
    expect(use.getAttribute('xlink:href')).toBe('/mypath/custom-sprite/svg/symbols.svg#icon1');

    fixture.componentInstance.iconName = 'standard:icon2';
    fixture.detectChanges();
    expect(use.getAttribute('xlink:href')).toBe('/mypath/standard-sprite/svg/symbols.svg#icon2');
  });

});

@Component({
  template: '',
  providers: [
    { provide: NGL_ICON_CONFIG, useValue: <NglIconConfig>{ svgPath: '/mypath' } },
  ],
})
export class TestComponent {
  iconName: string;
}
