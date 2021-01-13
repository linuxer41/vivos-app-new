import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;
  clicked:boolean = false;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public storage: Storage,
    public common: CommonProvider
  	) {
  	this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  onSignIn() {
    if(!this.clicked) {
      this.clicked = true;
      if(this.forgotPasswordForm.status == "VALID") {
        this.authProvider.forgotPassword({
          'email' : this.forgotPasswordForm.value.email
        }).subscribe(
          res => {
            if(res.type == 'success'){
              this.clicked = false;
              this.common.showPrompt('Success',res.message);
              setTimeout(()=> {
                this.navCtrl.setRoot('HomePage');
              }, 2000);
            } else {
            this.clicked = false;
            this.common.showPrompt('Error',res.message);
            }
          },
          err => {
            this.clicked = false;
            this.common.showPrompt('Error','Please try again');
          }
        );
      } else{
        this.clicked = false;
        this.common.showPrompt('Error','Please check the field');
      }
    }
  }
  onForgotPassword() {
    
  }

}

