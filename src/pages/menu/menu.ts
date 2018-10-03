import {Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';

import { Badge } from "@ionic-native/badge";

import { UserProvider } from "../../providers/user/user";
import { NotificationDataServiceProvider } from "../../providers/data-services/notification-data-service/notification-data-service";
import { AppConfig } from "../../config";
import { LocalDataServiceProvider } from "../../providers/local-data-service/local-data-service";
import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  appConfig = AppConfig;

  systemTelephone:string = "";
  unreadNotificationCount:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,private localDataService : LocalDataServiceProvider,
              public viewCtrl: ViewController, public userService : UserProvider, private badge :Badge,
              private publicDataService : PublicDataServiceProvider ,  private notificationDataService : NotificationDataServiceProvider) {
  }

    ionViewDidLoad() {
        this.initLocalSystemTelephone();
        if(this.userService.user.isAuthorized){
            this.initUnreadNotificationCount();
        }
    }

    initLocalSystemTelephone(){
        this.localDataService.getItem('SYSTEM_TELEPHONE').then(
            (telephone:any) => {
                if(telephone!=null){
                    this.systemTelephone = telephone;
                }else{
                    this.initSystemTelephone();
                }
            }
        );
    }

    initSystemTelephone(){
        this.publicDataService.getSystemTelephone().then((data:any)=>{
            if(data){
                this.systemTelephone = data;
                this.localDataService.setItem('SYSTEM_TELEPHONE',data);
            }
        })
    }

    initUnreadNotificationCount(){
        let req = {
            "userReferenceId" : AppConfig.clientPrefix+this.userService.user.ClientId
        };
        this.notificationDataService.getUnreadNotificationCountByUser(req).then((data:any)=>{
            if(data>0){
                this.unreadNotificationCount = data;
                this.setNotificationBadge(data);
            }
        });
    }

    async setNotificationBadge(data){
        try {
            let hasPermission = await this.badge.hasPermission();
            this.setBadges(data);
            if (!hasPermission) {
                let permission = await this.badge.requestPermission();
                this.setBadges(data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async setBadges(badgeNumber: number) {
        try {
            let badges = await this.badge.set(badgeNumber);
            // console.log(badges);
        } catch (e) {
            console.error(e);
        }
    }

    clickMenu(page) {
        this.viewCtrl.dismiss({});
        this.events.publish('menu:clicked', page);
    }

}
