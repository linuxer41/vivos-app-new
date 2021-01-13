import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,ValidatorFn,AbstractControl  } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../../providers/common/common';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: FormGroup;
  clicked:boolean = false;
  userType = [
    { title: 'Profesional', val: 'professional', isChecked: false, color: 'inputborder' },
    { title: 'Paciente', val: 'visitor', isChecked: true, color: 'inputborder' }
  ];
  tremsData = {isChecked: false};
  directorType:any;
  selectedType = 'visitor';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public storage: Storage,
    public common: CommonProvider
  ) {
      this.registerForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        directory_type: ['visitor', []],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required]],
        reTypePassword: ['', [Validators.required]],
        reTypeEmail: ['', [Validators.required, Validators.email,this.equalto('email')]],
        terms: ['', [Validators.requiredTrue]]
      }, {validator: this.matchingPasswords('password', 'reTypePassword')});
      this.getDirectotyTypeData()
  }
  
  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let input = control.value;
      let isValid=control.root.value[field_name]==input
      if(!isValid) 
      return { isValid }
      else 
      return null;
    };
  }

  matchingPasswords(passwordKey: string, reTypePasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[reTypePasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  onChangeType(event,val) {
    if(val.val =='visitor') {
      if(val.isChecked == true) {
        this.userType.filter((item, index)=>{
          if(item.val == 'professional') {
            item.isChecked = false;
          }
          return true;
        });

      } else{
        this.userType.filter((item, index)=>{
          if(item.val == 'professional') {
            item.isChecked = true;
          } 
          return true;
        });
      }
    } else{
      if(val.isChecked == true) {
        this.userType.filter((item, index)=>{
          if(item.val == 'visitor') {
            item.isChecked = false;
          }
          return true;
        });
      } else{
        this.userType.filter((item, index)=>{
          if(item.val == 'visitor') {
            item.isChecked = true;
          } 
          return true;
        });
      }
    }
    this.userType.filter((item, index)=>{
      if(item.isChecked == true) {
        this.selectedType = item.val
      }
    });
  }

  onSignUp() {
    let data = new FormData()
    if(!this.clicked) {
      let user_type:any;
      let terms:any;
      if(this.userType) {
        for (let i = 0; i < this.userType.length; i++) {
          if(this.userType[i].isChecked) {
            user_type = this.userType[i].val;
          }
        }
      }
      if(this.registerForm.value.terms) {
        terms = 1;
      } else{
        terms = 0;
      }
      this.clicked = true;
      
      if(user_type ==="professional") {
        if(this.registerForm.value.directory_type == ""){
          this.common.showPrompt('Error','Please Choose Category');
          this.clicked = false;
          return false;
        }
      }
      if(this.registerForm.status == "VALID") {
        data.append('user_type',user_type);
        data.append('directory_type',this.registerForm.value.directory_type);
        data.append('username',this.registerForm.value.username);
        data.append('email',this.registerForm.value.email);
        data.append('first_name',this.registerForm.value.firstName);
        data.append('last_name',this.registerForm.value.lastName);
        data.append('phone_number',this.registerForm.value.phone);
        data.append('password',this.registerForm.value.password);
        data.append('confirm_password',this.registerForm.value.reTypePassword);
        data.append('terms',terms);
        this.authProvider.register(data).subscribe(
          res => {
            this.clicked = false;
            if(res.type == 'success'){
              this.registerForm.reset();
              this.common.showPrompt('¡Hecho!',res.message);
              this.navCtrl.push('LoginPage');
            } else {
              this.common.showPrompt('Error',res.message);
            }
          },
          err => {
            this.clicked = false;
            this.common.showPrompt('Error','Intenta de nuevo');
          } 
        );
      } else{
        this.clicked = false;
        if(this.registerForm.errors != null && this.registerForm.errors.mismatchedPasswords) {
          this.common.showPrompt('Error','Las contraseñas no coinciden');
        } else if(this.registerForm.controls.email.errors != null && this.registerForm.controls.email.errors.email) {
          this.common.showPrompt('Error','Ingresa un E-mail válido');
        }  else if(this.registerForm.controls.reTypeEmail.errors != null) {
          if(this.registerForm.controls.reTypeEmail.errors.email) {
            this.common.showPrompt('Error','Invalid Confirm E-mail');
          } else if(this.registerForm.controls.reTypeEmail.errors.hasOwnProperty('isValid')) {
            this.common.showPrompt('Error','Confirm E-mail not match');
          }
        }  else if(this.registerForm.controls.terms.errors != null && this.registerForm.controls.terms.errors.required) {
          this.common.showPrompt('Error','Por favor lee y marca los términos');
        } else{
          this.common.showPrompt('Error','Por favor ingresa toda la info');
        }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  getDirectotyTypeData() {
    // this.common.showloader('Cargando');
    // this.authProvider.getDirectotyType().subscribe(
    //   res => {
    //     this.common.hide();
    //     this.directorType = res;
    //   },
    //   err => {
    //     this.common.hide();
    //     this.clicked = false;
    //     this.common.showPrompt('Error','Intenta de nuevo');
    //   }
    // );
  }
}
