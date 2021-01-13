import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonProvider } from '../providers/common/common';
import { AuthProvider } from '../providers/auth/auth';
import {ProfilePage} from "../pages/profile/profile";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage:any;
  pages: Array<{title: string, icon: string,  component: any}>;
  isLogged:boolean;
  public loading:any;
  userDetails:any;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public storage: Storage,
    private loadingCtrl: LoadingController,
    public commonProvider: CommonProvider,
    public authProvider: AuthProvider,
  ) {

  

    // console.log(this.translate)
    // console.log(this.translate.instant("LOVE"))

    this.commonProvider.isLoggedIn().then(res=>{
      if(res) {
        this.storage.get('user').then((user) => {
          if(user !== null) {
            this.userDetails = user;
          }
        });
        this.isLogged = true;
        this.rootPage = HomePage;
        //this.rootPage = GoogleMapPage;
      } else{
        this.rootPage = WelcomePage
      }
    }, err=> {
      }
    );
    this.initializeApp();

    this.platform.ready().then(() => {
      // translate.setDefaultLang('ro');
      // translate.use('ro');
      events.subscribe('user:login', (login) => {
        if(login) {
          this.isLogged = true;
        } else{
          this.isLogged = false;
        }
      });

      events.subscribe('user:details', (details) => {
        if(details) {
          this.userDetails = details;
        }
      });
    });
    // set our app's pages
    this.pages = [
      { title: 'User profile',icon: 'person', component: 'ProfilePage' },
      { title: 'My appointments', icon: 'bookmark', component: 'MyBookingsPage' },
      { title: 'Home', icon: 'home', component: HomePage },
      // { title: 'Manage Articles', icon: 'infinite', component: HomePage },
      { title: 'Help', icon: 'ios-help', component: 'HelpPage' },
      { title: 'My favorites', icon: 'ios-heart', component: 'FavouritePage' },
      // { title: 'Schedules', icon: 'alarm', component: HomePage },
      // { title: 'Security Settings', icon: 'settings', component: HomePage },
      // { title: 'Privacy Settings', icon: 'lock', component: HomePage }
    ];


//     User profile:  Send file.psd
// My appointments: You have the .psd
// Logo: is home (search screen)
// Search:  Maybe we should change this for help – I send you the file.psd
// My favorites: You have the .psd

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.push(page.component);
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
              this.menu.toggle();
              setTimeout(()=> {
                this.isLogged = false;
                this.nav.setRoot(WelcomePage);
              }, 500);
            }
          },
          err => {
            this.commonProvider.showPrompt('Error','Please try again');
          }
        );
      }
    });
  }
}
