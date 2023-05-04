import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, selectElements } from '../../../test/util';
import { NglDatatablesModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getHeadings(element: HTMLElement) {
  return selectElements(element, 'thead th');
}

function getHeadingText(element: HTMLElement) {
  return element.querySelector('.slds-truncate').textContent;
}

function getHeadingsText(element: HTMLElement) {
  return getHeadings(element).map(getHeadingText);
}

function getHeadingsTitle(element: HTMLElement) {
  return getHeadings(element).map(el => el.querySelector('.slds-truncate').getAttribute('title'));
}

function getRows(element: HTMLElement): HTMLTableRowElement[] {
  return <HTMLTableRowElement[]>selectElements(element, 'tbody tr');
}

function getRowData(element: HTMLTableRowElement) {
  return selectElements(element, 'td').map(e => e.textContent.trim());
}

function getData(element: HTMLElement) {
  return getRows(element).map(row => getRowData(row));
}

function getLoadingEl(element: HTMLElement) {
  return element.querySelector('table > .ngl-datatable-loading');
}

function expectSortedHeadings(element: HTMLElement, expected: string[]) {
  const headings = getHeadings(element);

  headings.map((e: HTMLElement, index: number) => {
    const text = getHeadingText(e);
    const expectation = expected[index];
    if (expectation.startsWith('+')) {
      expect(e).toHaveClass('slds-is-sorted');
      expect(e).toHaveClass('slds-is-sorted_asc');
      expect(e.getAttribute('aria-sort')).toEqual('ascending');
      expect(expectation).toEqual(`+${text}`);
    } else if (expectation.startsWith('-')) {
      expect(e).toHaveClass('slds-is-sorted');
      expect(e).toHaveClass('slds-is-sorted_desc');
      expect(e.getAttribute('aria-sort')).toEqual('descending');
      expect(expectation).toEqual(`-${text}`);
    } else {
      expect(e).not.toHaveClass('slds-is-sorted');
      expect(e.getAttribute('aria-sort')).toEqual('none');
      expect(expectation).toEqual(text);
    }
  });
}

describe('`NglDatatable`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglDatatablesModule]}));

  it('should render head and body correctly', () => {
    const fixture = createTestComponent();

    const tableEl = fixture.nativeElement.firstElementChild;
    expect(tableEl).toHaveClass('slds-table');

    expect(getHeadingsText(fixture.nativeElement)).toEqual(['ID', 'Name', 'Number']);
    expect(getHeadingsTitle(fixture.nativeElement)).toEqual(['ID', 'Name', 'Number']);
    expect(getData(fixture.nativeElement)).toEqual([
      [ '1', 'PP', '80' ],
      [ '2', 'AB', '10' ],
      [ '3', 'KB', '13' ],
      [ '4', 'EB', '14' ],
    ]);
  });

  it('should show/hide column correctly', () => {
    const fixture = createTestComponent(null, false);
    fixture.componentInstance.exists = false;
    fixture.detectChanges();

    expect(getHeadingsText(fixture.nativeElement)).toEqual(['ID', 'Number']);
    expect(getData(fixture.nativeElement)).toEqual([
      [ '1', '80' ],
      [ '2', '10' ],
      [ '3', '13' ],
      [ '4', '14' ],
    ]);

    fixture.componentInstance.exists = true;
    fixture.detectChanges();
    expect(getHeadingsText(fixture.nativeElement)).toEqual(['ID', 'Name', 'Number']);
    expect(getData(fixture.nativeElement)).toEqual([
      [ '1', 'PP', '80' ],
      [ '2', 'AB', '10' ],
      [ '3', 'KB', '13' ],
      [ '4', 'EB', '14' ],
    ]);
  });

  it('should support custom cell template per column', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column heading key="id">
          <ng-template nglDatatableCell let-value>{{value}}:</ng-template>
        </ngl-datatable-column>
        <ngl-datatable-column heading>
          <ng-template nglDatatableCell let-row="row" let-i="index">{{i}} = {{row.name}}</ng-template>
        </ngl-datatable-column>
        <ngl-datatable-column heading key="number"></ngl-datatable-column>
      </table>`);
    expect(getData(fixture.nativeElement)).toEqual([
      [ '1:', '0 = PP', '80' ],
      [ '2:', '1 = AB', '10' ],
      [ '3:', '2 = KB', '13' ],
      [ '4:', '3 = EB', '14' ],
    ]);
  });

  it('should support custom header class per column', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column heading headClass="class1"></ngl-datatable-column>
        <ngl-datatable-column heading [headClass]="{ class2: exists }"></ngl-datatable-column>
      </table>`);

    const rows = getHeadings(fixture.nativeElement);
    expect(rows[0]).toHaveClass('class1');
    expect(rows[1]).toHaveClass('class2');

    fixture.componentInstance.exists = false;
    fixture.detectChanges();
    expect(rows[1]).not.toHaveClass('class2');
  });

  it('should support custom cell class per column', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column heading [cellClass]="class1"></ngl-datatable-column>
        <ngl-datatable-column heading [cellClass]="class2"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.class1 = 'custom-class1';
    fixture.detectChanges();

    const rows = getRows(fixture.nativeElement).map(row => selectElements(row, 'td'));
    rows.forEach(([first, second]) => {
      expect(first).toHaveClass('custom-class1');
      expect(second).not.toHaveClass('custom-class1');
    });

    fixture.componentInstance.class1 = null;
    fixture.componentInstance.class2 = ['apply-me', 'apply-this'];
    fixture.detectChanges();
    rows.forEach(([first, second]) => {
      expect(first).not.toHaveClass('custom-class1');
      expect(second).toHaveClass('apply-me');
      expect(second).toHaveClass('apply-this');
    });
  });

  it('should support truncate input', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column heading key="name" truncate="true"></ngl-datatable-column>
      </table>`);
    fixture.detectChanges();

    const rows = getRows(fixture.nativeElement).map(row => selectElements(row, 'td'));
    rows.forEach(([td], index) => {
      const el = td.firstElementChild;
      expect(el).toHaveClass('slds-truncate');
      expect(el.getAttribute('title')).toBe(fixture.componentInstance.data[index].name);
    });
  });

  it('should handle sortable columns', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column heading key="id" sortable></ngl-datatable-column>
        <ngl-datatable-column heading [sortable]="sortable"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.sortable = false;
    fixture.detectChanges();

    const [first, second] = getHeadings(fixture.nativeElement);

    expect(first).toHaveClass('slds-is-sortable');
    expect(first.querySelector('a')).toBeDefined();

    expect(second).not.toHaveClass('slds-is-sortable');
    expect(second.querySelector('a')).toBeNull();

    fixture.componentInstance.sortable = true;
    fixture.detectChanges();
    expect(second).toHaveClass('slds-is-sortable');
    expect(second.querySelector('a')).toBeDefined();
  });

  it('should display sorting state', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data" [sort]="sort">
        <ngl-datatable-column heading="ID" key="id" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Name" key="name" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Number" key="number"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.sort = {key: 'id', order: 'asc'};
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['+ID', 'Name', 'Number']);

    fixture.componentInstance.sort = null;
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['ID', 'Name', 'Number']);

    fixture.componentInstance.sort = {key: 'id', order: 'desc'};
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['-ID', 'Name', 'Number']);

    fixture.componentInstance.sort = {key: 'name', order: 'asc'};
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['ID', '+Name', 'Number']);
  });

  it('should sort when clicking on sortable header', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data" [sort]="sort" (sortChange)="sortChange($event)">
        <ngl-datatable-column heading="ID" key="id" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Name" key="name" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Number" key="number"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.sort = {key: 'id', order: 'desc'};
    fixture.detectChanges();
    expect(fixture.componentInstance.sortChange).not.toHaveBeenCalled();

    const headingLinks = getHeadings(fixture.nativeElement).map(e => <HTMLAnchorElement>e.querySelector('a'));

    headingLinks[0].click();
    expect(fixture.componentInstance.sortChange).toHaveBeenCalledWith({ key: 'id', order: 'asc' });

    headingLinks[1].click();
    expect(fixture.componentInstance.sortChange).toHaveBeenCalledWith({ key: 'name', order: 'desc' });
  });

  it('should not re-render templates in cell if no input has changed', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column heading>
          <ng-template nglDatatableCell><button type="button" (click)="cb()"></button></ng-template>
        </ngl-datatable-column>
      </table>`);
    expect(fixture.componentInstance.cb).not.toHaveBeenCalled();

    const button1 = fixture.nativeElement.querySelector('button');
    button1.click();
    fixture.detectChanges();

    const button2 = fixture.nativeElement.querySelector('button');
    expect(button1).toBe(button2);
    expect(fixture.componentInstance.cb).toHaveBeenCalled();
  });

  it('should be able to render a loading overlay', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data" [loading]="loading">
        <ng-template nglLoadingOverlay>Loading...</ng-template>
      </table>`);

    expect(getLoadingEl(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const el = getLoadingEl(fixture.nativeElement);
    expect(el.textContent.trim()).toBe('Loading...');
  });

  it('should show a custom message when no data available', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable>
        <ng-template nglNoRowsOverlay>No data available in table!</ng-template>
      </table>`);
    expect(getData(fixture.nativeElement)).toEqual([[ 'No data available in table!' ]]);
  });

  it('should hande row click', () => {
    const fixture = createTestComponent(`
        <table ngl-datatable [data]="data" (rowClick)="rowClick($event)">
          <ngl-datatable-column heading key="id"></ngl-datatable-column>
        </table>`);

    const {componentInstance} = fixture;
    const rows = getRows(fixture.nativeElement);
    expect(componentInstance.rowClick).not.toHaveBeenCalled();

    rows[2].click();
    expect(componentInstance.rowClick).toHaveBeenCalledWith({ event: jasmine.anything(), data: componentInstance.data[2]});

    rows[1].click();
    expect(componentInstance.rowClick).toHaveBeenCalledWith({ event: jasmine.anything(), data: componentInstance.data[1]});
  });

  it('should display custom header template', () => {
    const fixture = createTestComponent(`
        <table ngl-datatable>
          <ngl-datatable-column heading="My title">
            <ng-template nglDatatableHeading>Custom heading</ng-template>
          </ngl-datatable-column>
        </table>`);
    expect(getHeadingsText(fixture.nativeElement)).toEqual(['Custom heading']);
    expect(getHeadingsTitle(fixture.nativeElement)).toEqual(['My title']);
  });

  it('should not display empty title', () => {
    const fixture = createTestComponent(`
        <table ngl-datatable>
          <ngl-datatable-column heading>
            <ng-template nglDatatableHeading>Custom heading</ng-template>
          </ngl-datatable-column>
        </table>`);
    expect(getHeadingsText(fixture.nativeElement)).toEqual(['Custom heading']);
    expect(getHeadingsTitle(fixture.nativeElement)).toEqual([null]);
  });

  it('should track rows based on input', () => {
    const fixture = createTestComponent(`<table ngl-datatable [data]="data" trackByKey="id"></table>`);
    const rows = getRows(fixture.nativeElement);

    fixture.componentInstance.data = [ ...fixture.componentInstance.data.reverse() ];
    fixture.detectChanges();

    const newRows = getRows(fixture.nativeElement);
    for (let i = 0, ii = fixture.componentInstance.data.length; i < ii; i++) {
      expect(rows[i]).toBe(newRows[ii - i - 1]);
    }
  });
});

@Component({
  template: `
    <table ngl-datatable [data]="data">
      <ngl-datatable-column heading="ID" key="id"></ngl-datatable-column>
      <ngl-datatable-column heading="Name" key="name" *ngIf="exists"></ngl-datatable-column>
      <ngl-datatable-column heading="Number" key="number"></ngl-datatable-column>
    </table>`,
})
export class TestComponent {
  exists = true;
  sortable: boolean;
  loading: boolean;

  data = [
    { id: 1, name: 'PP', number: 80 },
    { id: 2, name: 'AB', number: 10 },
    { id: 3, name: 'KB', number: 13 },
    { id: 4, name: 'EB', number: 14 },
  ];

  sort: any;

  class1: any;
  class2: any;

  sortChange = jasmine.createSpy('sortChange');
  rowClick = jasmine.createSpy('rowClick');
  cb = jasmine.createSpy('cb').and.callThrough();
}
