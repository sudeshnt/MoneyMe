import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from '@angular/common/http';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Firebase } from '@ionic-native/firebase';
import { Badge } from '@ionic-native/badge';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { BackgroundMode } from '@ionic-native/background-mode';

import { MyApp } from './app.component';

import { firebaseConfig } from './shared/config/firebase-config'
import { FcmProvider } from '../providers/fcm/fcm';
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {UserProvider} from "../providers/user/user";
import {ApiServiceProvider} from "../providers/api-service/api-service";
import {ProfileDataServiceProvider} from "../providers/data-services/profile-data-service/profile-data-service";
import {AuthDataServiceProvider} from "../providers/data-services/auth-data-service/auth-data-service";
import {LoanDataServiceProvider} from "../providers/data-services/loan-data-service/loan-data-service";
import {PublicDataServiceProvider} from "../providers/data-services/public-data-service/public-data-service";
import {NotificationDataServiceProvider} from "../providers/data-services/notification-data-service/notification-data-service";
import {PublicFunctionsProvider} from "../providers/public-functions/public-functions";
import {LocalDataServiceProvider} from "../providers/local-data-service/local-data-service";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig.fire),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    Firebase,
    FcmProvider,
    Badge,
    BackgroundMode,

    UserProvider,
    ApiServiceProvider,
    ProfileDataServiceProvider,
    AuthDataServiceProvider,
    LoanDataServiceProvider,
    PublicDataServiceProvider,
    NotificationDataServiceProvider,
    PublicFunctionsProvider,
    LocalDataServiceProvider

  ]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
