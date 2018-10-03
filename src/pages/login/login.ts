import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as sha1 from 'js-sha1';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

import { AppConfig } from "../../config";
import { AuthDataServiceProvider } from "../../providers/data-services/auth-data-service/auth-data-service";
import { UserProvider } from "../../providers/user/user";
import { PublicFunctionsProvider } from "../../providers/public-functions/public-functions";
import { LocalDataServiceProvider } from "../../providers/local-data-service/local-data-service";
import { ProfileDataServiceProvider } from "../../providers/data-services/profile-data-service/profile-data-service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    displayName: any;
    email: any;
    familyName: any;
    givenName: any;
    userId: any;
    imageUrl: any;

    public userProfile:any = null;

    appConfig = AppConfig;

    authOption: number = AppConfig.AUTH_OPTIONS.DEFAULT.ID;
    external_token:string = "";
    isLoggedIn:boolean = false;
    isRegisterEnabled:boolean = false;
    isLoginFormError:boolean = false;
    isLoginFormErrorMessage:string = "";
    private loginForm : FormGroup;

    loading:Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController, private authDataService : AuthDataServiceProvider,
              private userService : UserProvider, private publicFunctions : PublicFunctionsProvider, private profileDataService: ProfileDataServiceProvider,
              private localDataService : LocalDataServiceProvider) {
      if(navParams.get('isRegisterEnabled')){
          this.isRegisterEnabled = navParams.get('isRegisterEnabled')
      }
      this.initLoginForm();
  }

  ionViewDidLoad() {}

  initLoginForm(){
      this.loginForm = this.formBuilder.group({
          userName: ['', [Validators.required]],
          password: ['', [Validators.required]],
          ExternalToken: [''],
      });

      this.loginForm.valueChanges.subscribe(val => {
          this.isLoginFormError = false;
          this.isLoginFormErrorMessage = "";
      });
  }

  authenticateUser(){
      if(this.loginForm.valid){
          let req = {
              "ChannelId": AppConfig.CHANNELS.MOBILE.ID,
              "AuthOption": this.authOption,
              "ExternalToken": this.loginForm.value.ExternalToken,
              "UserName": this.loginForm.value.userName,
              "PasswordHash": sha1(this.loginForm.value.password)
          };
          this.authDataService.authenticateUser(req).then((data:any) => {
              let success_status = ["Success","MobileValidationPending","InstitutionSelectionPending","LoanSignatureInfoPending","AdditionalDetailsPending"],success_status_ids=[];
              for(let status of success_status) success_status_ids.push(AppConfig.AuthStatuses[status]);
              if(success_status_ids.indexOf(data.AuthStatusId) >-1 && data.SessionId && data.ClientId > 0){
                  this.serverDeviceRegistration();
                  data.AuthOption = this.authOption;
                  this.userService.setLocalAuthResponse(data);
                  switch (data.AuthStatusId){
                      case AppConfig.AuthStatuses.MobileValidationPending:
                          this.navCtrl.setRoot('PinVerificationPage');
                          break;
                      case AppConfig.AuthStatuses.InstitutionSelectionPending:
                          this.navCtrl.setRoot('BankSelectionPage');// DocumentUploadPendingPage
                          break;
                      case AppConfig.AuthStatuses.LoanSignatureInfoPending:
                          this.navCtrl.setRoot('SettingMeetupPage');
                          break;
                      case AppConfig.AuthStatuses.Success:
                          this.navCtrl.setRoot('HomePage');
                          break;
                      case AppConfig.AuthStatuses.AdditionalDetailsPending:
                          this.navCtrl.setRoot('DataCollectionPage');
                          break;
                      default:
                          break;
                  }
              }else{
                  this.authOption = AppConfig.AUTH_OPTIONS.DEFAULT.ID;
                  if(req.AuthOption!=AppConfig.AUTH_OPTIONS.DEFAULT.ID){
                      this.loginForm.get('userName').setValue('');
                      this.loginForm.get('password').setValue('');
                  }
                  this.publicFunctions.getStatusMessageTranslations("AuthStatuses",data.AuthStatusId).then((errorMessage : any) => {
                      // this.loginForm.setErrors({"error_msg": errorMessage ? errorMessage : ""});
                      this.isLoginFormError = true;
                      this.isLoginFormErrorMessage = errorMessage;
                  });
              }
          });
      }
  }

  serverDeviceRegistration(){
      this.localDataService.getItem('DEVICE_TOKEN').then(
          token => {
              if(token){
                  let req = {
                      "DeviceRegNo": token
                  };
                  this.profileDataService.updateDeviceRegNo(req).then((data:any)=>{
                      if(data){
                          if(data.ResponseStatusId == AppConfig.DefaultResponseStatuses.Success){
                              // console.log("token registered successfully!");
                          }
                      }
                  })
              }
          }
      );
  }


    socialLogin(auth_option) {
        this.showLoadingSpinner();
        this.afAuth.auth.signOut().then((data)=>{
            let provider;
            switch (auth_option){
                case 'G_PLUS':
                    provider = new firebase.auth.GoogleAuthProvider();
                    this.oauthSignIn(provider,AppConfig.AUTH_OPTIONS.G_PLUS.ID);
                    break;
                case 'FB':
                    provider = new firebase.auth.FacebookAuthProvider();
                    this.oauthSignIn(provider,AppConfig.AUTH_OPTIONS.FB.ID);
                    break;
                default:
                    break;
            }
        });
  }

  private oauthSignIn(provider: AuthProvider, auth_option) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
      .then(() => {
        return this.afAuth.auth.getRedirectResult().then( (res : any) => {
            this.hideLoadingSpinner();
            this.authOption = auth_option;
            if(res){
                if(res.user){
                    this.loginForm.setValue(
                        {
                            'userName' : res.additionalUserInfo.profile.id,
                            'password' : '--',
                            'ExternalToken' : res.credential.accessToken
                        }
                    );
                    this.authenticateUser();
                }
            }
        })
        .catch(() => {
            this.hideLoadingSpinner();
        });
      })
      .catch(() => {
          this.hideLoadingSpinner();
      });
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

  proceed(page){
      this.navCtrl.push(page);
  }

}
