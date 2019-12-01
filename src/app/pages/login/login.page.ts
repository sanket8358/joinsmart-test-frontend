import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { LinkedInService } from 'src/app/services/linked-in.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  postData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private linkedin:LinkedInService
  ) { }

  ngOnInit() { }

  validateInputs() {
    let email = this.postData.email.trim();
    let password = this.postData.password.trim();
    return (
      this.postData.email &&
      this.postData.password &&
      email.length > 0 &&
      password.length > 0
    );
  }

  loginAction() {
    if (this.validateInputs()) {
      this.authService.login(this.postData).subscribe(
        (res: any) => {
          if (res.email) {
            // Storing the User data.
            this.storageService.store(AuthConstants.AUTH, res);
            this.router.navigate(['home/feed']);
          } else {
            this.toastService.presentToast('Incorrect email or password.');
          }
        },
        (error: any) => {
          this.toastService.presentToast('Network Issue.');
        }
      );
    } else {
      this.toastService.presentToast(
        'Please enter email and password.'
        );
    }
  }

  linkedInLogin(){
    var data = this.linkedin.linkedInLogin();
    this.toastService.presentToast(JSON.parse(data));
    this.router.navigate(['home/feed']);
  }
}