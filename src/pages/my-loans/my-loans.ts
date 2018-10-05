import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InfiniteScroll } from "ionic-angular";

import { AppConfig, Config } from "../../config";

import { LoanDataServiceProvider } from "../../providers/data-services/loan-data-service/loan-data-service";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";

@IonicPage()
@Component({
    selector: 'page-my-loans',
    templateUrl: 'my-loans.html',
})
export class MyLoansPage {

    appConfig:any = AppConfig;
    config:any = Config;

    myLoans:any = [];
    pagination:any = {
        "pNo" : 1,
        "Size" : Config.pageSize,
        "sortCol" : 'id descending',
        "rowCountRequired" : true,
        "recordCount" : 0
    };

    itemExpandHeight: number = 175;

    constructor(public navCtrl: NavController, public navParams: NavParams , private loanDataService : LoanDataServiceProvider , private publicFunctions : PublicFunctionsProvider) {
    }

    ionViewDidLoad() {
        this.initMyLoans(null);
    }

    expandItem(item){
        this.myLoans.map((listItem) => {
            if(item == listItem){
                listItem.expanded = !listItem.expanded;
            } else {
                listItem.expanded = false;
            }
            return listItem;
        });

    }

    initMyLoans(infiniteScroll){
        this.loanDataService.getAllLoans(this.pagination).then((data:any)=>{
            if(data){
                for(let i in data.Data){
                    data.Data[i].expanded = false;
                    this.publicFunctions.getStatusMessageTranslations("GeneralStatuses",data.Data[i].StatusId).then((statusName : any) => {
                        data.Data[i].status = statusName;
                    });
                    this.myLoans.push(data.Data[i]);
                }
                //increment page
                this.pagination.recordCount = data.RecordCount > 0 ? data.RecordCount : this.pagination.recordCount;
                this.pagination.rowCountRequired = false;
                this.pagination.pNo++;

                if(infiniteScroll){
                    infiniteScroll.complete();
                    if(Array(data.Data).length<this.pagination.Size){
                        infiniteScroll.enable(false);
                    }
                }
            }
        })
    }

    doInfinite(infiniteScroll: InfiniteScroll) {
        this.initMyLoans(infiniteScroll);
    }

    myLoanDetails(loan) {
        this.navCtrl.push('MyLoanDetailsPage',{'loan': loan});
    }

    additionalDetails(loan) {
        this.navCtrl.push('DataCollectionPage',{'loan': loan});
    }


}
