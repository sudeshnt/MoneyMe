import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppConfig } from "../../config";

import { LoanDataServiceProvider } from "../../providers/data-services/loan-data-service/loan-data-service";
import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    appConfig = AppConfig;

    loanStatusId:number = AppConfig.GeneralStatuses.REQUESTED;
    isMoneyDeposited:boolean = false;

    allowNewLoan = [
        AppConfig.GeneralStatuses.SETTLED,
        AppConfig.GeneralStatuses.CLOSED,
        AppConfig.GeneralStatuses.REJECTED,
        AppConfig.GeneralStatuses.REQUESTED
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams , private loanDataService : LoanDataServiceProvider, public userService : UserProvider) {}

    ionViewDidLoad() {}

    ionViewWillEnter(){
        this.initLastLoanStatus();
    }

    initLastLoanStatus(){
        this.loanDataService.getLastLoanStatus().then((data:any)=>{
            if(data){
                this.loanStatusId = data.StatusId;
                this.isMoneyDeposited = data.IsMoneyDeposited;
                if(this.userService.user.LoanStatusId != data.StatusId){
                    this.userService.updateAuthResponseStatus("LoanStatusId",data.StatusId);
                }
                if(this.userService.user.IsMoneyDeposited != data.IsMoneyDeposited){
                    this.userService.updateAuthResponseStatus("IsMoneyDeposited",data.IsMoneyDeposited);
                }
            }
        })
    }

    proceed(page){
        this.navCtrl.push(page);
    }

    newLoan(){
        this.navCtrl.push('FirstLoan_2Page');
    }

}
