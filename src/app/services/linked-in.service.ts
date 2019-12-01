import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';
declare var cordova: any;
@Injectable({
  providedIn: 'root'
})
export class LinkedInService {

  constructor(private http: HttpService, private platform: Platform, private toast: ToastService) { }
  linkedInLogin():any {
    console.log("in linked ");
    this.platform.ready().then(() => {
      this.loginInBrowser().then(success => {
        let headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        this.toast.presentToast(success.code);
        let body = "grant_type=authorization_code&code=" + success.code + "&redirect_uri=https://joinsmart.herokuapp.com/api/auth/callback&client_id=81sirvv927wpon&client_secret=t4OpCZ376aWqhOFe";
        this.http.postExternal("https://www.linkedin.com/oauth/v2/accessToken", body, headers)
          .subscribe((res: any) => {
            let result = JSON.parse(res);
            if (result["access_token"] !== undefined) {
              this.getLinkedInUserDetails(result["access_token"]).subscribe((res: any) => {
                this.toast.presentToast(JSON.stringify(res));
                return res;
              },
                (error: any) => {
                  this.toast.presentToast(JSON.stringify(error));
                });
            } else {
            }
          }, (err: any) => {
            this.toast.presentToast(JSON.stringify(err));
          });
      }, (error) => {
        this.toast.presentToast(JSON.stringify(error));
      });
    });
  }
  loginInBrowser(): Promise<any> {
    return new Promise(function (resolve, reject) {
      var uri = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81sirvv927wpon&" + "redirect_uri=https://joinsmart.herokuapp.com/api/auth/callback&scope=r_emailaddress%20r_liteprofile";
      var browserRef = cordova.InAppBrowser.open(uri);

      browserRef.addEventListener("loadstart", (event) => {
        if ((event.url).indexOf('joinsmart.herokuapp.com/api/auth/callback') >= 0) {
          browserRef.removeEventListener("exit", (event) => { });
          browserRef.close();
          var parsedResponse = {};
          var code = (event.url.split("=")[1]).split("&")[0];
          var state = event.url.split("=")[2];
          if (code !== undefined && state !== null) {
            parsedResponse["code"] = code;
            resolve(parsedResponse);
          } else {
            reject({'status':'failed'});
          }
        }
      });

    });
  }

  getLinkedInUserDetails(token: string) {
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    };
    return this.http.getExternal("https://api.linkedin.com/v2/me", headers);
  }
}
