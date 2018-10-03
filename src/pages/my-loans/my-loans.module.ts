import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLoansPage } from './my-loans';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    MyLoansPage,
  ],
  imports: [
    IonicPageModule.forChild(MyLoansPage),
    TranslateModule.forChild()
  ],
})
export class MyLoansPageModule {}
