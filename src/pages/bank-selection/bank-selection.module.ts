import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankSelectionPage } from './bank-selection';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BankSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(BankSelectionPage),
    TranslateModule.forChild()
  ],
})
export class BankSelectionPageModule {}
