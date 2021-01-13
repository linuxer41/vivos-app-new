import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentTypePage } from './payment-type';

@NgModule({
  declarations: [
    PaymentTypePage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentTypePage),
  ],
})
export class PaymentTypePageModule {}
