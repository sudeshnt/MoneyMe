import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstLoan_1Page } from './first-loan-1';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    FirstLoan_1Page,
  ],
  imports: [
    IonicPageModule.forChild(FirstLoan_1Page),
    TranslateModule.forChild()
  ],
})
export class FirstLoan_1PageModule {}
