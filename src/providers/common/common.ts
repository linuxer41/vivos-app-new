import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController,AlertController } from 'ionic-angular';
/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonProvider {
  //public apiUrl:string='http://192.168.0.4/wp/vivos/wp-json/api/v1/'; //local
  public apiUrl:string='http://masvivos.com/vivos/wp-json/api/v1/'; //live  
  public headers:any;
  public loading:any;
  constructor(
    public storage: Storage,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController
    ) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }
  isLoggedIn() {
    console.log('here', this.storage.get('userId'))
    return this.storage.get('userId').then((user) => {
      console.log('userId', user)
      if(user !== null) {
        console.log('inside',user)
        return true;
      } else{
        return false;
      }
    });
  }
  show() {
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 3000
    });
    this.loading.present();
  }
  showmsg(msg) {
    this.loading = this.loadingCtrl.create({
        content: msg,
        duration: 3000
    });
    this.loading.present();
  }
  showloaderOld(msg) {
    this.loading = this.loadingCtrl.create({
        content: msg,
        duration: 3000
    });
    this.loading.present();
  }
  showloader(msg) {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      cssClass: 'my-loading-class',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box">
             <img src="http://192.168.0.4/designs/APP/Vivos/11.03.20/logo.gif" />
          </div>
        </div>`,
    });
    this.loading.present();
  }
  hide() {
    this.loading.dismiss();
  }
    showPrompt( title, msg ) {
    let prompt = this.alertCtrl.create({
      title: title,
      message: msg,
      cssClass:'fadeIn animated',
      buttons: ['OK']
    });
    prompt.present();
  }
}
