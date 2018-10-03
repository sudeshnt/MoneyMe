import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiServiceProvider } from "../../api-service/api-service";
import { AppConfig, SeviceConfig } from "../../../config";

@Injectable()
export class PublicDataServiceProvider {

  constructor(public http: HttpClient, public apiService :  ApiServiceProvider) {}

  //GET
  public getCompanies(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetCompanies?companyName=''",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getCompanyAddressById(companyId){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetCompanyAddressById?compId="+companyId,{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getLoanParametersByCompanyId(companyId,salary){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetLoanParametersByCompanyId?companyId="+ companyId +'&salary='+salary,{},null, true).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //POST
  public getLoanValues(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetLoanValues",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getSystemTelephone(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetSystemTelephone",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getSystemAboutUs(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetSystemAboutUs",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getSystemFAQ(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetSystemFAQ",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getSystemSampleImages(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetSystemSampleImages",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //POST
  public validateReferralCode(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/ValidateReferralCode",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getIncomeTypes(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetIncomeTypes",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getRequestTypes(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetRequestTypes",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getSystemParameters(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_PUBLIC_SERVICE,"/GetSystemParameters",{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

}
