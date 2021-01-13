import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { CommonProvider } from '../../providers/common/common';
@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
  ],
  providers: [
    CommonProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WelcomePageModule {}
