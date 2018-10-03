import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LocalDataServiceProvider } from "../local-data-service/local-data-service";

@Injectable()
export class UserProvider {

  public user:any;

  constructor(public http: HttpClient, private localDataService : LocalDataServiceProvider) {
    this.user = {
      "isAuthorized" : false
    }
  }

  public getLocalAuthResponse(){
      let promise = new Promise((resolve, reject) => {
        this.localDataService.getItem('AUTH_RESPONSE').then((authResponse) => {
            if(authResponse !== null && authResponse["isAuthorized"]){
              this.user = authResponse;
              resolve(authResponse);
            }else{
              resolve(null);
            }
        });
      });
      return promise;
  }

  public setLocalAuthResponse(auth_response){
    auth_response.isAuthorized = true;
    this.user = auth_response;
    this.localDataService.setItem('AUTH_RESPONSE', auth_response);
  }

  public setUserCurrentLoanID(loan_id){
    this.user.LoanId = loan_id;
    this.localDataService.setItem('AUTH_RESPONSE', this.user);
  }

  public updateAuthResponseStatus(statusKey,status){
    try{
      this.localDataService.getItem('AUTH_RESPONSE').then((authResponse) => {
        if(authResponse !== null){
          authResponse[statusKey] = status;
          this.user = authResponse;
          this.setLocalAuthResponse(authResponse);
        }else{
          return false;
        }
      });
    }catch(e){
      return false;
    }
  }

  public removeLocalAuthResponse(){
    this.user = {
      "isAuthorized" : false
    };
    this.localDataService.remove('AUTH_RESPONSE');
  }

}
