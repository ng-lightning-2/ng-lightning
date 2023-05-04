import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { routes as demoRoutes } from './routes';

import { ComponentsComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    children: demoRoutes,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', redirectTo: demoRoutes[0].path, pathMatch: 'full' },
      ...routes,
    ]),
  ],
  declarations: [
    ComponentsComponent,
  ],
})
export class NglDemoComponentsModule {}
