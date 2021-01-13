import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../../providers/common/common';
//import { TranslateService } from 'ng2-translate';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loadingIcon = "lock";
  clicked:boolean = false;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public storage: Storage,
    public events: Events,
    public common: CommonProvider,
  	) {
  	this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    // this language will be used as a fallback when a translation isn't found in the current language
    
  }

  ionViewDidLoad() {
    // console.log(this.translate)
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    console.log('ionViewDidLoad LoginPage');
  }

  onSignIn() {
    if(!this.clicked) {
      this.clicked = true;
      if(this.loginForm.status == "VALID") {
        this.authProvider.login({
          'username' : this.loginForm.value.username,
          'password' : this.loginForm.value.password
        }).subscribe(
          res => {
            if(res.type == 'success'){
              this.loadingIcon = "unlock";
              this.clicked = false;
              this.events.publish('user:login', true);
              this.storage.set('user',res).then(()=>{});
              this.storage.set('userId',res.data.ID).then(()=>{});
              if(res.data.data.meta.hasOwnProperty('_current_woo_wallet_balance')){
                this.storage.set('wallet',res.data.data.meta._current_woo_wallet_balance[0]).then(()=>{});
              } else{
                this.storage.set('wallet',0).then(()=>{});
              }
              
              this.events.publish('user:details', res);
              setTimeout(()=> {
                this.navCtrl.setRoot('HomePage');
              }, 500);
            } else {
            this.clicked = false;
            this.common.showPrompt('Error',res.message);
            }
          },
          err => {
            this.clicked = false;
            this.common.showPrompt('Error','Intenta de nuevo');
          }
        );
      } else{
        this.clicked = false;
        this.common.showPrompt('Error','Por favor ingresa correctamente la info');
      }
    }
  }
  onForgotPassword() {
    
  }

}
