import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  searchForm: FormGroup;
  localLength = 10;
  slug = "";
  title = "";
  minPrice = 60000;
  maxPrice = 180000;
  minPriceToShow = 40000;
  maxPriceToShow = 700000;
  step = 10000
  min_radius = 1
  max_radius = 200
  public loading:any;
  doctors = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public authProvider: AuthProvider,
    private formBuilder: FormBuilder,
    public common: CommonProvider,
    private loadingCtrl: LoadingController
  ) {
    this.searchForm = this.formBuilder.group({
      keyword: [''],
      radius_search: 10,
      pricerange: [{lower: 60000, upper: 180000}]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }

  updateResults() {
    this.localLength = this.searchForm.value.radius_search
  }

  updatePriceResults() {
    this.minPrice = this.searchForm.value.pricerange.lower;
    this.maxPrice = this.searchForm.value.pricerange.upper;
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

  onSearch() {
    console.log(this.searchForm)
    // event.preventDefault();
    // this.presentLoadingCustom();
    this.viewCtrl.dismiss({'form' : this.searchForm.value});
    // var queryString = Object.keys(this.searchForm.value).map(
    //   key => key + '=' + this.searchForm.value[key]
    // ).join('&');
    // let minMaxPrice = 'min_price='+this.searchForm.value.pricerange.lower+'&max_price='+this.searchForm.value.pricerange.upper
    // queryString = queryString.replace("pricerange=[object Object]", minMaxPrice);
    // console.log('queryString', queryString)
    // this.authProvider.searchDoctors(queryString).subscribe(
    //   res => {
    //     this.loading.dismiss();
    //     if(res.hasOwnProperty('type') && res.type === "error") {
    //       this.common.showPrompt('Error','No Data Found');
    //     } else{
    //       this.doctors = res;
    //     }
    //   },
    //   err => {
    //     this.common.showPrompt('Error','Intenta de nuevo');
    //     this.loading.dismiss();
    //   }
    // );
  }

    dismiss() {
        this.viewCtrl.dismiss({'form' : ''});
    }

  cancel() {
    this.viewCtrl.dismiss({'form' : ''});
  }
  // onSearch() {
  //   this.viewCtrl.dismiss({'position' : this.position, 'location': this.chosenAdress});
  // }

}
