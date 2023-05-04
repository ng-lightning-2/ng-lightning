import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NglDatepickersModule, NglButtonsModule, NglCheckboxesModule } from 'ng-lightning';
import { NglDemoExampleModule } from 'src/app/example/example.module';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';

import { DemoDatepickersComponent } from './datepickers.component';

// Examples
import { DemoDatepickersBasic } from './examples/basic';
import { DemoDatepickersConfig } from './examples/config';
import { DemoDatepickersDisabled } from './examples/disabled';
import { DemoDatepickersI18n } from './examples/i18n';
import { DemoDatepickersInput } from './examples/input';
import { DemoDatepickersFilter } from './examples/filter';
import { DemoDatepickersFormat } from './examples/format';
import { DemoDatepickersValidation } from './examples/validation';
import { DemoDatepickersMasking } from './examples/masking';

const routes: Routes = [
  { path: '', component: DemoDatepickersComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    NglDatepickersModule,
    NglButtonsModule,
    NglCheckboxesModule,
    NglDemoExampleModule,
    NgxCleaveDirectiveModule,
  ],
  declarations: [
    DemoDatepickersComponent,
    DemoDatepickersBasic,
    DemoDatepickersConfig,
    DemoDatepickersDisabled,
    DemoDatepickersFilter,
    DemoDatepickersFormat,
    DemoDatepickersI18n,
    DemoDatepickersInput,
    DemoDatepickersValidation,
    DemoDatepickersMasking,
  ],
})
export class NglDemoDatepickersModule {}
