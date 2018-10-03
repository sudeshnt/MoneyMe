import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';

import { TranslateService } from "@ngx-translate/core";

import { Config } from "../../config";

@IonicPage()
@Component({
    selector: 'page-language',
    templateUrl: 'language.html',
})
export class LanguagePage {

    currentLang : String;
    languages : any;
    config = Config;

    constructor(public navCtrl: NavController, public navParams: NavParams, private translateService : TranslateService,
                public events: Events) {
        this.languages = this.config.LANGUAGES;
        this.currentLang = this.translateService.currentLang;
    }

    ionViewDidLoad() {}

    changeLanguage(languageCode){
        this.events.publish('lang:changed', languageCode);
    }

}
