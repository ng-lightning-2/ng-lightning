import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglFormsModule } from '../forms/module';
import { NglInternalOutletModule } from '../util/outlet.module';

import { NglSelect } from './select/select';
import { NglSelectInput } from './input/input';

const DIRECTIVES = [
  NglSelect,
  NglSelectInput,
];

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
  imports: [CommonModule, NglFormsModule, NglInternalOutletModule],
})
export class NglSelectModule {}
