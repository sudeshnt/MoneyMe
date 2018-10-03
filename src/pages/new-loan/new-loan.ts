import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfig } from "../../config";
import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";
import { ProfileDataServiceProvider } from "../../providers/data-services/profile-data-service/profile-data-service";
import { UserProvider } from "../../providers/user/user";
import { LoanDataServiceProvider } from "../../providers/data-services/loan-data-service/loan-data-service";

@IonicPage()
@Component({
    selector: 'page-new-loan',
    templateUrl: 'new-loan.html',
})
export class NewLoanPage {

    private newLoanForm : FormGroup;
    newLoanFormErrors:any;

    min = 0;
    max = 0;
    step = 500;

    loanValuesSuccess:boolean = false;
    dueAmount:string;
    dueDate:string;

    profile:any={};

    daysOfMonth:number [] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
                private publicDataService: PublicDataServiceProvider,private publicFunctions: PublicFunctionsProvider,
                private profileDataService:ProfileDataServiceProvider, public userService : UserProvider, private loanDataService: LoanDataServiceProvider) {
        this.initNewLoanFormErrors();
        this.initNewLoanForm();
    }

    ionViewDidLoad() {
        this.initDaysOfMonth();
        this.initProfile();
    }

    initDaysOfMonth(){
        for(let i = 1 ; i <= 31 ; i++){
            this.daysOfMonth.push(i);
        }
    }

    initProfile(){
        this.profileDataService.getProfile().then((data)=>{
            if(data){
                this.profile = data;
                if(data["Salary"]>0){
                    this.getLoanParameters(data["CompanyId"] ? data["CompanyId"] : 0,data["Salary"]);
                }
            }
        })
    }

    initNewLoanFormErrors(){
        this.newLoanFormErrors = {
            "salary":''
        };
    }

    initNewLoanForm(){
        this.newLoanForm = this.formBuilder.group({
            cash: ['', Validators.required],
            salaryDate: [31, Validators.required]
        });

        this.newLoanForm.get('cash').valueChanges.debounceTime(1000).
        subscribe(cash => {
            this.getLoanValues();
        });

        this.newLoanForm.get('salaryDate').valueChanges.
        subscribe(salaryDate => {
            this.newLoanForm.value.salaryDate = salaryDate;
            this.getLoanValues();
        });
    }

    getLoanParameters(companyId,salary){
        this.publicDataService.getLoanParametersByCompanyId( companyId,salary ).then((data : any) => {
            if(data){
                this.min = data.MinLoanAmount;
                this.max = data.MaxLoanAmount;
                this.newLoanForm.patchValue({
                    salaryDate: data.SalaryDay
                });
                // if(this.newLoanForm.value.cash>data.MaxLoanAmount || this.newLoanForm.value.cash<data.MinLoanAmount){
                //   this.newLoanForm.patchValue({
                //     cash: this.newLoanForm.value.cash>data.MaxLoanAmount ? data.MaxLoanAmount : data.MinLoanAmount
                //   });
                // }
            }
        });
    }

    getLoanValues(){
        if(this.newLoanForm.value.cash>0){
            let req = {
                "SalaryAmount": this.profile.Salary,
                "LoanAmount": this.newLoanForm.value.cash,
                "CompanyId": this.profile.CompanyId,
                "CompanyName": this.profile.CompanyName,
                "CompanyAddress": this.profile.CompanyAddress,
                "ClientId": this.userService.user.ClientId,
                "SalaryDay": this.newLoanForm.value.salaryDate,
                "ReferralCode": ""
            };
            this.publicDataService.getLoanValues(req).then((data : any) => {
                if(data){
                    if(data.SalaryStatusId == AppConfig.SalaryStatuses.Success &&
                        data.LoanAmountStatusId == AppConfig.LoanAmountStatuses.Success &&
                        data.SalaryDayStatusId == AppConfig.SalaryDayStatuses.Success &&
                        data.ReferralStatusId == AppConfig.ReferralStatuses.Success){
                        this.loanValuesSuccess = true;
                        this.dueAmount = data.PaybackAmount;
                        this.dueDate = data.PaybackDate;
                    }else{
                        this.loanValuesSuccess = false;
                        if(data.SalaryStatusId != AppConfig.SalaryStatuses.Success){
                            this.publicFunctions.getStatusMessageTranslations("SalaryStatuses",data.SalaryStatusId).then((errorMessage : any) => {
                                this.newLoanFormErrors.salary = errorMessage ? errorMessage : "";
                            });
                        }
                        if(data.LoanAmountStatusId != AppConfig.LoanAmountStatuses.Success){
                            this.publicFunctions.getStatusMessageTranslations("LoanAmountStatuses",data.LoanAmountStatusId).then((errorMessage : any) => {
                                this.newLoanForm.controls['cash'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                            });
                        }
                        if(data.SalaryDayStatusId != AppConfig.SalaryDayStatuses.Success){
                            this.publicFunctions.getStatusMessageTranslations("SalaryDayStatuses",data.SalaryDayStatusId).then((errorMessage : any) => {
                                switch(data.SalaryDayStatusId){
                                    case AppConfig.SalaryDayStatuses.FewDaysToSalaryDay:
                                        errorMessage = errorMessage ? errorMessage.replace('[days]',data.LRDaysBeforeSalDay) : "";
                                        break;
                                    case AppConfig.SalaryDayStatuses.FewDaysFastSalaryDay:
                                        errorMessage = errorMessage ? errorMessage.replace('[days]',data.LRDaysAfterSalDay) : "";
                                        break;
                                    default:
                                        break;
                                }
                                this.newLoanForm.controls['salaryDate'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                            });
                        }
                    }
                }
            });
        }
    }

    requestNewLoan(){
        if(this.newLoanForm.valid){
            let req = {
                "SalaryAmount": this.profile.Salary,
                "LoanAmount": this.newLoanForm.value.cash,
                "CompanyId": this.profile.CompanyId,
                "CompanyName": this.profile.CompanyName,
                "CompanyAddress": this.profile.CompanyAddress,
                "ClientId": this.userService.user.ClientId,
                "SalaryDay": this.newLoanForm.value.salaryDate,
                "ReferralCode": ""
            };
            this.loanDataService.newLoanRequest(req).then((data:any) => {
                if(data){
                    if(data.ResponseStatusId == AppConfig.LoanRequestStatuses.Success){
                        this.navCtrl.setRoot('HomePage');
                    }else{
                        this.publicFunctions.getStatusMessageTranslations("LoanRequestStatuses",data.ResponseStatusId).then((errorMessage : any) => {
                            this.newLoanForm.setErrors({"error_msg": errorMessage ? errorMessage : ""});
                        });
                    }
                }
            });
        }
    }

}
