import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../common/common';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  apiUrl:any;
  headers:any;
  constructor(
    public HttpClient: HttpClient,
    public http: Http, 
    public common:CommonProvider,
    public storage: Storage
  ) {
    this.apiUrl = common.apiUrl;
    this.headers = common.headers;
  }

  login(post): Observable<any> {
    const url = this.apiUrl + 'user/do_login';
    return this.http
      .post(url, post,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  reset(post): Observable<any> {
    const url = this.apiUrl + 'user/reset-password';
    return this.http
      .post(url, post,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  forgotPassword(post): Observable<any> {
    const url = this.apiUrl + 'user/forgot_password';
    return this.http
      .post(url, post,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  register(post): Observable<any> {
    console.log(this.headers)
    const url = this.apiUrl + 'user/do_signup';
    return this.http
      .post(url, post,{ headers: this.common.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  deleteFavorites(post): Observable<any> {
    console.log(this.headers)
    const url = this.apiUrl + 'listing/remove_favorite';
    return this.http
      .post(url, post,{ headers: this.common.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getDirectotyType(): Observable<any> {
    const url = this.apiUrl + 'post_type/get_categories';
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getFavorites(user_id): Observable<any> {
    const url = this.apiUrl + 'listing/get_listings?listing_type=favorites&user_id='+user_id;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getBookings(user_id): Observable<any> {
    const url = this.apiUrl + 'booking_schedule/my_appointment?user_id='+user_id;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  updateBooking(data): Observable<any> {
    const url = this.apiUrl + 'booking_schedule/change_appointment_status';
    return this.http
      .post(url,data,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getBookingDetails(booking_id): Observable<any> {
    const url = this.apiUrl + 'booking_schedule/appointment-details?appointment_id='+booking_id;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }


  getTypeCategory(id): Observable<any> {
    const url = this.apiUrl + 'listing/get_listings?listing_type=category_providers&page_number=1&id='+id;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  searchDoctors(params): Observable<any> {
    const url = this.apiUrl + 'listing/get_listings?listing_type=search&'+params;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  logOutFromServer(userId): Observable<any> {
    const url = this.apiUrl + 'user/do_logout';
    return this.http
      .post(url,{user_id: userId},{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  addFavourite(data): Observable<any> {
    const url = this.apiUrl + 'wishlist/user_wishlist';
    return this.http
      .post(url,data,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getDoctorsAppoinment(fromData): Observable<any> {
    const url = this.apiUrl + 'booking_schedule/appointment';
    return this.http
      .post(url,fromData,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }


  getPaymentType(): Observable<any> {
    const url = this.apiUrl + 'payment_method/payment_list';
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }
  
  getBookingSlotByMonth(data): Observable<any> {
    const url = this.apiUrl + 'booking_schedule/get_timeslots_month?user_id='+data.user_id+'&year='+data.year+'&month='+data.month;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getDetails(userId) :Observable<any> {
    const url = this.apiUrl + 'listing/get_listings?listing_type=profile_data&user_id='+userId;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  
  getCategoryDoctors(id) :Observable<any> {
    const url = this.apiUrl + 'listing/get_listings?listing_type=teams&id='+id;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getDoctorsCategory(userId) :Observable<any> {
    const url = this.apiUrl + 'booking_schedule/provider_category_list?data_id='+userId;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }


  getWalletDetails(userId) :Observable<any> {
    const url = this.apiUrl + 'wallet/details?user_id='+userId;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getDoctorsServices(userId) :Observable<any> {
    const url = this.apiUrl + 'booking_schedule/provider_services_list?data_id='+userId;
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getDoctorsTimeSlot(userId, date) :Observable<any> {
    const url = this.apiUrl + 'booking_schedule/get_timeslots?user_id='+userId+'&slot_date='+date;
    console.log(url)
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

  getDoctorsTimeSlotMonth(userId, year, month) :Observable<any> {
    const url = this.apiUrl + 'booking_schedule/get_timeslots_month?user_id='+userId+'&year='+year+'&month='+month;
    console.log(url)
    return this.http
      .get(url,{ headers: this.headers })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err;
        }
      )
  }

    getCountries(): Observable<any> {
        const url = this.apiUrl + 'get/provider.php';
        return this.http
            .get(url, {headers: this.headers})
            .map(
                res => {
                    return res.json();
                },
                err => {
                    return err;
                }
            )
    }

    getCities(): Observable<any> {
        const url = this.apiUrl + 'listing/get_listings?listing_type=get_cities';
        return this.http
            .get(url, {headers: this.headers})
            .map(
                res => {
                    return res.json();
                },
                err => {
                    return err;
                }
            )
    }

}
