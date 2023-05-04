import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, TemplateRef, OnDestroy,
         ViewChildren, QueryList, SimpleChanges, ContentChild, ViewChild, NgZone, ElementRef, ChangeDetectorRef,
         Optional, Inject, HostBinding, AfterContentInit } from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ConnectionPositionPair, CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DEFAULT_DROPDOWN_POSITIONS } from '../util/overlay-position';
import { uniqueId, isOptionSelected, addOptionToSelection } from '../util/util';
import { InputBoolean, InputNumber, toBoolean } from '../util/convert';
import { NglComboboxOption } from './combobox-option';
import { NglComboboxInput } from './combobox-input';
import { NglComboboxService } from './combobox.service';
import { NglComboboxConfig, NGL_COMBOBOX_CONFIG } from './config';

export interface NglComboboxOptionItem {
  value: number | string;
  label?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ngl-combobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './combobox.html',
  host: {
    'class.slds-form-element': 'true',
  },
  providers: [ NglComboboxService ],
})
export class NglCombobox implements OnChanges, OnDestroy, AfterContentInit {

  @Input() variant: 'base' | 'lookup' = 'base';

  @Input() label?: string | TemplateRef<any>;

  readonly uid = uniqueId('combobox');

  @Input() @InputBoolean() open = false;

  @Output() openChange = new EventEmitter<boolean>();

  @Input() selection: any;

  @Output() selectionChange = new EventEmitter();

  @Input() @InputBoolean() multiple = false;

  @Input() @InputNumber() visibleLength: 5 | 7 | 10 = 5;

  @ContentChild(NglComboboxInput, { static: true }) inputEl?: NglComboboxInput;

  @Input() @InputBoolean() loading?: boolean;

  @Input() @InputBoolean() loadingMore?: boolean;

  @Input() @InputBoolean() closeOnSelection = true;

  /**
   * Text added to loading spinner.
   */
  @Input() loadingLabel: string;

  /**
   * Text message that renders when no matches found.
   */
  @Input() noOptionsFound: string;

  /**
   * Text for removing single selected option.
   */
  @Input() removeSelectedLabel: string;

  @ViewChildren(NglComboboxOption) readonly options?: QueryList<NglComboboxOption>;

  @HostBinding('class.slds-has-error') hasErrors = false;

  @Input('options') set data(data: any[]) {
    this._data = (data || []).map((d) => {
      if (typeof d === 'string') {
        // Support array of strings as options, by mapping to NglComboboxOptionItem
        return { value: d, label: d };
      } else if (!d.label) {
        // Use `value` if missing `label`
        return { ...d, label: d.value };
      }
      return d;
    });
  }
  get data() {
    return this._data as any[];
  }

  @ViewChild('overlayOrigin', { static: true }) overlayOrigin?: CdkOverlayOrigin;

  @ViewChild('cdkOverlay') cdkOverlay?: CdkConnectedOverlay;

  @ViewChild('dropdown') dropdownElementRef?: ElementRef;

  overlayWidth = 0;

  overlayPositions: ConnectionPositionPair[] = [...DEFAULT_DROPDOWN_POSITIONS['left']];

  /** Manages active item in option list based on key events. */
  keyManager?: ActiveDescendantKeyManager<NglComboboxOption> | null;

  private optionChangesSubscription?: Subscription | null;

  private ɵRequiredSubscription?: Subscription;

  private _data?: NglComboboxOptionItem[] | null;

  private keyboardSubscription?: Subscription | null;

  required: boolean;

  @Input() selectionValueFn = (selection: string[]): string => {
    if (selection.length > 0) {
      if (this.multiple && this.isLookup) {
        return '';
      }
      return selection.length === 1 ? selection[0] : `${selection.length} options selected`;
    }
    return '';
  }

  get activeOption(): NglComboboxOption | null {
    return this.keyManager ? this.keyManager.activeItem : null;
  }

  get selectedOptions(): NglComboboxOptionItem[] {
    return this.data ? this.data.filter(d => this.isSelected(d.value)) : [];
  }

  get isLookup(): boolean {
    return this.variant === 'lookup';
  }

  get hasLookupSingleSelection() {
    return this.isLookup && !this.multiple && this.selectedOptions.length > 0;
  }

  constructor(@Optional() @Inject(NGL_COMBOBOX_CONFIG) defaultConfig: NglComboboxConfig,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              private service: NglComboboxService) {
    const config = { ...new NglComboboxConfig(), ...defaultConfig };
    this.loadingLabel = config.loadingLabel;
    this.noOptionsFound = config.noOptionsFound;
    this.removeSelectedLabel = config.removeSelectedLabel;

    this.service.combobox = this;
    // this.service.openChange = this.openChange;
  }

