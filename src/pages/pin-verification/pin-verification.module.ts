import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinVerificationPage } from './pin-verification';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    PinVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(PinVerificationPage),
    TranslateModule.forChild()
  ],
})
export class PinVerificationPageModule {}
