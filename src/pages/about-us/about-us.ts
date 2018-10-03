import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PublicDataServiceProvider} from "../../providers/data-services/public-data-service/public-data-service";

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  aboutUs:String = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private publicDataService : PublicDataServiceProvider) {
  }

  ionViewDidLoad() {
    this.initAboutUs();
  }

  initAboutUs(){
    this.publicDataService.getSystemAboutUs().then((data)=>{
      if(data){
        this.aboutUs = data.toString();
      }
    })
  }

}
