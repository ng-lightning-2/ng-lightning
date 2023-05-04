import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglFormsModule } from '../forms/module';

import { NglTextarea } from './textarea/textarea';
import { NglTextareaInput } from './input/input';

const DIRECTIVES = [
  NglTextarea,
  NglTextareaInput,
];

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
  imports: [CommonModule, NglFormsModule],
})
export class NglTextareaModule {}
