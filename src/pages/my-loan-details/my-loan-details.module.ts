import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLoanDetailsPage } from './my-loan-details';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    MyLoanDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyLoanDetailsPage),
    TranslateModule.forChild()
  ],
})
export class MyLoanDetailsPageModule {}
