import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglTabsModule } from 'ng-lightning';

import { ExampleDocsComponent } from './exampe-docs.component';


@NgModule({
  imports: [
    CommonModule,
    NglTabsModule,
  ],
  declarations: [
    ExampleDocsComponent,
  ],
  exports: [
    ExampleDocsComponent,
  ]
})
export class NglDemoExampleModule {}
