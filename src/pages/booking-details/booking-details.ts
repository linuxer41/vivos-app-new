import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonProvider } from '../../providers/common/common';
import { LoadingController,AlertController } from 'ionic-angular';

/**
 * Generated class for the BookingDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-details',
  templateUrl: 'booking-details.html',
})
export class BookingDetailsPage {
  public detailsData:any;
  public loading:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authProvider: AuthProvider,
    public common: CommonProvider,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.presentLoadingCustom();
    this.authProvider.getBookingDetails(this.navParams.get('id')).subscribe(
      res => {
        this.loading.dismiss();
        this.detailsData = res;    
      },
      err => {
        this.loading.dismiss();
        this.common.showPrompt('Error','Please try again');
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingDetailsPage');
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

  dismiss() {
		this.viewCtrl.dismiss();
  }
  

}
