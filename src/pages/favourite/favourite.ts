import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the FavouritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html',
})
export class FavouritePage {
  public favorites = [];
  public loading:any;
  constructor(
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public common: CommonProvider,
    public authProvider: AuthProvider,
    public storage: Storage
    ) {
      this.getDirectotyTypeData()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavouritePage');
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

  getDirectotyTypeData() {
    this.presentLoadingCustom();
    this.storage.get('userId').then((userId) => {
      this.authProvider.getFavorites(userId).subscribe(

        res => {
          if(res.type !== "error") {
            this.favorites = res;
          }

          this.loading.dismiss();
        },
        err => {
          this.common.showPrompt('Error','Please try again');
          this.loading.dismiss();
        }
      );
      });

  }

  dismiss() {
		this.viewCtrl.dismiss();
  }

  deleteFavourite(index, id) {
    this.presentLoadingCustom();
    this.storage.get('userId').then((userId) => {
      this.authProvider.deleteFavorites({'user_id': userId,'favourite_id': id}).subscribe(
        res => {
          if(res.type !== "error") {
            this.storage.get('favourite').then((favourite)=>{
              let indexNo = favourite.indexOf(id);
              favourite[indexNo] == "-1";
              this.storage.set('favourite',favourite).then(()=>{
                console.log('here');
              });
            });
            this.favorites.splice(index, 1);
          }
          this.loading.dismiss();
        },
        err => {
          this.loading.dismiss();
          this.common.showPrompt('Error','Please try again');
        }
      );
      });
  }

  details(id) {
    this.navCtrl.push('DetailsPage', {id: id});
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');    
  }


}
