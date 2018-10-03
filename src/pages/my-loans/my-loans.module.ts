import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLoansPage } from './my-loans';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    MyLoansPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MyLoansPage),
    TranslateModule.forChild()
  ],
})
export class MyLoansPageModule {}
