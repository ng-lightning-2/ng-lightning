import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglDynamicIcon } from './dynamic-icon';

import { NglDynamicIconEllie } from './ellie/ellie';
import { NglDynamicIconEq } from './eq/eq';
import { NglDynamicIconScore } from './score/score';
import { NglDynamicIconWaffle } from './waffle/waffle';

const NGL_DYNAMIC_ICON_DIRECTIVES = [
  NglDynamicIcon,
  NglDynamicIconEllie,
  NglDynamicIconEq,
  NglDynamicIconScore,
  NglDynamicIconWaffle,
];

@NgModule({
  declarations: NGL_DYNAMIC_ICON_DIRECTIVES,
  exports: NGL_DYNAMIC_ICON_DIRECTIVES,
  imports: [ CommonModule ],
})
export class NglDynamicIconsModule {}
