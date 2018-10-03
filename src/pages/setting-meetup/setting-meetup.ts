import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common';

import { AppConfig, Config } from "../../config";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { LoanDataServiceProvider } from "../../providers/data-services/loan-data-service/loan-data-service";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";
import { UserProvider } from "../../providers/user/user";
import { ProfileDataServiceProvider } from "../../providers/data-services/profile-data-service/profile-data-service";

@IonicPage()
@Component({
    selector: 'page-setting-meetup',
    templateUrl: 'setting-meetup.html',
})
export class SettingMeetupPage {

    private signatureInfoForm : FormGroup;

    userAddresses:any = {};

    appConfig:any = AppConfig;
    addressKeys = Object.keys(this.appConfig.MEETING_ADDRESS);
    meetingTimeKeys = Object.keys(this.appConfig.MEETING_TIME_OPTIONS);

    minMeetDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    minMeetTime:String;
    maxMeetTime:String;

    selectedValue:"";

    meetingOccasions: Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
                private datePipe: DatePipe, private loanDataService : LoanDataServiceProvider, private profileDataService : ProfileDataServiceProvider,
                private publicFunctions : PublicFunctionsProvider, private userService : UserProvider) {
        this.initSignatureInfoForm();
    }

    ionViewDidLoad() {
        this.initLastLoanStatus();
        this.selectionLimiter();
    }

    initSignatureInfoForm(){
        this.initMinMaxTime(true);

        let meetTime = new Date();
        meetTime.setMinutes(new Date().getMinutes() + 15);

        this.signatureInfoForm = this.formBuilder.group({
            MeetingAddress: [this.appConfig.MEETING_ADDRESS[this.addressKeys[0]], [Validators.required]],
            MeetTimeOption: [this.appConfig.MEETING_TIME_OPTIONS[this.meetingTimeKeys[0]], Validators.required],
            MeetDate  : [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            MeetTime: [this.getISOTimeString(meetTime)]
        });

        this.signatureInfoForm.get('MeetDate').valueChanges.
        subscribe(meetDate => {
            let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            this.initMinMaxTime(today == meetDate);
        });
    }

    initMinMaxTime(isToday){
        if(!isToday){
            let  min = new Date();
            min.setHours(Config.MEETING_DURATION.MIN.H);
            min.setMinutes(Config.MEETING_DURATION.MIN.M);
            this.minMeetTime = this.getISOTimeString(min);

            let  max = new Date();
            max.setHours(Config.MEETING_DURATION.MAX.H);
            max.setMinutes(Config.MEETING_DURATION.MAX.M);
            this.maxMeetTime = this.getISOTimeString(max);
        }else{
            let  min = new Date();
            min.setHours(Number(this.datePipe.transform(new Date(), 'H')));
            min.setMinutes(Number(this.datePipe.transform(new Date(), 'm')));
            this.minMeetTime = this.getISOTimeString(min);

            let  max = new Date();
            max.setHours(Config.MEETING_DURATION.MAX.H);
            max.setMinutes(Config.MEETING_DURATION.MAX.M);
            this.maxMeetTime = this.getISOTimeString(max);
        }
    }

    initLastLoanStatus(){
        this.profileDataService.getAddressInfo().then((data)=>{
            if(data){
                this.userAddresses = data;
            }
        })
    }

    getISOTimeString(localDate){
        let min = localDate.getTime() / 1000 / 60; // convert gmt date to minutes
        let localNow = new Date().getTimezoneOffset(); // get the timezone
        let localTime = min - localNow; // get the local time
        let dateStr = new Date(localTime * 1000 * 60);
        return dateStr.toISOString();
    }

    setSignatureInfo(){
        let d = new Date(this.signatureInfoForm.value.MeetTime);
        let nd = new Date(d.getTime() - (3600000 * Config.timeOffset));
        this.signatureInfoForm.value.MeetDate = new Date(this.signatureInfoForm.value.MeetDate);
        this.signatureInfoForm.value.MeetDate.setHours(nd.getHours());
        this.signatureInfoForm.value.MeetDate.setMinutes(nd.getMinutes());
        if(this.signatureInfoForm.valid){
            let req = {
                'loanId' : this.userService.user.LoanId,
                // "MeetingAddress": this.signatureInfoForm.value.MeetingAddress.ID,
                "MeetTimeOption": this.selectedValue,
                // "MeetDateTime": this.signatureInfoForm.value.MeetTimeOption.ID == AppConfig.MEETING_TIME_OPTIONS.DATE_TIME.ID ? this.getISOTimeString(this.signatureInfoForm.value.MeetDate) : ''
            };
            this.loanDataService.submitSignatureInfo(req).then((data:any)=>{
                if(data){
                    if(data.ResponseStatusId == AppConfig.DefaultResponseStatuses.Success){
                        this.userService.updateAuthResponseStatus("AuthStatusId",AppConfig.AuthStatuses.Success);
                        this.navCtrl.setRoot('HomePage')
                    }else{
                        this.publicFunctions.getStatusMessageTranslations("DefaultResponseStatuses",data.ResponseStatusId).then((errorMessage : any) => {
                            this.signatureInfoForm.setErrors({"error_msg": errorMessage ? errorMessage : ""});
                        });
                    }
                }
            })
        }
    }

    selectionLimiter(){
        let now = new Date();
        Config.MEETING_OCCASIONS.forEach((occasion:any) => {
            if (!occasion.maxTime) {
                this.meetingOccasions.push(occasion);
            } else {
                let occasion_max_time = new Date();
                occasion_max_time.setHours(occasion.maxTime.hours);
                occasion_max_time.setMinutes(occasion.maxTime.minutes)
                if(now <= occasion_max_time) {
                    this.meetingOccasions.push(occasion)
                }
            }
        })
    }
}
