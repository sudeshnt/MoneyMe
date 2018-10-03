import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig, SeviceConfig } from "../../../config";
import { ApiServiceProvider } from "../../api-service/api-service";

@Injectable()
export class AuthDataServiceProvider {

  constructor(public http: HttpClient , public apiService :  ApiServiceProvider) {}

  //POST
  public registerUser(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/Register",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //POST
  public authenticateUser(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_AUTHENTICATION_SERVICE,"/Authenticate",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //PUT
  public changePassword(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.API_URL,SeviceConfig.CLIENT_AUTHENTICATION_SERVICE,"/ChangePassword",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //POST
  public forgotPassword(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_AUTHENTICATION_SERVICE,"/ForgotPassword",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //POST
  public signOut(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_AUTHENTICATION_SERVICE,"/SignOut",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

}
