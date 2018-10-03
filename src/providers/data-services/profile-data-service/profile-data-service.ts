import { Injectable } from '@angular/core';
import {AppConfig, SeviceConfig} from "../../../config";
import { ApiServiceProvider } from "../../api-service/api-service";

@Injectable()
export class ProfileDataServiceProvider {

  constructor( private apiService :  ApiServiceProvider) {}

  //PUT
  public mobileVerification(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/MobileVerification",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //PUT
  public resendMobileVerificationCode(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/MobileVerificationCodeRegenerate",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getDocuments(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/GetDocuments",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //PUT
  public completeDocumentUpload(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/DocumentUploadComplete",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getProfile(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/GetProfileView",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //PUT
  public updateDeviceRegNo(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/UpdateDeviceRegNo",req,null, true).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getAddressInfo(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/GetAddressInfo",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getReferralCode(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/GetReferralCode",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getLoanParameterValues(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/GetLoanParameterValues",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //PUT
  public removeDocument(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.API_URL,SeviceConfig.CLIENT_PROFILE_SERVICE,"/RemoveDocument?id="+req.Id,{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

}
