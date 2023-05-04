import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SupportComponent } from './support';

const routes: Routes = [
  { path: '', component: SupportComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    SupportComponent,
  ],
})
export class NglDemoSupportModule {}
