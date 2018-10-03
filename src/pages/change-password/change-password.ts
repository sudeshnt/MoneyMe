import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import * as sha1 from 'js-sha1';

import { AppConfig } from "../../config";

import { AuthDataServiceProvider } from "../../providers/data-services/auth-data-service/auth-data-service";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";
import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
    selector: 'page-change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

    private changePasswordForm : FormGroup;

    changePasswordSuccessMessage:boolean = false;

    showPassword = {
        "CurrentPassword":false,
        "ChangedPassword":false,
        "ConfirmChangedPassword":false,
    };

    constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder, private authDataService: AuthDataServiceProvider,
                private publicFunctions : PublicFunctionsProvider, public userService: UserProvider) {
        this.initChangePasswordForm();
    }

    initChangePasswordForm(){
        this.changePasswordForm = this.formBuilder.group({
            CurrentPassword: ['', Validators.required],
            ChangedPassword: ['', Validators.required],
            ConfirmChangedPassword: ['', Validators.required]
        });
    }

    ionViewDidLoad() {}

    showHidePassword(passwordType){
        this.showPassword[passwordType] = !this.showPassword[passwordType];
    }

    changePassword(){
        let req = {
            "ClientId": this.userService.user.ClientId,
            "CurrentPassword": sha1(this.changePasswordForm.value.CurrentPassword),
            "ChangedPassword": sha1(this.changePasswordForm.value.ChangedPassword),
            "ConfirmChangedPassword": sha1(this.changePasswordForm.value.ConfirmChangedPassword)
        };
        this.authDataService.changePassword(req).then((data:any) => {
            if(data){
                if(data.ResponseStatusId == AppConfig.DefaultResponseStatuses.Success){
                    this.changePasswordForm.reset();
                    this.changePasswordSuccessMessage = true;
                }else{
                    this.publicFunctions.getStatusMessageTranslations("DefaultResponseStatuses",data.ResponseStatusId).then((errorMessage : any) => {
                        switch (data.ResponseStatusId) {
                            case AppConfig.DefaultResponseStatuses.CurrentPasswordNotMatched:
                                this.changePasswordForm.controls['CurrentPassword'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                                break;
                            case AppConfig.DefaultResponseStatuses.ChangePasswordSameAsCurrent:
                                this.changePasswordForm.controls['ChangedPassword'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                                break;
                            case AppConfig.DefaultResponseStatuses.ConfirmPasswordNotMatched:
                                this.changePasswordForm.controls['ConfirmChangedPassword'].setErrors({"error_msg": errorMessage ? errorMessage : ""});
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        });
    }

}
