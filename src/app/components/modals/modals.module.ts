import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NglModalsModule, NglButtonsModule, NglCheckboxesModule, NglPickModule, NglButtonIconsModule, NglTooltipsModule } from 'ng-lightning';
import { NglDemoExampleModule } from 'src/app/example/example.module';

import { DemoModalsComponent } from './modals.component';

// Examples
import { DemoModalsBasic } from './examples/basic';
import { DemoModalsSize } from './examples/size';
import { DemoModalsHeader } from './examples/header';

const routes: Routes = [
  { path: '', component: DemoModalsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NglModalsModule,
    NglButtonsModule,
    NglCheckboxesModule,
    NglPickModule,
    NglButtonIconsModule,
    NglTooltipsModule,
    NglDemoExampleModule,
  ],
  declarations: [
    DemoModalsComponent,
    DemoModalsBasic,
    DemoModalsSize,
    DemoModalsHeader,
  ],
})
export class NglDemoModalsModule {}
