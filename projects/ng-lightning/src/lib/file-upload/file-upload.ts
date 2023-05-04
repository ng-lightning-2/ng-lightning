import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2, TemplateRef, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { trapEvent, uniqueId } from '../util/util';
import { InputBoolean, InputNumber } from '../util/convert';
import { isFileTypeAccepted } from './file-upload.util';

@Component({
  selector: 'ngl-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './file-upload.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NglFileUpload,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: NglFileUpload,
      multi: true
    }
  ],
})
export class NglFileUpload implements ControlValueAccessor, Validator, OnChanges {

  /**
   * Label that appears above the upload area.
   */
  @Input() label: string | TemplateRef<any>;

  /**
   * File types that can be accepted. See [input accept Attribute](https://www.w3schools.com/tags/att_input_accept.asp).
   */
  @Input() accept: string | string[] = null;

  /**
   * Whether file selection is disabled.
   */
  @Input() @InputBoolean() disabled: boolean = false;

  /**
    * How many files can be selected simultaneously. `0` means unlimited.
    */
  @Input() @InputNumber() maxFiles = 1;

  /**
   * File size limit in bytes. `0` means unlimited.
   */
  @Input() @InputNumber() maxFilesize = 0;

  /**
   * Message to display when there is in an error state.
   */
  @HostBinding('class.slds-has-error')
  @Input() error: string | TemplateRef<any> = null;

  /**
   * Text for button to open file selector.
   */
  @Input() uploadButtonLabel = 'Upload Files';

  /**
   * Text to display inside drop zone.
   */
  @Input() dropZoneLabel = 'or Drop Files';

  uid = uniqueId('file-upload');

  isDragOver = false;

  files: File[] = [];

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.element.nativeElement, 'slds-form-element');
  }

  onChange: Function | null = null;

  onTouched = () => {};

  validatorChange = () => {};

  writeValue(value: File[]) {
    this.files = value;
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  registerOnValidatorChange(fn: () => void): void { this.validatorChange = fn; }

  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  validate(c: AbstractControl): ValidationErrors | null {
    const files = c.value as File[];

    if (!files || files.length === 0) {
      return null;
    }

    if (this.maxFiles > 0 && files.length > this.maxFiles) {
      return { nglFileUpload: { maxFiles: files.length } };
    }

    for (let i = 0, n = files.length; i < n; i++) {
      const file = files[i];
      if (this.accept && !isFileTypeAccepted(this.accept, file)) {
        return { nglFileUpload: { invalidType: file } };
      }
      if (this.maxFilesize && file.size > this.maxFilesize) {
        return { nglFileUpload: { maxFilesize: file } };
      }
    }

    return null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['maxFiles'] || changes['maxFilesize'] || changes['accept']) {
      this.validatorChange();
    }
  }

  onDropZone(evt: DragEvent) {
    trapEvent(evt);
    if (this.disabled) {
      return;
    }

    this.isDragOver = evt.type === 'dragover';

    if (evt.type === 'drop' && evt.dataTransfer) {
      this.select(evt.dataTransfer.files);
    }
  }

  onInputChange(files: FileList) {
    this.select(files);
  }

  private select(files: FileList) {
    this.onChange(Array.from(files));
  }
}
