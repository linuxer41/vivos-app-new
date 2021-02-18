import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, ModalController, Content } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonProvider } from '../../providers/common/common';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeAudio } from '@ionic-native/native-audio';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[Geolocation, NativeAudio]
})
export class HomePage {
  pageTitle = 'Home';
  @ViewChild(Content) contentArea: Content;
  searchForm: FormGroup;
  categories:any;
  setdage;
  subCategories = [];
  typeCategories = [];
  cities = [];
  choosenCategoryId:any;
  doctors = [];
  count : number = 0;
  localLength = 10;
  slug = "";
  title = "";
  minPrice = 1;
  maxPrice = 999999;
  favourites = [];
    autocompleteService: any;
    places:any;
    GoogleAutocomplete;
    autocomplete;
    autocompleteItems;
    chosenAdress = '';
  public userName:any;
  public loading:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public common: CommonProvider,
    public events: Events,
    public viewCtrl: ViewController,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public modalCtrl: ModalController,
    private nativeAudio: NativeAudio,
    ) {
      this.minPrice = 1;
      this.searchForm = this.formBuilder.group({
      keyword: [''],
      directory_type: [this.choosenCategoryId],
      speciality: [''],
      city: [''],
      geo_location: [''],
      geo_distance: [10],
      radius_search: [10],
      current_longitude: [''],
      current_latitude: [''],
      current_location: [''],
      latitude: [''],
      longitude:[''],
      pricerange: [{lower: 1, upper: 999999}]
    });
    this.nativeAudio.preloadSimple('uniqueId1', 'assets/file-sound.mp3').then((success)=>{
      console.log("Sound success");
    },(error)=>{
      console.log("Sound error",error);
    });
      this.getDirectotyTypeData();
      // this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      // this.autocomplete = { input: '' };
      // this.autocompleteItems = [];
      this.loadFavourite();
      this.getCities()
      this.getCountries();
  }

    updateSearchResults(){
      console.log("need update")
        // if (this.autocomplete.input == '') {
        //     this.autocompleteItems = [];
        //     return;
        // }
        // this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
        //     (predictions, status) => {
        //         this.autocompleteItems = [];
        //         //this.zone.run(() => {
        //         predictions.forEach((prediction) => {
        //             this.autocompleteItems.push(prediction);
        //         });
        //         //});
        //     });
    }

    getCountries(){
        // this.authProvider.getCountries().subscribe(
        //     res2 => {
        //         this.loading.dismiss();
        //         console.log(res2);
        //     },
        //     err => {
        //         console.log('Time Slot err', err)
        //         this.loading.dismiss();
        //         this.common.showPrompt('Error','Intenta de nuevo');
        //     }
        // );
    }
    getCities(){
        this.authProvider.getCities().subscribe(
            res => {
                // this.loading.dismiss();
                this.cities = res
                console.log(res);
            },
            err => {
                console.log('Time Slot err', err)
                this.loading.dismiss();
                this.common.showPrompt('Error','Intenta de nuevo');
            }
        );
    }


    selectSearchResult(item){
        this.autocomplete.input = item.description;
        this.chosenAdress = item.description;
        this.autocompleteItems = [];
    }

  // ionViewDidEnter() {
  //   this.loadFavourite();
  // }

  updateResults() {
    this.localLength = this.searchForm.value.geo_distance
  }

  updatePriceResults() {
    this.minPrice = this.searchForm.value.pricerange.lower;
    this.maxPrice = this.searchForm.value.pricerange.upper;
  }


  loadFavourite() {
    this.storage.get('userId').then((userId) => {
      this.authProvider.getFavorites(userId).subscribe(
        res => {
          this.favourites = [];
          if(res.type !== "error") {
            for (let index = 0; index < res.length; index++) {
              this.favourites.push(res[index].id);
            }
            this.storage.set('favourite',this.favourites).then(()=>{});
          } else{
            this.storage.set('favourite',[]).then(()=>{});
          }
        },
        err => {
          this.common.showPrompt('Error','Please try again');
        }
      );
    });
  }

  ionViewDidLoad() {
    this.onChange()
    console.log('ionViewDidLoad HomePage');
    this.storage.get('user').then((user) => {
      this.userName = user;
      if(user.data){
        if(user.data.data.meta.first_name){
          this.userName = user.data.data.meta.first_name;
        } else{
          this.userName = user.data.data.display_name;
        }
      }
    });
    this.events.subscribe('user:details', (details) => {
      console.log('here In Home', details)
      if(details) {
        if(details.data.data.meta.first_name){
          this.userName = details.data.data.meta.first_name;
        } else{
          this.userName = details.data.data.display_name;
        }
      }
    });


    // let profileModal = this.modalCtrl.create('PaymentTypePage', { currentWalletBalance: 2324, totalAmount: 234 },{ cssClass: 'inset-modal' });
    // profileModal.present();

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
    this.authProvider.getDirectotyType().subscribe(
      res => {
        this.loading.dismiss();
        this.categories = res;
        if(res) {
          this.itemTapped(res[0].id, res[0].slug, res[0].title, false);
        }
      },
      err => {
        this.loading.dismiss();
        this.common.showPrompt('Error','Intenta de nuevo');
      }
    );
  }

  onChange() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.searchForm.get('latitude').setValue(resp.coords.latitude);
      this.searchForm.get('longitude').setValue(resp.coords.longitude);
      this.searchForm.get('current_latitude').setValue(resp.coords.latitude);
      this.searchForm.get('current_longitude').setValue(resp.coords.longitude);
      // this.searchForm.get('current_location').setValue("ok");
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  onCategorySelect(){
    this.scrollTo("city")
    // document.getElementById('input_city').scrollIntoView();
  }

  itemTapped(categoryId, slug, title, isScroll) {
    if(categoryId) {
      this.slug = slug;
      this.title = title;
      this.searchForm.get('directory_type').setValue(categoryId);
      this.searchForm.get('speciality').setValue('');
      this.choosenCategoryId = categoryId;
      this.categories.filter((item, index)=>{
        if(item.id == categoryId) {
          this.subCategories = item.specialities
        }
        if(isScroll) {
          this.scrollTo('speciality')
          setTimeout(function(){
            document.getElementById('input_speciality').click();
          }, 700);
        }
      });
    }
  }

  scrollTo(element:string) {
    let yOffset = document.getElementById(element).offsetTop;
    console.log('yOffset', yOffset)
    this.contentArea.scrollTo(0, yOffset, 3000)
  }

  onSearch() {
      this.autocompleteItems = [];
    if(this.searchForm.controls.keyword.value || this.searchForm.controls.directory_type.value || this.searchForm.controls.speciality.value) {
    //if(this.searchForm.controls.directory_type.value || this.searchForm.controls.speciality.value) {
      console.log(this.searchForm)
      this.presentLoadingCustom();
      var queryString = Object.keys(this.searchForm.value).map(
        key => key + '=' + this.searchForm.value[key]
      ).join('&');
      let minMaxPrice = 'min_price='+this.searchForm.value.pricerange.lower+'&max_price='+this.searchForm.value.pricerange.upper
      queryString = queryString.replace("pricerange=[object Object]", minMaxPrice);
      this.authProvider.searchDoctors(queryString).subscribe(
        res => {
          this.loading.dismiss();
          if(res.hasOwnProperty('type') && res.type === "error") {
            this.common.showPrompt('Error','No Data Found');
          } else{
            this.doctors = res;
          }
        },
        err => {
          this.common.showPrompt('Error','Intenta de nuevo');
          this.loading.dismiss();
        }
      );
    } else{
      this.common.showPrompt('Error','Selecciona un criterio de búsqueda');
    }
  }

  details(id) {
    this.navCtrl.push('DetailsPage', {id: id});
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    setTimeout(() => {

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  dismiss() {
    this.doctors.length = 0;
  }

  checkSelected(id) {
    if(this.favourites.length > 0) {
      if(this.favourites.indexOf(id) >= 0) {
        return true;
      }
    }
  }

  setfavouriteDoubleTap(id) {
    this.count ++;
    setTimeout(() => {
      if (this.count == 1) {
        this.count = 0;
      }if(this.count > 1){
        if(!this.checkSelected(id)) {
          this.count = 0;
          this.storage.get('userId').then((userId) => {
            this.authProvider.addFavourite({'user_id': userId,'wl_id': id}).subscribe(
              res => {
                this.favourites.push(id);
                this.storage.set('favourite',this.favourites).then(()=>{});
                this.nativeAudio.play('uniqueId1').then((success)=>{
                },(error)=>{

                });
              },
              err => {
              }
            );
          });
        }
      }
    }, 250);
  }

  setfavourite(id) {
    if(!this.checkSelected(id)) {
      this.storage.get('userId').then((userId) => {
        this.presentLoadingCustom();
        this.authProvider.addFavourite({'user_id': userId,'wl_id': id}).subscribe(
          res => {
            this.favourites.push(id);
            this.storage.set('favourite',this.favourites).then(()=>{});
            this.nativeAudio.play('uniqueId1').then((success)=>{
            },(error)=>{

            });
            this.loading.dismiss();
          },
          err => {
            this.loading.dismiss();
          }
        );
      });
    }
  }

  openMap() {
    let profileModal = this.modalCtrl.create('GoogleMapPage', {'latitude' : this.searchForm.value.longitude,'longitude' : this.searchForm.value.latitude},{ cssClass: 'inset-modal' });
    profileModal.onDidDismiss(data => {
      if(data.location !== "") {
        this.searchForm.get('latitude').setValue(data.position.lat);
        this.searchForm.get('longitude').setValue(data.position.lng);
        this.searchForm.get('geo_location').setValue(data.location);
        this.searchForm.get('current_longitude').setValue(data.position.lat);
        this.searchForm.get('current_latitude').setValue(data.position.lng);
      }
    });
    profileModal.present();
  }
  openFilter() {
    let profileModal = this.modalCtrl.create('FilterPage', {},{ cssClass: 'inset-modal' });
    profileModal.onDidDismiss(data => {
      if(data.form !== "") {
        console.log(data)
        this.searchForm.get('city').setValue('')
        this.searchForm.get('radius_search').setValue(data.form.radius_search);
        // this.searchForm.get('radius_search').setValue(1000000);
        this.searchForm.get('current_location').setValue("ok");
        this.searchForm.get('keyword').setValue(data.form.keyword);
        this.searchForm.get('pricerange').setValue(data.form.pricerange);
        console.log('this.searchForm', this.searchForm)
        this.onSearch()
        this.searchForm.get('current_location').setValue("ko"); // reset current location
      }
    });
    profileModal.present();
  }
}