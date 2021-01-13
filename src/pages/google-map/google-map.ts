import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the GoogleMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-google-map',
  templateUrl: 'google-map.html',
  providers:[Geolocation]
})
export class GoogleMapPage {
  @ViewChild("map") mapElement
  map: any;
  location:any;
  formdata: any;
  autocompleteService: any;
  places:any;
  GoogleAutocomplete;
  autocomplete;
  autocompleteItems;
  geocoder;
  markers;
  latitude;
  longitude;
  position;
  placesService: any;
  chosenAdress = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private geolocation: Geolocation,
    
  ) {
    this.latitude = navParams.get('formdata')
    this.longitude = navParams.get('formdata')
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      //this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      //});
    });
  }

  clearMarkers(){
    this.markers = [];
  }

  selectSearchResult(item){
    this.clearMarkers();
    //this.autocomplete.input = item.description;
    this.chosenAdress = item.description;
    this.autocompleteItems = [];
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        console.log('results[0]', results[0])
        this.position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
        };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      }
    })
  }
  
  ionViewDidLoad() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.9011, lng: -56.1645 },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      fullscreenControl: false
    });
    this.geolocation.getCurrentPosition().then((resp) => {
      this.position = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: this.position,
        map: this.map,
        title: 'I am here!'
      });
      this.markers.push(marker);
      this.map.setCenter(this.position);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  cancel() {
    this.viewCtrl.dismiss({'position' : this.position, 'location': ''});
  }
  ok() {
    this.viewCtrl.dismiss({'position' : this.position, 'location': this.chosenAdress});
  }

}
