import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingMeetupPage } from './setting-meetup';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    SettingMeetupPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingMeetupPage),
    TranslateModule.forChild()
  ],
})
export class SettingMeetupPageModule {}
