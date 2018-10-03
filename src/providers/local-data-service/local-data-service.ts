import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from "@ionic/storage";

@Injectable()
export class LocalDataServiceProvider {

  constructor(public http: HttpClient ,private storage: Storage) {}

  setItem(reference, value){
    let promise = new Promise((resolve, reject) => {
      this.storage.set(reference, value)
        .then(
        data => {
          resolve(data)
        },
        error => {
          reject(error);
        }
      );
    });
    return promise;
  }

  getItem(reference){
    let promise = new Promise((resolve, reject) => {
      this.storage.get(reference)
        .then(
        data => {
          resolve(data)
        },
        error => {
          reject(error);
        }
      );
    });
    return promise;
  }

  remove(reference){
    let promise = new Promise((resolve, reject) => {
    this.storage.remove(reference)
      .then(
      data => {
        resolve(data)
      },
      error => {
        console.log('error :',error);
        reject(error);
      }
      );
    });
    return promise;
  }

  clear(){
    let promise = new Promise((resolve, reject) => {
      this.storage.clear()
        .then(
        data => {
          resolve(true)
        },
        error => {
          console.log('error :',error);
          reject(error);
        }
      );
    });
    return promise;
  }

  keys(){
    let promise = new Promise((resolve, reject) => {
      this.storage.keys()
        .then(
        data => {
          resolve(data)
        },
        error => {
          console.log('error :',error);
          reject(error);
        }
      );
    });
    return promise;
  }

}
