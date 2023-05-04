import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglInternalOutletModule } from '../util/outlet.module';
import { NglIconsModule } from '../icons/module';
import { NglTooltipsModule } from '../tooltips/module';

import { NglFormLabel } from './label';
import { NglFormHelp } from './help';

const DIRECTIVES = [
  NglFormLabel,
  NglFormHelp,
];

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
  imports: [CommonModule, NglInternalOutletModule, NglIconsModule, NglTooltipsModule],
})
export class NglFormsModule {}
