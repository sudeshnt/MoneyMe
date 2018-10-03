import { Component , ChangeDetectorRef } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { AppConfig } from "../../config";

import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";
import { LocalDataServiceProvider } from "../../providers/local-data-service/local-data-service";
import { TranslateService } from "@ngx-translate/core";
import {UserProvider} from "../../providers/user/user";
import {LoanDataServiceProvider} from "../../providers/data-services/loan-data-service/loan-data-service";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";

@IonicPage()
@Component({
    selector: 'page-first-loan-2',
    templateUrl: 'first-loan-2.html'
})
export class FirstLoan_2Page {

    private firstLoanForm : FormGroup;
    firstLoanFormSubmitted: boolean;

    incomeTypes:any[] = [];
    requestTypes:any[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,private modalCtrl: ModalController,
                private formBuilder: FormBuilder, private localDataService : LocalDataServiceProvider,
                private translateService: TranslateService, private publicDataService : PublicDataServiceProvider, public userService : UserProvider,
                private loanDataService: LoanDataServiceProvider, private publicFunctions : PublicFunctionsProvider) {
        this.initFirstLoanForm();
    }

    ionViewDidLoad() {
        this.initRequestTypes();
        this.initIncomeTypes();
    }

    initFirstLoanForm() {
        this.userService.getLocalAuthResponse().then((user:any)=>{
            if(user && user.isAuthorized && user.AuthStatusId){
                this.firstLoanForm = this.formBuilder.group({
                    purpose: ['', Validators.required],
                    amount: ['', Validators.required],
                    incomeType: ['', Validators.required]
                });
            }else{
                this.localDataService.getItem('FIRST_LOAN').then((firstLoan) => {
                    this.firstLoanForm = this.formBuilder.group({
                        purpose: [firstLoan ? firstLoan["purpose"] : '' , Validators.required],
                        amount: [firstLoan ? firstLoan["amount"] : '', Validators.required],
                        incomeType: [firstLoan ? firstLoan["incomeType"] : '', Validators.required],
                        monthlyIncome: [firstLoan ? firstLoan["monthlyIncome"] : '', Validators.required]
                    });
                });
            }
        });
    }

    private initRequestTypes () {
        this.publicDataService.getRequestTypes().then((response: any) => {
            if (response) {
                this.requestTypes = response;
            }
        })
    }

    private initIncomeTypes () {
        this.publicDataService.getIncomeTypes().then((response: any) => {
            if (response) {
                this.incomeTypes = response;
            }
        })
    }

    saveFirstLoan(isValid){
        this.firstLoanFormSubmitted = true;
        if(isValid) {
            if (this.userService.user.isAuthorized) {
                let req = {
                    "LoanAmount": this.firstLoanForm.value.amount,
                    "RequestTypeId": this.firstLoanForm.value.purpose,
                    "IncomeTypeId": this.firstLoanForm.value.incomeType
                };
                this.loanDataService.newLoanRequest(req).then((data:any) => {
                    if(data){
                        console.log(data);
                        if(data.ResponseStatusId == AppConfig.LoanRequestStatuses.Success){
                            this.userService.setUserCurrentLoanID(data.RecordPrimaryId);
                            this.navCtrl.setRoot('BankSelectionPage');
                        }else{
                            this.publicFunctions.getStatusMessageTranslations("LoanRequestStatuses",data.ResponseStatusId).then((errorMessage : any) => {
                                this.firstLoanForm.setErrors({"error_msg": errorMessage ? errorMessage : ""});
                            });
                        }
                    }
                });
            } else {
                this.localDataService.setItem('APP_STAGE', AppConfig.APP_STAGES.FIRST_LOAN_CREATED);
                this.localDataService.setItem('FIRST_LOAN', this.firstLoanForm.value);
                this.proceed();
            }
        }
    }

    proceed(){
        this.navCtrl.push('LoginPage',{'isRegisterEnabled':true});
    }

}
