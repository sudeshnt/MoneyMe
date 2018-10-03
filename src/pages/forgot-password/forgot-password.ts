import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AppConfig } from "../../config";

import { ValidationService } from "../../providers/validation-service/validation-service";
import { AuthDataServiceProvider } from "../../providers/data-services/auth-data-service/auth-data-service";

@IonicPage()
@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

    public forgotPasswordForm : FormGroup;
    forgotPasswordRequested:boolean = false;
    forgotPasswordFormSubmitted:boolean = false;
    forgotPasswordError:boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
                private authDataService : AuthDataServiceProvider) {
        this.initForgotPasswordForm();
    }

    ionViewDidLoad() {

    }

    initForgotPasswordForm(){
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required,ValidationService.emailValidator]],
        });


        this.forgotPasswordForm.valueChanges.subscribe(val => {
            this.forgotPasswordError = false;
            this.forgotPasswordFormSubmitted = false;
        });
    }

    requestForgotPassword(){
        this.forgotPasswordFormSubmitted = true;
        if(this.forgotPasswordForm.valid){
            let req = {
                "Email": this.forgotPasswordForm.value.email
            };
            this.authDataService.forgotPassword(req).then((data:any)=>{
                if(data){
                    if(data.AuthStatusId == AppConfig.AuthStatuses.Success){
                        this.forgotPasswordRequested = true;
                    }else{
                        this.forgotPasswordRequested = false;
                        this.forgotPasswordError = true;
                    }
                }
            })
        }
    }

}
