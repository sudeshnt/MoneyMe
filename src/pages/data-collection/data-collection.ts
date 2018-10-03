import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppConfig} from "../../config";
import {UserProvider} from "../../providers/user/user";
import {LoanDataServiceProvider} from "../../providers/data-services/loan-data-service/loan-data-service";

@IonicPage()
@Component({
    selector: 'page-data-collection',
    templateUrl: 'data-collection.html',
})
export class DataCollectionPage {

    private dataCollectionForm : FormGroup;

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
                public toastCtrl: ToastController,private userService : UserProvider,private loanDataService: LoanDataServiceProvider) {
        this.initDataCollectionForm();
    }

    ionViewDidLoad() {}

    initDataCollectionForm(){
        this.dataCollectionForm = this.formBuilder.group({
            existingLoans: ['', [Validators.required]],
            homeAddress: ['', [Validators.required]],
            monthlyCommitments:['']
        });
    }

    updateDataCollection(){
        if(this.dataCollectionForm.valid){
            let req = {
                'loanId' : this.userService.user.LoanId,
                'Mode' : AppConfig.LoanRequestUpdateModes.AdditionalDetailsUpdate,
                "ExistingLoanDetails": this.dataCollectionForm.value.existingLoans,
                "ExistingCommitments": this.dataCollectionForm.value.monthlyCommitments,
                "HomeAddress": this.dataCollectionForm.value.homeAddress
            };
            this.loanDataService.updateLoanRequest(req).then((response: any) => {
                if (response && response.ResponseStatusId==AppConfig.DefaultResponseStatuses.Success) {
                    this.userService.updateAuthResponseStatus("AuthStatusId",AppConfig.AuthStatuses.Success);
                    this.navCtrl.setRoot('HomePage');
                }
            });
        }else{
            this.presentToast('Please fill the required Fields');
        }
    }

    presentToast(message){
        const toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }

}
