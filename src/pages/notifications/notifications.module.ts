import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(NotificationsPage),
    TranslateModule.forChild()
  ],
})
export class NotificationsPageModule {}
