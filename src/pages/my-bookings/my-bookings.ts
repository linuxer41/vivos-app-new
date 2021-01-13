import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the MyBookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-bookings',
  templateUrl: 'my-bookings.html',
})
export class MyBookingsPage {  
  public upcomingAppointments = [];
  public oldAppointments  = [];
  public loading:any;
  public getData = false;
  public userId;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public common: CommonProvider,
    private loadingCtrl: LoadingController,
    public authProvider: AuthProvider,
    public storage: Storage
    ) {
      this.getBookings();
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyBookingsPage');
  }

  getBookings() {
    this.presentLoadingCustom();
    this.storage.get('userId').then((userId) => {
      this.userId = userId;
      this.authProvider.getBookings(userId).subscribe(
        res => {
          this.getData = true;
          if(res.type !== "error") {
            this.getWalletDetailsFetch();
            for (let index = 0; index < res.length; index++) {
              if(res[index].upcomming_appointment == 1) {
                this.upcomingAppointments.push(res[index]);
              } else{
                this.oldAppointments.push(res[index]);
              }
            }
          }
          this.loading.dismiss();
        },
        err => {
          this.common.showPrompt('Error','Intenta de nuevo');
        }
      );
    });
  }
  

  dismiss() {
		this.viewCtrl.dismiss();
  }

  bookingDelete(details, i){
    this.presentLoadingCustom()
    this.authProvider.updateBooking({'user_id': this.userId, 'type': 'cancel','id' : details.id}).subscribe(
      res => {
        
        if(res.type !== "error") {
          this.upcomingAppointments.splice(i, 1);
          this.getWalletDetailsFetch();
        }        
        this.loading.dismiss();
      },
      err => {
        this.common.showPrompt('Error','Intenta de nuevo');
      }
    );
  }

  getWalletDetailsFetch(){
    this.authProvider.getWalletDetails(this.userId).subscribe(
      res => {
        this.storage.set('wallet',res.amount).then(()=>{});
      },
      err => {
        
      }
    );
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

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');    
  }


  bookingDetails(data) {
    this.navCtrl.push('BookingDetailsPage', {id: data.id});
  }


}
