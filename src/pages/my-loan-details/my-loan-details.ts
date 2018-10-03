import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from "../../providers/user/user";
import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";
import { LoanDataServiceProvider } from "../../providers/data-services/loan-data-service/loan-data-service";
import {PublicFunctionsProvider} from "../../providers/public-functions/public-functions";
import {AppConfig} from "../../config";

@IonicPage()
@Component({
    selector: 'page-my-loan-details',
    templateUrl: 'my-loan-details.html',
})
export class MyLoanDetailsPage {

    loan:any = {};
    systemParameters: any = {};
    institutes: Array<any> = [];
    loanItems: Array<any> = [];
    defaultSelectedCount = 0;
    selectedList: Array<any> = [];

    SELECTED_OUT_OF:string = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, private publicDataService : PublicDataServiceProvider,
                public loanDataService: LoanDataServiceProvider ,public userService : UserProvider, private publicFunctions : PublicFunctionsProvider) {
        this.loan = navParams.get('loan');
    }

    ionViewDidLoad() {

        if (this.loan) {
            this.initSystemParameters();
            this.initInstitutesByLoanId();
        }
    }

    private initSystemParameters () {
        this.publicDataService.getSystemParameters().then((response: any) => {
            if (response) {
                this.systemParameters = response;
            }
        })
    }

    private initInstitutesByLoanId() {
        let req = {
            'loanId' : this.loan.Id,
        };
        this.loanDataService.getInstitutionsByLoanId(req).then((response: any) => {
            if (response) {
                this.institutes = response.Data;
                this.initLoanItemsByLoanId();
            }
        });
    }

    private initLoanItemsByLoanId() {
        let req = {
            'loanId' : this.loan.Id,
        };
        this.loanDataService.getLoanItemsByLoanId(req).then((response: any) => {
            if (response) {
                this.defaultSelectedCount = response.Data.length;
                for(let data of response.Data){
                    this.publicFunctions.getStatusMessageTranslations("GeneralStatuses",data.StatusId).then((statusName : any) => {
                        data.status = statusName;
                    });
                }
                this.selectedList = Object.assign([], response.Data);
                this.loanItems = Object.assign([], response.Data);
                for (let institute of this.institutes) {
                    let found = false;
                    for (let loanItem of this.loanItems) {
                        if (institute.Id == loanItem.InstitutionId) {
                            found = true;
                        }
                    }
                    if (!found) this.loanItems.push(this.mapInstituteToLoanItem(institute))
                }
                this.translateSELECTED_OUT_OF();
            }
        });
    }

    selectInstitute(event, institute){
        if (event.checked) {
            this.selectedList.push(institute);
        } else {
            const index = this.selectedList.indexOf(institute);
            if (index >= 0) {
                this.selectedList.splice(index, 1);
            }
        }
        this.translateSELECTED_OUT_OF();
    }

    updateInstitutes() {
        let req = {
            'Mode' : AppConfig.LoanRequestUpdateModes.InstitutionUpdate,
            'loanId' : this.loan.Id,
            'Institutions' : <any> []
        };
        for(let selected of this.selectedList){
            if (selected.Id == 0) {
                req.Institutions.push(selected.InstitutionId);
            }
        }
        this.loanDataService.updateLoanRequest(req).then((response: any) => {
            if (response && response.ResponseStatusId==AppConfig.DefaultResponseStatuses.Success) {
                this.navCtrl.push('MyLoansPage');
            }
        });
    }

    // Translate Functions Start
    translateSELECTED_OUT_OF(){
        this.publicFunctions.getTranslation('SELECTED_OUT_OF').then((message:any)=>{
            if(message){
                this.SELECTED_OUT_OF = message;
                this.SELECTED_OUT_OF = this.SELECTED_OUT_OF.replace('[selected_count]', this.selectedList.length.toString());
                this.SELECTED_OUT_OF = this.SELECTED_OUT_OF.replace('[max_count]', this.systemParameters.MaxInstitute);
            }
        });
    }
    // Translate Functions End

    private mapInstituteToLoanItem (institute) {
        return {
            "Id": 0,
            "InstitutionId": institute.Id,
            "Institution": institute.Name,
            "Date": '',
            "IsGranted": false,
            "StatusId": 0
        }
    }
}
