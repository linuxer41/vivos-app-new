import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoadingController,AlertController } from 'ionic-angular';

/**
 * Generated class for the PaymentTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-type',
  templateUrl: 'payment-type.html',
})
export class PaymentTypePage {
  currentWalletBalance = 0;
  totalAmount = 0;
  paymentTypes;
  paymentTypeChosen = '';
  dedutctAmount;
  loading:any;
  submit = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    public viewCtrl: ViewController
  ) {
    this.currentWalletBalance = parseInt(navParams.get('currentWalletBalance'));
    this.totalAmount = parseInt(navParams.get('totalAmount'));
    console.log(this.currentWalletBalance);
    this.presentLoadingCustom();
    this.authProvider.getPaymentType().subscribe(
        resp => {
          this.loading.dismiss();
          this.paymentTypes = [];
          // public form = [
          //   { val: 'Pepperoni', isChecked: true },
          //   { val: 'Sausage', isChecked: false },
          //   { val: 'Mushroom', isChecked: false }
          // ];
          resp.forEach(element => {
            var isChecked = false;
            var disabled = false;
            if(this.currentWalletBalance == 0) {
              disabled = true;
            }
            if(element.payment === 'local') {
              isChecked = true;
            }
            let combineData = {
              val:element.payment_title,
              value:element.payment,
              isChecked: isChecked,
              disabled: disabled
            }
            this.paymentTypes.push(combineData)
          });
        }, errorData => {
          this.loading.dismiss();
        }
      );
  }

  toggleSelected(selsected) {
    this.paymentTypes.forEach((element, index) => {
      this.paymentTypeChosen = selsected.value;
      if(element.value === selsected.value) {
        this.paymentTypes[index].isChecked = true;
      } else{
        this.paymentTypes[index].isChecked = false;
      }
    });
  }

  checkValue(event) {
    if(event.value > this.currentWalletBalance) {
      this.dedutctAmount = 0;
    }
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

  cancel() {
    this.viewCtrl.dismiss({paymentTypeChosen: '', dedutctAmount: undefined});
  }
  pay() {
    this.submit = true;
    if(this.paymentTypeChosen === "wallet" && !this.dedutctAmount) {
      return false;  
    }

    if(this.paymentTypeChosen === "wallet" && this.dedutctAmount > 0) {
      let sumAmount = this.totalAmount - parseInt(this.dedutctAmount);
      if(sumAmount > 0) {
        this.paymentTypeChosen = 'wallet_payu';
      }
    }

    if(this.paymentTypeChosen === 'payu') {
      this.dedutctAmount = 0;
    }

    this.viewCtrl.dismiss({paymentTypeChosen: this.paymentTypeChosen, dedutctAmount: this.dedutctAmount});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentTypePage');
  }

}
