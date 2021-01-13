import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonProvider } from '../../providers/common/common';
import { LoadingController,AlertController } from 'ionic-angular';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  @ViewChild('slider') slider: Slides;
  public detailsData:any;
  public doctors
  public loading:any;
  shownGroup = null;
  isnotContactForm = true;
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
    this.authProvider.getDetails(this.navParams.get('id')).subscribe(
      res => {
        this.loading.dismiss();
        this.detailsData = res;    
        if(this.detailsData.all.privacy.contact_form === "on") {
          this.isnotContactForm = false;
          this.common.showPrompt('Contáctanos','Este profesional no tiene su agenda sincronizada en tiempo real. Para agendar, primero contactanos a través del formulario o Whatsapp para verificar las fechas disponibles. Una vez lo sepas, vuelve a hacer el agendamiento acá.');
        }
        if(res.directoty_type_slug === "clinica") {
          this.presentLoadingCustom();
          this.authProvider.getCategoryDoctors(res.id).subscribe(
            res1 => {
              this.loading.dismiss();
              this.doctors = res1;     

            },
            err => {
              this.loading.dismiss();
              this.common.showPrompt('Error','Please try again');
            }
          );
        }
      },
      err => {
        this.loading.dismiss();
        this.common.showPrompt('Error','Please try again');
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
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


  details(id) {
    this.navCtrl.push('DetailsPage', {id: id});
  }

  dismiss() {
		this.viewCtrl.dismiss();
  }
  
  onScheDule(id) {
    this.navCtrl.push('SchedulePage', {id: id});
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };

  isGroupShown(group) {
      return this.shownGroup === group;
  };

}
