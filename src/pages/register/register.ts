import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as sha1 from 'js-sha1';
import firebase from 'firebase';
import { AngularFireAuth } from "angularfire2/auth";

import { AppConfig } from "../../config";

import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";
import { LocalDataServiceProvider } from "../../providers/local-data-service/local-data-service";
import { ValidationService } from "../../providers/validation-service/validation-service";
import { UserProvider } from "../../providers/user/user";
import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";
import { AuthDataServiceProvider } from "../../providers/data-services/auth-data-service/auth-data-service";
import { DatePipe } from "@angular/common";

@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {

    private registrationForm : FormGroup;

    appConfig = AppConfig;

    authOption = AppConfig.AUTH_OPTIONS.DEFAULT.ID;
    firstLoanObj:any;

    registrationFormSubmitted = false;

    loading:Loading;

    constructor(platform: Platform,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder ,
                private localDataService : LocalDataServiceProvider, private fire: AngularFireAuth, public loadingCtrl: LoadingController,
                private publicDataService : PublicDataServiceProvider, private authDataService : AuthDataServiceProvider,
                private user : UserProvider, private publicFunctions : PublicFunctionsProvider, private datePipe: DatePipe) {
        this.initRegistrationForm();
    }

    ionViewDidLoad() {
        this.localDataService.getItem('FIRST_LOAN').then((firstLoan) => {
            if(firstLoan!=null){
                this.initFirstLoanObj(firstLoan);
            }
        });
    }

    initFirstLoanObj(firstLoan){
        this.firstLoanObj =  {
            "SalaryAmount": firstLoan.monthlyIncome,
            "LoanAmount": firstLoan.amount,
            "CompanyId": null,
            "CompanyName": "",
            "CompanyAddress": "",
            "ClientId": 0,
            "SalaryDay": 0,
            "ReferralCode": "",
            "RequestTypeId": firstLoan.purpose,
            "IncomeTypeId": firstLoan.incomeType
        }
    }

    initRegistrationForm(){
        this.registrationForm = this.formBuilder.group({
            Email: ['', [Validators.required,ValidationService.emailValidator]],
            Password: ['', Validators.required],
            ConfirmPassword: ['', Validators.required],
            Mobile: ['', Validators.required],
            IsSriLankan: [''],
            IdentificationNo: ['', Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            DateofBirth: ['2018-01-01'],
            CompanyName: [''],
            CompanyAddress: [''],
            LoginId: [''],
            WorkingExperience: ['', Validators.required],
        },{validator: this.checkIfMatchingPasswords('Password', 'ConfirmPassword')});
    }

    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            let passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({notEquivalent: true})
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
        }
    }

    socialRegistration(auth_option){
        this.showLoadingSpinner();
        let provider;
        switch (auth_option){
            case 'G_PLUS':
                provider = new firebase.auth.GoogleAuthProvider();
                this.loginWithFireBaseSocial(provider,AppConfig.AUTH_OPTIONS.G_PLUS.ID);
                break;
            case 'FB':
                provider = new firebase.auth.FacebookAuthProvider();
                this.loginWithFireBaseSocial(provider,AppConfig.AUTH_OPTIONS.FB.ID);
                break;
            default:
                break;
        }
    }

    loginWithFireBaseSocial(provider,auth_option){
        this.fire.auth.signInWithRedirect(provider).then( () => {
            this.fire.auth.getRedirectResult().then( res => {
                this.hideLoadingSpinner();
                if(res){
                    this.insertSocialUserToRegisterForm(auth_option,res);
                }
            },err=>{
                this.hideLoadingSpinner();
            })
        },()=>{
            this.hideLoadingSpinner();
        })
    }

    insertSocialUserToRegisterForm(auth_option,res){
        this.authOption = auth_option;
        this.registrationForm.controls['Password'].setValidators([]);
        this.registrationForm.controls['ConfirmPassword'].setValidators([]);
        this.registrationForm.controls['Password'].updateValueAndValidity();
        this.registrationForm.controls['ConfirmPassword'].updateValueAndValidity();
        if(this.authOption == AppConfig.AUTH_OPTIONS.FB.ID){
            this.registrationForm.controls['LoginId'].setValue(res.additionalUserInfo.profile.id);
        }else{
            this.registrationForm.controls['LoginId'].setValue(res.additionalUserInfo.profile.id);
        }
        if(res.user.displayName){
            if(res.user.displayName.split(" ").length>0){
                this.registrationForm.controls['FirstName'].setValue(res.user.displayName.split(" ")[0]);
                if(res.user.displayName.split(" ").length > 1){
                    this.registrationForm.controls['LastName'].setValue(res.user.displayName.split(" ")[res.user.displayName.split(" ").length-1]);
                }
            }
        }
        if(res.additionalUserInfo.profile.email){
            this.registrationForm.controls['Email'].setValue(res.additionalUserInfo.profile.email);
        }
        if(res.additionalUserInfo.profile.birthday){
            this.registrationForm.controls['DateofBirth'].setValue(this.datePipe.transform(new Date(res.additionalUserInfo.profile.birthday), 'dd-MMM-yyyy'));
        }
        if(res.user.phoneNumber){
            this.registrationForm.controls['Mobile'].setValue(res.user.phoneNumber);
        }
    }

    registerUser(){
        this.registrationFormSubmitted = true;
        if(this.registrationForm.valid){
            if(this.firstLoanObj){
                let req = {
                    "Loan": this.firstLoanObj,
                    "IdentificationNo": this.registrationForm.controls['IdentificationNo'].value,
                    "FirstName": this.registrationForm.controls['FirstName'].value,
                    "SecondName": "",
                    "LastName": this.registrationForm.controls['LastName'].value,
                    "Email": this.registrationForm.controls['Email'].value,
                    "LoginId":  this.registrationForm.controls['LoginId'].value ? this.registrationForm.controls['LoginId'].value : this.registrationForm.controls['Email'].value,
                    "Mobile": this.registrationForm.controls['Mobile'].value,
                    "DateofBirth": this.datePipe.transform(this.registrationForm.controls['DateofBirth'].value, 'dd/MMM/yyyy'),
                    "Password": this.registrationForm.controls['Password'].value ? sha1(this.registrationForm.controls['Password'].value) : '**',
                    "HomeAddress": '',
                    "AuthOption":  this.authOption,
                    "DeviceRegId": '',
                    "IsForeigner": !this.registrationForm.controls['IsSriLankan'].value,
                    "YearsOfExperience": this.registrationForm.controls['WorkingExperience'].value
                };
                req.Loan.CompanyName = this.registrationForm.controls['CompanyName'].value;
                req.Loan.CompanyAddress = this.registrationForm.controls['CompanyAddress'].value;
                this.localDataService.getItem('DEVICE_TOKEN').then((local_token:any)=>{
                    if(local_token){
                        req.DeviceRegId = local_token;
                    }
                    // console.log(req);
                    this.authDataService.registerUser(req).then((data:any) => {
                        if(data){
                            if(data.ResponseStatusId == AppConfig.DefaultResponseStatuses.Success && data.RecordPrimaryId > 0){
                                this.localDataService.remove('FIRST_LOAN').then((suc)=>{
                                    this.localDataService.setItem('APP_STAGE', AppConfig.APP_STAGES.REGISTRATION_SUCCESSFUL);
                                    data.ClientAuthResponse.AuthOption = this.authOption;
                                    this.user.setLocalAuthResponse(data.ClientAuthResponse);
                                    this.navCtrl.setRoot('PinVerificationPage');
                                });
                            }else{
                                this.publicFunctions.getStatusMessageTranslations("DefaultResponseStatuses",data.ResponseStatusId).then((errorMessage : any) => {
                                    switch (data.ResponseStatusId) {
                                        case AppConfig.DefaultResponseStatuses.IdentificationNoAlreadyExist:
                                            this.registrationForm.controls['IdentificationNo'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                                            break;
                                        case AppConfig.DefaultResponseStatuses.EmailAlreadyExist:
                                            this.registrationForm.controls['Email'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }
                        }
                    });
                });
            }
        }
    }

    showLoadingSpinner(){
        this.loading = this.loadingCtrl.create({
            "content" : "Please Wait..."
        });
        this.loading.present();
    }

    hideLoadingSpinner(){
        this.loading.dismissAll();
    }

}
