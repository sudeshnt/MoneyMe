import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";
import { LoanDataServiceProvider } from "../../providers/data-services/loan-data-service/loan-data-service";
import {UserProvider} from "../../providers/user/user";
import {PublicFunctionsProvider} from "../../providers/public-functions/public-functions";
import {AppConfig} from "../../config";

@IonicPage()
@Component({
    selector: 'page-bank-selection',
    templateUrl: 'bank-selection.html',
})
export class BankSelectionPage {

    systemParameters: any = {};
    institutes: any = [];
    BANK_SELECTION_INSTRUCTIONS:string = "";
    selectedList: Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private publicDataService : PublicDataServiceProvider,
                private loanDataService: LoanDataServiceProvider, public userService : UserProvider, private publicFunctions : PublicFunctionsProvider) {}

    ionViewDidLoad() {
        this.initSystemParameters();
        this.initInstitutesByLoanId();
    }

    private initSystemParameters () {
        this.publicDataService.getSystemParameters().then((response: any) => {
            if (response) {
                this.systemParameters = response;
                this.translateBANK_SELECTION_INSTRUCTIONS();
            }
        })
    }

    private initInstitutesByLoanId() {
        let req = {
            'loanId' : this.userService.user.LoanId,
        };
        this.loanDataService.getInstitutionsByLoanId(req).then((response: any) => {
            if (response) {
                for(let i in response.Data){
                    response.Data[i].Status=false;
                    this.institutes.push(response.Data[i]);
                }
            }
        });
    }

    selectInstitute(event, institute){
        if (event.checked) {
            this.selectedList.push(institute)
        } else {
            const index = this.selectedList.indexOf(institute);
            if (index >= 0) {
                this.selectedList.splice(index, 1);
            }
        }
    }

    submitInstituteList(){
        let req = {
            'Mode' : AppConfig.LoanRequestUpdateModes.InstitutionUpdate,
            'loanId' : this.userService.user.LoanId,
            'Institutions' : <any>[]
        };
        for(let selected of this.selectedList){
            req.Institutions.push(selected.Id);
        }
        this.loanDataService.updateLoanRequest(req).then((response: any) => {
            if (response && response.ResponseStatusId==AppConfig.DefaultResponseStatuses.Success) {
                this.userService.updateAuthResponseStatus("AuthStatusId",AppConfig.AuthStatuses.LoanSignatureInfoPending);
                this.navCtrl.setRoot('SettingMeetupPage');
            }
        });
    }

    translateBANK_SELECTION_INSTRUCTIONS(){
        this.publicFunctions.getTranslation('BANK_SELECTION_INSTRUCTIONS').then((message:any)=>{
            if(message){
                this.BANK_SELECTION_INSTRUCTIONS = message;
                this.BANK_SELECTION_INSTRUCTIONS = this.BANK_SELECTION_INSTRUCTIONS.replace('[max_count]',this.systemParameters.MaxInstitute);
                this.BANK_SELECTION_INSTRUCTIONS = this.BANK_SELECTION_INSTRUCTIONS.replace('[min_count]',this.systemParameters.MinInstitute);
            }
        });
    }

}
