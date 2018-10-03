import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";

@IonicPage()
@Component({
    selector: 'page-faq',
    templateUrl: 'faq.html',
})
export class FaqPage {

    FAQ:String = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, private publicDataService: PublicDataServiceProvider) {
    }

    ionViewDidLoad() {
        this.initFAQ();
    }

    initFAQ(){
        this.publicDataService.getSystemFAQ().then((data)=>{
            if(data){
                this.FAQ = data.toString();
            }
        })
    }

}
