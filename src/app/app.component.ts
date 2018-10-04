import {Component } from '@angular/core';
import {AlertController, App, Config, Events, ModalController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ToastController } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { Badge } from "@ionic-native/badge";
import { BackgroundMode } from '@ionic-native/background-mode';

import { FcmProvider } from "../providers/fcm/fcm";
import { TranslateService } from "@ngx-translate/core";
import {UserProvider} from "../providers/user/user";
import {AppConfig} from "../config";
import {LocalDataServiceProvider} from "../providers/local-data-service/local-data-service";
import {AuthDataServiceProvider} from "../providers/data-services/auth-data-service/auth-data-service";
import {PublicDataServiceProvider} from "../providers/data-services/public-data-service/public-data-service";
import {ProfileDataServiceProvider} from "../providers/data-services/profile-data-service/profile-data-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;
    currentLang:string = "";

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private fcm: FcmProvider, private toastCtrl: ToastController,
            private app: App, private translate: TranslateService, private userService : UserProvider, private localDataService : LocalDataServiceProvider,
            private config: Config, public modalCtrl: ModalController, public alertCtrl: AlertController, private badge :Badge, public events: Events,
            private authDataService : AuthDataServiceProvider, private publicDataService: PublicDataServiceProvider, private profileDataService: ProfileDataServiceProvider,
            private backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.initRoot(!platform.is('mobileweb'));
      this.initTranslate();
        this.onNavigationStart();
        if (platform.is('android')) {
            this.backgroundMode.setDefaults({ silent: true }).then((data) => {
                this.backgroundMode.enable();
            });
        }
    });
    this.initSystemTelephone();
    this.initPageNavigationEvent();
    this.initHttpErrorHandler();
    this.initLanguageChangeHandler();
  }

    initRoot(fcmInitRequired){
        this.userService.getLocalAuthResponse().then((user:any)=>{

            if(fcmInitRequired) this.initFCM();

            if(user && user.isAuthorized && user.AuthStatusId){
                switch (user.AuthStatusId){
                    case AppConfig.AuthStatuses.MobileValidationPending:
                        this.rootPage = 'PinVerificationPage';
                        break;
                    case AppConfig.AuthStatuses.InstitutionSelectionPending:
                        this.rootPage = 'BankSelectionPage';
                        break;
                    case AppConfig.AuthStatuses.LoanSignatureInfoPending:
                        this.rootPage = 'SettingMeetupPage';
                        break;
                    case AppConfig.AuthStatuses.Success:
                        this.rootPage = 'HomePage';
                        break;
                    default:
                        break;
                }
            }else{
                this.localDataService.getItem('APP_STAGE').then((app_stage)=>{
                    if(app_stage!=null){
                        if(app_stage["ID"] == AppConfig.APP_STAGES.FIRST_LOAN_CREATED.ID){
                            this.localDataService.getItem('FIRST_LOAN').then((first_loan)=>{
                                if(first_loan!=null){
                                    this.rootPage = 'FirstLoan_2Page';
                                }else{
                                    this.rootPage = 'FirstLoan_1Page';
                                }
                            });
                        }else if(app_stage["ID"] == AppConfig.APP_STAGES.REGISTRATION_SUCCESSFUL.ID){
                            this.rootPage = 'LoginPage';
                        }else{
                            this.rootPage = 'FirstLoan_1Page';
                        }
                    }else{
                        this.rootPage = 'FirstLoan_1Page';
                    }
                });
            }
        });
    }

    onNavigationStart(){
        // let public_pages = ['AboutUsPage','FaqPage','FirstLoan_1Page','FirstLoan_2Page','LanguagePage','LoginPage',
        //                     'RegisterPage','ForgotPasswordPage'];
        let ignored_pages = ['AlertCmp','ModalCmp','ActionSheetCmp','LoadingCmp','ToastCmp','PopoverCmp'];
        let private_pages = ['ChangePasswordPage','DocumentUploadPage','BankSelectionPage','HomePage','MyAccountPage',
            'MyLoansPage','NotificationsPage', 'PinVerificationPage','ReferAFriendPage','SettingMeetupPage'];
        let auth_restricted_pages = ['LoginPage','RegisterPage','ForgotPasswordPage'];
        let not_auth_restricted_pages = ['HomePage','MyLoansPage'];
        this.app.viewWillEnter.subscribe(viewCtrl => {
            this.userService.getLocalAuthResponse().then((user:any)=>{
                if(ignored_pages.indexOf(viewCtrl.component.name) === -1){
                    if(user && user.isAuthorized && user.AuthStatusId){
                        if(auth_restricted_pages.indexOf(viewCtrl.component.name) > -1){
                            this.rootPage = 'HomePage';
                        }else{
                            if(not_auth_restricted_pages.indexOf(viewCtrl.component.name) > -1){
                                switch (user.AuthStatusId){
                                    case AppConfig.AuthStatuses.MobileValidationPending:
                                        if(viewCtrl.component.name!='PinVerificationPage'){
                                            this.rootPage = 'PinVerificationPage';
                                        }
                                        break;
                                    case AppConfig.AuthStatuses.InstitutionSelectionPending:
                                        if( ['BankSelectionPage','DocumentUploadPage'].indexOf(viewCtrl.component.name) === -1 ){
                                            this.rootPage = 'BankSelectionPage';//BankSelectionPage DocumentUploadPendingPage
                                        }
                                        break;
                                    case AppConfig.AuthStatuses.LoanSignatureInfoPending:
                                        if(viewCtrl.component.name!='SettingMeetupPage'){
                                            this.rootPage = 'SettingMeetupPage';
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }else{
                        if(private_pages.indexOf(viewCtrl.component.name) > -1){
                            this.rootPage = 'LoginPage';
                        }
                    }
                }
            });
        })
    }

    initFCM() {
        // Get a FCM token
        this.fcm.getToken().then(token => {
            console.log(token);
            this.localDataService.getItem('DEVICE_TOKEN').then((local_token)=>{
                if(local_token!=null){
                    // if(token!=local_token){
                    this.serverDeviceRegistration(token);
                    // }
                }else{
                    this.serverDeviceRegistration(token);
                }
            });
        });
        // Listen to incoming messages
        this.fcm.listenToNotifications().pipe(
            tap(msg => {
                // show a toast
                // const toast = this.toastCtrl.create({
                //     message: msg.body,
                //     duration: 3000
                // });
                // toast.present();
                this.showAlert(msg.title ? msg.title : 'Notification received',msg.body);
            })
        ).subscribe()
    }

    serverDeviceRegistration(new_token){
        if(this.userService.user.isAuthorized){
            let req = {
                "DeviceRegNo": new_token
            };
            this.profileDataService.updateDeviceRegNo(req).then((data:any)=>{
                if(data){
                    if(data.ResponseStatusId == AppConfig.DefaultResponseStatuses.Success){
                        this.localDataService.setItem('DEVICE_TOKEN', new_token).then(
                            new_token => {
                                if(new_token){
                                    // console.log("token refreshed : ",new_token);
                                }
                            }
                        );
                    }
                }
            })
        }else{
            this.localDataService.setItem('DEVICE_TOKEN', new_token).then(
                new_token => {
                    if(new_token){
                        // console.log("token refreshed : ",new_token);
                    }
                }
            );
        }
    }

    initPageNavigationEvent(){
        this.events.subscribe('menu:clicked', (item) => {
            if(item){
                if(item == 'SignOut'){
                    this.signOut();
                }else{
                    this.rootPage = item;
                }
            }
        });
    }

    initTranslate(){
        this.translate.setDefaultLang('en');
        this.localDataService.getItem('LANG').then(
            lang => {
                if(lang!=null){
                    this.setLanguage(lang.toString());
                }else{
                    this.setLanguage('en');
                }
            }
        );
        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    }

    presentMenuModal() {
        let modal = this.modalCtrl.create('MenuPage',{} , {"cssClass" : 'pop-up-modal'});
        modal.onDidDismiss(data => {
            // console.log(data);
        });
        modal.present();
    }

    initHttpErrorHandler(){
        this.events.subscribe('http:error', (error) => {
            switch (error.status){
                case 401:
                    this.presentToast('user not authorized');
                    this.signOut();
                    break;
                case 500:
                    this.presentToast('Connection Error');
                    break;
                default:
                    break;
            }
        });
    }

    initLanguageChangeHandler(){
        this.events.subscribe('lang:changed', (lang) => {
            if(lang){
                this.setLanguage(lang);
            }
        });
    }

    setLanguage(lang){
        this.translate.use(lang);
        this.localDataService.setItem('LANG', lang).then(
            (lang:any) =>{
                this.currentLang = lang;
            }
        );
    }

    initSystemTelephone(){
        this.publicDataService.getSystemTelephone().then((data:any)=>{
            if(data){
                this.localDataService.setItem('SYSTEM_TELEPHONE',data);
            }
        })
    }

    signOut(){
        if(this.userService.user.isAuthorized){
            this.userService.removeLocalAuthResponse();

            this.authDataService.signOut().then((data)=>{
                this.clearBadges();
                this.rootPage = 'LoginPage';
            });
        }
    }

    async clearBadges(){
        try {
            let badge = await this.badge.clear();
            console.log(badge);
        }
        catch(e){
            console.error(e);
        }
    }

    showAlert(title,body) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: body,
            buttons: ['Ok']
        });

        alert.present();
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

}

