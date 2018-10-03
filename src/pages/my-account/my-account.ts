import { Component } from '@angular/core';
import { AlertController } from "ionic-angular";

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileDataServiceProvider } from "../../providers/data-services/profile-data-service/profile-data-service";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";

@IonicPage()
@Component({
    selector: 'page-my-account',
    templateUrl: 'my-account.html',
})
export class MyAccountPage {

    profile:any = {};

    constructor(public navCtrl: NavController, public navParams: NavParams , private profileDataService : ProfileDataServiceProvider,
                public alertCtrl: AlertController, private publicFunctions : PublicFunctionsProvider ) {
    }

    ionViewDidLoad() {
        this.initProfile();
    }

    showAlert() {
        this.publicFunctions.getTranslation("EDIT_MY_PROFILE_MESSAGE").then((message : any) => {
            let alert = this.alertCtrl.create({
                title: 'Edit!',
                message: message,
                cssClass:'notification-alert',
                buttons: ['Ok']
            });
            alert.present();
        });
    }

    initProfile(){
        this.profileDataService.getProfile().then((data)=>{
            if(data){
                this.profile = data;
            }
        })
    }

}
