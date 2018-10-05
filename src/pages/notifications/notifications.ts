import { Component } from '@angular/core';
import { InfiniteScroll, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Badge } from '@ionic-native/badge';

import { AppConfig, Config } from "../../config";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";
import { NotificationDataServiceProvider } from "../../providers/data-services/notification-data-service/notification-data-service";
import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html',
})
export class NotificationsPage {

    appConfig:any = AppConfig;
    config:any = Config;

    notifications:any = [];
    pagination:any = {
        "pNo" : 1,
        "pSize" : Config.pageSize,
        "sortCol" : 'id descending',
        "rowCountRequired" : true,
        "recordCount" : 0
    };

    itemExpandHeight: number = 120;

    constructor(public navCtrl: NavController, public navParams: NavParams , private publicFunctions : PublicFunctionsProvider,
                private userService: UserProvider, private notificationDataService : NotificationDataServiceProvider, private badge :Badge) {
    }

    ionViewDidLoad() {
        this.initNotifications(null);
    }

    expandItem(item){
        if(!item.IsRed){
            this.markNotificationAsRead(item);
        }
        this.notifications.map((listItem) => {
            if(item == listItem){
                listItem.expanded = !listItem.expanded;
            } else {
                listItem.expanded = false;
            }
            return listItem;
        });
    }

    initNotifications(infiniteScroll){
        let req = Object.assign({}, this.pagination);
        req.userReferenceId = AppConfig.clientPrefix+this.userService.user.ClientId;
        this.notificationDataService.getNotificationsByUser(req).then((data:any)=>{
            if(data){
                for(let i in data.Data){
                    data.Data[i].expanded = false;
                    this.publicFunctions.getStatusMessageTranslations("GeneralStatuses",data.Data[i].StatusId).then((statusName : any) => {
                        data.Data[i].status = statusName;
                    });
                    this.notifications.push(data.Data[i]);
                }
                //increment page
                this.pagination.recordCount = data.RecordCount > 0 ? data.RecordCount : this.pagination.recordCount;
                this.pagination.rowCountRequired = false;
                this.pagination.pNo++;

                if(infiniteScroll){
                    infiniteScroll.complete();
                    if(Array(data.Data).length<this.pagination.pSize){
                        infiniteScroll.enable(false);
                    }
                }
            }
        })
    }

    markNotificationAsRead(notification){
        let req = {
            "userNotificationId" : notification.Id
        };
        this.notificationDataService.markNotificationAsRead(req).then((data)=>{
            notification.IsRed = true;
            this.setNotificationBadge();
        })
    }

    async setNotificationBadge(){
        try {
            let hasPermission = await this.badge.hasPermission();
            this.decreaseBadges('1');
            if (!hasPermission) {
                await this.badge.requestPermission();
                this.decreaseBadges('1');
            }
        } catch (e) {
            console.error(e);
        }
    }

    async decreaseBadges(badgeNumber: string) {
        try {
            await this.badge.decrease(Number(badgeNumber));
        } catch (e) {
            console.error(e);
        }
    }

    doInfinite(infiniteScroll: InfiniteScroll) {
        this.initNotifications(infiniteScroll);
    }

}
