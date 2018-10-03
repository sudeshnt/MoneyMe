import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from "@ngx-translate/core";

import { AppConfig } from "../../config";

/*
  Generated class for the PublicFunctionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PublicFunctionsProvider {

  constructor(public http: HttpClient , private translateService: TranslateService) { }

  public getKeyByValueFromObject(object,value){
      let found = false;
      for(let key in object){
        if(object[key]==value){
          found = true;
          return key;
        }
      }
      if(!found){
        return "";
      }
  }

  public getTranslation(key){
    let promise = new Promise((resolve, reject) => {
      this.translateService
        .get(key)
        .subscribe(
          translation => {
            resolve(translation);
        },err=> {
            reject('');
        });
    });
    return promise;
  }

  public getStatusMessageTranslations(statusType,statusId){
    let promise = new Promise((resolve, reject) => {
      let statusExtendKey = this.getKeyByValueFromObject(AppConfig[statusType],statusId);
      if(statusExtendKey!=""){
        this.getTranslation(statusType+"_"+statusExtendKey).then((errorMessage : any) => {
          resolve(errorMessage);
        });
      }
    });
    return promise;
  }


  public getExtension(fileName) {
    return fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
  }

  public getFileType(url) {
    let file:any = {};
    file.IsImageFile = false;
    file.DocumentIcon = 'fa-file-o';
    switch (this.getExtension(url)) {
      // Image Files
      case 'jpeg':
      case 'png':
      case 'jpg':
      case 'img':
      case 'bmp':
      case 'tiff':
      case 'ani':
      case 'cal':
      case 'fax':
      case 'jbg':
      case 'jpe':
      case 'mac':
      case 'pbm':
      case 'pcd':
      case 'pcx':
      case 'pct':
      case 'pgm':
      case 'ppm':
      case 'psd':
      case 'ras':
      case 'tga':
        file.IsImageFile = true;
        file.DocumentIcon = 'fa-file-image-o';
        break;
      // PDF Files
      case 'pdf':
        file.DocumentIcon = 'fa-file-pdf-o';
        break;
      // Word Files
      case 'doc':
      case 'dot':
      case 'wbk':
      case 'docx':
      case 'docm':
      case 'dotx':
      case 'dotm':
      case 'docb':
        file.DocumentIcon = 'fa-file-word-o';
        break;
      // Excel Files
      case 'xls':
      case 'csv':
      case 'xlt':
      case 'xlm':
      case 'xlsb':
      case 'xla':
      case 'xlam':
      case 'xll':
      case 'xlw':
        file.DocumentIcon = 'fa-file-excel-o';
        break;
      // PowerPoint Files
      case 'ppt':
      case 'pot':
      case 'pps':
      case 'pptx':
      case 'pptm':
      case 'potx':
      case 'potm':
      case 'ppam':
      case 'ppsx':
      case 'ppsm':
      case 'sldx':
      case 'sldm':
        file.DocumentIcon = 'fa-file-powerpoint-o';
        break;
      // Text File
      case 'txt':
        file.DocumentIcon = 'fa-file-text-o';
        break;
      // Zip/Archive File
      case 'zip':
      case 'zipx':
      case 'iso':
      case 'tar':
      case 'gz':
      case 'apk':
      case 'jar':
      case 'rar':
        file.DocumentIcon = 'fa-file-archive-o';
        break;
      // Audio Files
      case 'aac':
      case 'amr':
      case 'aiff':
      case 'm4a':
      case 'm4b':
      case 'mp3':
      case 'wav':
        file.DocumentIcon = 'fa-file-audio-o';
        break;
      // Video Files
      case 'webm':
      case 'mkv':
      case 'flv':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'mp4':
      case 'mpeg':
      case 'mpg':
      case '3gp':
      case 'm4v':
      case 'gif':
        file.DocumentIcon = 'fa-file-video-o';
        break;
      default:
        file.DocumentIcon = 'fa-file-o';
        break;
    }
    return file;
  }

}
