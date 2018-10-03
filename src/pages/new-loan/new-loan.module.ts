import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewLoanPage } from './new-loan';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    NewLoanPage,
  ],
  imports: [
    IonicPageModule.forChild(NewLoanPage),
    TranslateModule.forChild()
  ],
})
export class NewLoanPageModule {}
