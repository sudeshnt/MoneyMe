import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstLoan_2Page } from './first-loan-2';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    FirstLoan_2Page
  ],
  imports: [
    IonicPageModule.forChild(FirstLoan_2Page),
    TranslateModule.forChild()
  ],
  exports: [
      FirstLoan_2Page
  ]
})
export class FirstLoan_2PageModule {}
