import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonProvider } from '../../providers/common/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { settings } from '../../providers/common/config';
/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  providers:[
    InAppBrowser
  ]
})
export class SchedulePage {
  public doctorsCategory = [];
  public doctorsServices = [];
  public categoryServices = [];
  public doctorsTimeSlotData = [];
  date: any;
  daysInThisMonth: any;
  appointedInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  selectedDay;
  choosenCategoryService;
  appoinmentForm: FormGroup;
  public loading:any;
  selectedSlot;
  userId;
  tremsData = {isChecked: false};
  user;
  currentWalletBalance;
  username;
  userFullName;
  useremail;
  phone_number;
  submitted = false;
  weekdays = ["monday","tuesday","wednesday","thursday","triday","saturday", "sunday"]
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authProvider: AuthProvider,
    public common: CommonProvider,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public modalCtrl: ModalController,
    private iab: InAppBrowser
    ) {
      
    this.appoinmentForm = this.formBuilder.group({
      bk_category: ['', Validators.required],
      bk_service: ['', Validators.required],
      slot_date: ['', Validators.required],
      slot_time: ['', Validators.required],
      price: ['', Validators.required],
      subject: ['', Validators.required],
      username: ['', Validators.required],
      userphone: ['', Validators.required],
      useremail: ['', Validators.required],
      booking_note: [''],
      payment: ['local'],
      custom: [false],
      user_id: [''],
      data_id: [this.navParams.get('id')],
      wallet_value: [0]
    });
    this.presentLoadingCustom();
    this.authProvider.getDoctorsCategory(this.navParams.get('id')).subscribe(
      res => {
        this.storage.get('userId').then((userId) => {
          this.userId = userId;
          this.appoinmentForm.get('user_id').setValue(this.userId);
        });
        this.storage.get('user').then((user) => {
          this.user = user;
          if(this.user.data){

            this.storage.get('wallet').then((wallet) => {
              this.currentWalletBalance = wallet;
            });
            console.log(this.user.data.data.meta);
            // let userFullName = '';
            if(this.user.data.data.meta.full_name) {
              this.userFullName = this.user.data.data.meta.full_name[0];
              this.appoinmentForm.get('subject').setValue(this.userFullName);
            }

            if(this.user.data.data.meta.phone_number) {
              this.appoinmentForm.get('userphone').setValue(this.user.data.data.meta.phone_number[0]);
              this.phone_number = this.user.data.data.meta.phone_number[0];       
            }
            this.username = this.user.data.data.user_login;
            this.useremail = this.user.data.data.user_email;
            this.appoinmentForm.get('username').setValue(this.username);
            this.appoinmentForm.get('useremail').setValue(this.user.data.data.user_email);
            console.log("user",this.user)
               
          }
        });
        if(res.length > 0) {
          this.doctorsCategory = res;   
          this.authProvider.getDoctorsServices(this.navParams.get('id')).subscribe(
            res1 => {
              this.doctorsServices = res1;
              this.doctorTimeSlot(this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate())
            },
            err => {
              this.loading.dismiss();
              this.common.showPrompt('Error','Intenta de nuevo');
            }
          );
        } else{
          this.loading.dismiss();
          this.common.showPrompt('Error',res.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.common.showPrompt('Error','Intenta de nuevo');
      }
    );
    console.log('nava',this.navParams)
  }

  doctorTimeSlot(date) {
    this.authProvider.getDoctorsTimeSlot(this.navParams.get('id'), date).subscribe(
      res2 => {
        this.loading.dismiss();
        this.doctorsTimeSlotData = res2;
        // console.log(this.doctorsTimeSlotData)
        this.selectedSlot = '';
        let dateTosend = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
        this.getCurrentMonthData(dateTosend)
      },
      err => {
        console.log('Time Slot err', err)
        this.loading.dismiss();
        this.common.showPrompt('Error','Intenta de nuevo');
      }
    );
  }

  onSlotChoose(slot) {
    if(!slot.isSelected) {
      this.common.showPrompt('Error','No disponible');
    } else{
      this.selectedSlot = slot.key;
      this.appoinmentForm.get('slot_time').setValue(slot.key);
    }
  }

  changeCategory(event) {    
    this.categoryServices = this.doctorsServices.filter(function(el) {
      if(event == el.category){
        return el;
      }
    });
  }

  chooseService(event) {
    console.log('event', event)
    for (let index = 0; index < this.categoryServices.length; index++) {
      if(this.categoryServices[index].key == event) {
        this.appoinmentForm.get('price').setValue(this.categoryServices[index].price);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  ionViewWillEnter() {
    this.date = new Date();
    let currentDay = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate();
    this.appoinmentForm.get('slot_date').setValue(currentDay);
    this.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.getDaysOfMonth();
  }

  dismiss() {
		this.viewCtrl.dismiss();
  }

  getDaysOfMonth() {
    this.selectedDay = 0;
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }
  
    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }
  
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for ( i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i+1);
    }
  
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    for ( i = 0; i < (6-lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for( i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
    console.log('this.daysInThisMonth', this.daysInThisMonth)
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
    this.getCurrentMonthData(this.date)
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
    this.getCurrentMonthData(this.date)
  }

  getCurrentMonthData(date) {
    this.presentLoadingCustom();
    this.appointedInThisMonth = new Array();
    this.authProvider.getBookingSlotByMonth(
      {
        'user_id': this.navParams.get('id'),
        'year': date.getFullYear(),
        'month': date.getMonth()+1
      }
    ).subscribe(
      res2 => {
        this.loading.dismiss();
        let slot_month_data = res2['month_timesolts']
        console.log(res2['month_timesolts'])
        // let keysDate = Object.keys(res2['month_timesolts']);
        // detailsData
        let detailsData = this.navParams.get('detailsData')
        let _schedules = detailsData && detailsData.all && detailsData.all.schedules && detailsData.all.schedules || {}
        console.log('schedules',_schedules)
        for (const key in slot_month_data) {
          let info = {
              day:null,
              date: null,
              hasfree: false,
              hasappointment: false
            }
          if (Object.prototype.hasOwnProperty.call(slot_month_data, key)) {
            const element = slot_month_data[key];
            let date = new Date(key).getDay()

            // check if has time
            for (const _key in _schedules) {
              if (Object.prototype.hasOwnProperty.call(_schedules, _key)) {
                const _element = _schedules[_key];
                if (this.weekdays[date].startsWith(_key.split('_')[0]) && _element) {
                  info.hasappointment = true
                }else{
                  info.hasfree = false
                }
                
              }
            }
            // check free days
            info.date = key
            info.day = key.split('-')[2]
            for (const _infodata of element) {
              if (_infodata.isSelected && info.hasappointment) {
                info.hasfree = true
              }
            }
          }
          this.appointedInThisMonth.push(info)
        }
        console.log('month  ',this.appointedInThisMonth)
      },
      err => {
        this.loading.dismiss();
        this.common.showPrompt('Error','Intenta de nuevo');
      }
    );
  }

  checkHasApointment(date) {
    // console.log('date'+date)
    let classname='';
    if(this.appointedInThisMonth) {
      
      if(this.appointedInThisMonth[date-1]) {
        // console.log('incheck',this.appointedInThisMonth);
        let _apo = this.appointedInThisMonth[date-1]
        // console.log('apo', _apo)
        this.daysInThisMonth.indexOf(date)
        if (_apo.hasappointment) {
          classname = 'hasappointment';
          console.log(new Date().getDate()>date)
          if (new Date().getTime()<new Date(_apo.date).getTime()) {
            if (_apo.hasfree) {
              classname = 'freeappointment';
            } else {
              classname = 'notappointment';
            }
          }else{
            classname = 'hasappointment';
          }
          
        }else {
          classname = 'notappointment';
          if (new Date().getTime()<new Date(_apo.date).getTime()) {
          }else{
            classname = 'hasappointment';
          }
        }
      //   classname = 'hasappointment';
      // } else{
      //   classname = 'notappointment';
      // }
      }
    }
    if(this.currentDate == date){
      classname += ' currentDate';
    } else{.325478
      classname += ' otherDate';
    }
    return classname;
  }
  
  selectDate(day) {
    let d = new Date();
    let chosenMonth = this.date.getMonth()+1;
    console.log('chosenMonth', chosenMonth, 'd.getMonth()', (d.getMonth()+1))
    if(day >= d.getDate() && chosenMonth >= (d.getMonth()+1) && this.appointedInThisMonth[day-1].hasappointment) {
      this.selectedDay = day
      let selectedDayFormatted = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day;
      this.appoinmentForm.get('slot_date').setValue(selectedDayFormatted);
      this.presentLoadingCustom();
      this.doctorTimeSlot(selectedDayFormatted);
    } else{
      if(chosenMonth > (d.getMonth()+1) && this.appointedInThisMonth[day-1].hasappointment) {
        this.selectedDay = day
        let selectedDayFormatted = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day;
        this.appoinmentForm.get('slot_date').setValue(selectedDayFormatted);
        this.presentLoadingCustom();
        this.doctorTimeSlot(selectedDayFormatted);
      }
    }
  }

  onScheDule() {
    console.log('hi', this.doctorsCategory.length, this.appoinmentForm.valid)
    if(this.doctorsCategory.length == 0) {
      console.log('this.navCtrl', this.navCtrl)
      let prompt = this.alertCtrl.create({
        title: 'Error',
        message: 'No puedes agendar con este médico',
        cssClass:'fadeIn animated',
        buttons: [{
          text: 'Go to List',
          role: 'cancel',
          handler: () => {
            this.navCtrl.remove(2,1);
            this.navCtrl.pop(); 
          }
        }]
      });
      prompt.present();
      return false;
    }
    this.submitted = true;
    if(this.appoinmentForm.valid) {
      let profileModal = this.modalCtrl.create('PaymentTypePage', { currentWalletBalance: this.currentWalletBalance, totalAmount: this.appoinmentForm.value.price },{ cssClass: 'inset-modal' });
      profileModal.onDidDismiss(data => {
        //local', 'wallet', 'payu', 'wallet_payu'.
        if(data.dedutctAmount === undefined) {
          data.dedutctAmount = 0;
        }
        this.appoinmentForm.get('payment').setValue(data.paymentTypeChosen);
        this.appoinmentForm.get('wallet_value').setValue(data.dedutctAmount);
        let paymentProvidingData = {
          'user_id' : this.appoinmentForm.value.user_id,
          'bk_category' : this.appoinmentForm.value.bk_category,
          'bk_service' : this.appoinmentForm.value.bk_service,
          'slot_date' : this.appoinmentForm.value.slot_date,
          'slot_time' : this.appoinmentForm.value.slot_time,
          'subject' : this.appoinmentForm.value.subject,
          'username' : this.appoinmentForm.value.username,
          'userphone' : this.appoinmentForm.value.userphone,
          'useremail': this.appoinmentForm.value.useremail,
          'booking_note' : this.appoinmentForm.value.booking_note,
          'payment' : data.paymentTypeChosen,
          'data_id' : this.appoinmentForm.value.data_id,
          'price' : this.appoinmentForm.value.price,
          'wallet_value' : data.dedutctAmount,
        };

        if(data.paymentTypeChosen === 'wallet_payu' || data.paymentTypeChosen === 'payu' ){
          let paymentProvidingDataString = Object.keys(paymentProvidingData).map(key => key + '=' + paymentProvidingData[key]).join('&');
          console.log(settings.baseUrl+'/pago/?'+paymentProvidingDataString)
          const browser = this.iab.create(settings.baseUrl+'/pago/?'+paymentProvidingDataString, '_blank', 'location=no');
          browser.on('loadstop').subscribe(event => {
            if(event.url.includes(settings.baseUrl+'/sucess')) {
              browser.close();
              this.getWalletDetailsFetch();
              let prompt = this.alertCtrl.create({
                title: '¡Hecho!',
                message: 'Payment Success',
                cssClass:'fadeIn animated',
                buttons: [{
                  text: 'Ok',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.push('HomePage');
                  }
                }]
              });
              prompt.present();
            }
            if(event.url.includes(settings.baseUrl+'/failed')) {
              browser.close();
              let prompt = this.alertCtrl.create({
                title: 'Error',
                message: 'Payment Failed',
                cssClass:'fadeIn animated',
                buttons: ['Ok']
              });
              prompt.present();
            }
          });
        } else if(data.paymentTypeChosen === 'local' || data.paymentTypeChosen === 'wallet' ){
          this.presentLoadingCustom();
          this.authProvider.getDoctorsAppoinment(this.appoinmentForm.value).subscribe(
            res2 => {
              this.loading.dismiss();
              if(res2.type =='error') {
                let prompt = this.alertCtrl.create({
                  title: 'Error',
                  message: res2.message,
                  cssClass:'fadeIn animated',
                  buttons: ['Ok']
                });
                prompt.present();
              } else{
                this.getWalletDetailsFetch();
                let prompt = this.alertCtrl.create({
                  title: '¡Hecho!',
                  message: res2.message,
                  cssClass:'fadeIn animated',
                  buttons: [{
                    text: 'Ok',
                    role: 'cancel',
                    handler: () => {
                      this.navCtrl.push('HomePage');
                    }
                  }]
                });
                prompt.present();
              }
            },
            err => {
              this.loading.dismiss();
              this.common.showPrompt('Error','Intenta de nuevo');
            }
          );
        }
      });
      profileModal.present();
      
    } else{
      if(this.appoinmentForm.controls.slot_time.errors && this.appoinmentForm.controls.slot_time.errors.required) {
        this.common.showPrompt('Error','Selecciona la hora');
      }
    }
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

  datachanged(e:any){
    console.log(this.tremsData)
    if(this.tremsData.isChecked){
      this.appoinmentForm.get('subject').setValue('');
      this.appoinmentForm.get('username').setValue('');
      this.appoinmentForm.get('useremail').setValue(''); 
      this.appoinmentForm.get('userphone').setValue(''); 
    } else {
      this.appoinmentForm.get('subject').setValue(this.userFullName);
      this.appoinmentForm.get('username').setValue(this.username);
      this.appoinmentForm.get('useremail').setValue(this.useremail); 
      this.appoinmentForm.get('userphone').setValue(this.phone_number); 
    }
  }
  
}
