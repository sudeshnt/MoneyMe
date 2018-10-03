import { Component } from '@angular/core';
import { Events, IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import { Config } from "../../config";

@IonicPage()
@Component({
  selector: 'page-first-loan-1',
  templateUrl: 'first-loan-1.html',
})
export class FirstLoan_1Page {

    languages : any;
    keys: String[];
    currentLang : String;

    config = Config;

    constructor(public navCtrl: NavController, private translateService : TranslateService, public events: Events) {
        this.languages = this.config.LANGUAGES;
        this.currentLang = this.translateService.currentLang;
        this.events.subscribe('lang:changed', (lang) => {
            if(lang){
                this.currentLang = lang;
            }
        });
    }

    ionViewDidLoad(){}

    changeLanguage(languageCode){
        this.events.publish('lang:changed', languageCode);
    }

    proceed(){
        this.navCtrl.push('FirstLoan_2Page');
    }

    login(){
        this.navCtrl.push('LoginPage');
    }

}
