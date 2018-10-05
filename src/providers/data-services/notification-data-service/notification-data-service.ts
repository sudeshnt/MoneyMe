import { Injectable } from '@angular/core';
import {AppConfig, SeviceConfig} from "../../../config";
import { ApiServiceProvider } from "../../api-service/api-service";
import {UserProvider} from "../../user/user";

@Injectable()
export class NotificationDataServiceProvider {

  constructor(private apiService :  ApiServiceProvider, private userService : UserProvider) {}

  //GET
  public getNotificationsByUser(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.NOTIFICATION_API_URL,SeviceConfig.CLIENT_NOTIFICATION_SERVICE,"/GetSystemNotificationByUser?userReferenceId="+req.userReferenceId+"&pNo="+req.pNo+"&pSize="+req.pSize+"&rowCountRequired="+req.rowCountRequired+"&sortCol="+req.sortCol,{},{"AppSessionId" : this.userService.user.SessionId}, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getUnreadNotificationCountByUser(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.NOTIFICATION_API_URL,SeviceConfig.CLIENT_NOTIFICATION_SERVICE,"/GetUnreadSystemNotificationCountByUser?userReferenceId="+req.userReferenceId,{},{"AppSessionId" : this.userService.user.SessionId}, true).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //PUT
  public markNotificationAsRead(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.NOTIFICATION_API_URL,SeviceConfig.CLIENT_NOTIFICATION_SERVICE,"/SystemNotificationMarkAsRead?userNotificationId="+req.userNotificationId,{},{"AppSessionId" : this.userService.user.SessionId}, true).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

}
