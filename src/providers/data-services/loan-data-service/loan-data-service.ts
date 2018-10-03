import { Injectable } from '@angular/core';
import {AppConfig, SeviceConfig} from "../../../config";
import { ApiServiceProvider } from "../../api-service/api-service";

@Injectable()
export class LoanDataServiceProvider {

  constructor(private apiService :  ApiServiceProvider) {}

  //PUT
  public submitSignatureInfo(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPut(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/ChangeSignatureInfo",req,null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getAllLoans(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/GetAllLoans?pNo="+req.pNo+"&pSize="+req.Size+"&rowCountRequired="+req.rowCountRequired,{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getReferrals(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/GetReferrals?pNo="+req.pNo+"&pSize="+req.pSize+"&rowCountRequired="+req.rowCountRequired,{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getLastLoanStatus(){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/GetLastLoanStatus",{} , null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //POST
  public newLoanRequest(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/NewLoanRequest", req , null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //GET
  public getInstitutionsByLoanId(req){
    let promise = new Promise((resolve, reject) => {
      return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/GetInstitutionsByLoanId?id="+req.loanId,{},null, false).then((data : any) => {
        resolve(data);
      }).catch((error : any) => {
        resolve(null);
      });
    });
    return promise;
  }

  //POST
  public updateLoanRequest(req){
      let promise = new Promise((resolve, reject) => {
          return this.apiService.httpPost(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/UpdateLoanRequest", req , null, false).then((data : any) => {
              resolve(data);
          }).catch((error : any) => {
              resolve(null);
          });
      });
      return promise;
  }

    //GET
  public getLoanItemsByLoanId(req){
      let promise = new Promise((resolve, reject) => {
          return this.apiService.httpGet(AppConfig.API_URL,SeviceConfig.CLIENT_LOAN_SERVICE,"/GetLoanItemsByLoanId?id="+req.loanId,{},null, false).then((data : any) => {
              resolve(data);
          }).catch((error : any) => {
              resolve(null);
          });
      });
      return promise;
  }

}
