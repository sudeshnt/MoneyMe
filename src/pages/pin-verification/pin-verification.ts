import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ProfileDataServiceProvider } from "../../providers/data-services/profile-data-service/profile-data-service";
import { AppConfig } from "../../config";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";
import { UserProvider } from "../../providers/user/user";
import { LocalDataServiceProvider } from "../../providers/local-data-service/local-data-service";
import { PublicDataServiceProvider } from "../../providers/data-services/public-data-service/public-data-service";

@IonicPage()
@Component({
    selector: 'page-pin-verification',
    templateUrl: 'pin-verification.html',
})
export class PinVerificationPage {

    private pinVerificationForm : FormGroup;

    pinResendSuccessMessage:boolean = false;
    pinResendFailedMessage:boolean = false;
    systemTelephone:string = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private profileDataService : ProfileDataServiceProvider,
                private publicFunctions : PublicFunctionsProvider, private userService : UserProvider,
                private localDataService : LocalDataServiceProvider,private publicDataService : PublicDataServiceProvider ) {
        this.initPinVerificationForm();
    }


    ionViewDidLoad() {
        this.initLocalSystemTelephone();
    }

    initLocalSystemTelephone(){
        this.localDataService.getItem('SYSTEM_TELEPHONE').then(
            (telephone:any) => {
                if(telephone!=null){
                    this.systemTelephone = telephone;
                }else{
                    this.initSystemTelephone();
                }
            }
        );
    }

    initSystemTelephone(){
        this.publicDataService.getSystemTelephone().then((data:any)=>{
            if(data){
                this.systemTelephone = data;
                this.localDataService.setItem('SYSTEM_TELEPHONE',data);
            }
        })
    }

    initPinVerificationForm(){
        this.pinVerificationForm = this.formBuilder.group({
            VerificationCode: ['', Validators.required]
        });

        this.pinVerificationForm.get('VerificationCode').valueChanges.
        subscribe(salary => {
            this.pinResendSuccessMessage = false;
            this.pinResendFailedMessage = false;
        });
    }

    mobileVerification(){
        if(this.pinVerificationForm.valid){
            let req = {
                "VerificationCode": this.pinVerificationForm.value.VerificationCode
            };
            this.profileDataService.mobileVerification(req).then((data:any)=>{
                if(data){
                    if(data.ResponseStatusId == AppConfig.DefaultResponseStatuses.Success){
                        this.userService.updateAuthResponseStatus("AuthStatusId",AppConfig.AuthStatuses.InstitutionSelectionPending);
                        this.navCtrl.setRoot('BankSelectionPage')
                    }else{
                        this.publicFunctions.getStatusMessageTranslations("DefaultResponseStatuses",data.ResponseStatusId).then((errorMessage : any) => {
                            switch (data.ResponseStatusId) {
                                case AppConfig.DefaultResponseStatuses.VerificationCodeWrong:
                                    this.pinVerificationForm.controls['VerificationCode'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                }
            })
        }
    }

    resendMobileVerificationCode(){
        this.profileDataService.resendMobileVerificationCode().then((data:any)=>{
            if(data){
                if(data.ResponseStatusId == AppConfig.DefaultResponseStatuses.Success){
                    this.pinResendSuccessMessage = true;
                }else{
                    this.pinResendFailedMessage = true;
                }
            }
        })
    }

}
