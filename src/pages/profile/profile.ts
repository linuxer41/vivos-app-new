import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public loading:any;
  clicked:boolean = false;
  user;
  wallet = 0;
  submitted = false;
  resetPasswordForm: FormGroup;
  constructor(
    private loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public storage: Storage,
    public authProvider: AuthProvider,
    public common: CommonProvider
  ) {
  
    this.storage.get('user').then((user) => {
      this.user = user;
      ///this.user.data.data.meta.phone_number
    });
    this.storage.get('wallet').then((wallet) => {
      this.wallet = wallet;
    });
    
    this.resetPasswordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      retype: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  onUpdate() {
    if(!this.clicked) {
      this.clicked = true;
      if(this.resetPasswordForm.status == "VALID") {
        this.authProvider.reset({
          'old_password' : this.resetPasswordForm.value.old_password,
          'new_password' : this.resetPasswordForm.value.new_password,
          'confirm_password' : this.resetPasswordForm.value.retype,
          'user_id' : this.user.data.ID
        }).subscribe(
          res => {
            if(res.type == 'success'){
              this.clicked = false;
              this.resetPasswordForm.reset();
              this.common.showPrompt('Success',res.message);
            } else {
            this.clicked = false;
            this.common.showPrompt('Error',res.message);
            }
          },
          err => {
            this.clicked = false;
            this.common.showPrompt('Error','Error');
          }
        );
      } else{
        this.clicked = false;
        this.common.showPrompt('Error','Please Add password reset fields');
      }
    }
  }

  dismiss() {
		this.viewCtrl.dismiss();
  }

  presentLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      cssClass: 'my-loading-class',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box">
             <img src="assets/imgs/logo.gif" />
          </div>
        </div>`,
    });  
    this.loading.present();
  }

  logOut() {
    //this.commonProvider.showloader('Wait ...');
    this.presentLoadingCustom();
    this.storage.get('userId').then((userId) => {
      if(userId !== null) {
        this.authProvider.logOutFromServer(userId).subscribe(
          res => {
            this.loading.dismiss();
            if(res.type == 'success'){
              this.storage.clear();
              //this.menu.toggle();
              setTimeout(()=> {
                //this.isLogged = false;
                this.navCtrl.setRoot('WelcomePage');
              }, 500);
            }
          },
          err => {
            //this.commonProvider.showPrompt('Error','Please try again');
          }
        );
      }
    });
  }

}