  ngAfterContentInit() {
    if (!this.inputEl) {
      throw Error(`[ng-lightning] Couldn't find an <input> with [nglCombobox] attribute inside NglCombobox`);
    }
    this.ɵRequiredSubscription = this.inputEl.ɵRequiredSubject.subscribe((required) => {
      this.required = required;
      this.cd.detectChanges();
    });
    this.calculateErrors();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selection || (this.selection && changes.data)) {
      this.calculateDisplayValue();
    }
    setTimeout(() => this.calculateErrors(), 0);
  }

  onAttach() {
    // Same width as the trigger element
    this.overlayWidth = this.overlayOrigin?.elementRef.nativeElement.offsetWidth;
    this.cd.detectChanges();

    this.keyManager = this.options && new ActiveDescendantKeyManager(this.options).withWrap();

    // Activate selected item or first option
    const selectedOption = this.options?.find(o => o.selected);
    if (selectedOption) {
      this.keyManager?.setActiveItem(selectedOption);
    } else {
        this.keyManager?.setFirstItemActive();
    }

    // Listen to button presses if picklist to activate matching option
    this.keyboardSubscribe(this.variant === 'base');

    // When it is open we listen for option changes in order to fix active option and handle scroll
    this.optionChangesSubscription = this.options?.changes.subscribe(() => {

      const options = this.options?.toArray() || [];

      if (!this.activeOption || options.indexOf(this.activeOption) === -1) {
        if (this.isLookup && options.length === 0) {
          this.keyManager?.setActiveItem(null);
        } else {
          this.keyManager?.setFirstItemActive();
        }
      } else {
        this.activeOption.scrollIntoView();
      }

      this.updateMenuHeight();
    });

    this.updateMenuHeight();
  }

  onDetach() {
    if (this.open) {
      this.close();
      return;
    }

    // Clear aria-activedescendant when menu is closed
    this.inputEl?.setAriaActiveDescendant(null);

    this.detach();
  }

  trackByOption(_index: number, option: NglComboboxOption) {
    return option.value;
  }

  dropdownClass() {
    return {
      [`slds-dropdown_length-${this.visibleLength}`]: this.visibleLength > 0,
    };
  }

  inputIconRight() {
    return this.isLookup ? 'utility:search' : 'utility:down';
  }

  hasNoMatches() {
    return this.isLookup && this.data.length === 0 && !this.loadingMore;
  }

  onOptionSelection(option: NglComboboxOption | null = this.activeOption) {
    if (option) {
      const selection = addOptionToSelection(option.value, this.selection, this.multiple);
      this.selectionChange.emit(selection);
      if (this.closeOnSelection) {
        this.close();
      }
    }
  }

  // Trigger by clear button on Lookup
  onClearSelection() {
    this.selectionChange.emit(null);
    setTimeout(() => this.inputEl?.focus(), 0);
  }

  /**
   * Check whether value is currently selected.
   *
   * @param value The value in test, whether is (part of) selection or not
   */
  isSelected(value: any): boolean {
    return isOptionSelected(value, this.selection, this.multiple);
  }

  ngOnDestroy() {
    this.detach();
    this.ɵRequiredSubscription?.unsubscribe();
  }

  close() {
    this.openChange.emit(false);
  }

  private detach() {
    this.keyboardSubscribe(false);
    this.keyManager = null;
    if (this.optionChangesSubscription) {
      this.optionChangesSubscription.unsubscribe();
      this.optionChangesSubscription = null;
    }
  }

  private calculateDisplayValue() {
    const value = this.selectionValueFn(this.selectedOptions.map(option => option.label || ''));
    this.inputEl?.setValue(value);
  }

  private keyboardSubscribe(listen: boolean) {
    if (this.keyboardSubscription) {
      this.keyboardSubscription.unsubscribe();
      this.keyboardSubscription = null;
    }

    if (listen && this.inputEl) {
      this.keyboardSubscription = this.inputEl.keyboardBuffer$.subscribe((pattern) => {
        if (this.options && this.keyManager) {

          pattern = pattern.toLocaleLowerCase();

          const options = this.options.toArray();

          const activeIndex = this.activeOption ? (this.keyManager.activeItemIndex || 0) + 1 : 0;
          for (let i = 0, n = options.length; i < n; i++) {
            const index = (activeIndex + i) % n;
            const option = options[index];
            if (!option.disabled && option.label.toLocaleLowerCase().substr(0, pattern.length) === pattern) {
              this.keyManager.setActiveItem(option);
              break;
            }
          }
        }
      });
    }
  }

  private updateMenuHeight() {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      if (this.cdkOverlay && this.dropdownElementRef) {
        const { overlayRef } = this.cdkOverlay;
        const height = this.dropdownElementRef.nativeElement.offsetHeight;
        overlayRef.updateSize({
          minHeight: height + 4,
        });
        overlayRef.updatePosition();
      }
    });
  }

  private calculateErrors() {
    if (this.required) {
      this.hasErrors = !toBoolean(this.selection);
    }
    this.cd.detectChanges();
  }
}
