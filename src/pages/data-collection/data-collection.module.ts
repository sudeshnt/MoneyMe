import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataCollectionPage } from './data-collection';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    DataCollectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataCollectionPage),
    TranslateModule.forChild()
  ],
})
export class DataCollectionPageModule {}
