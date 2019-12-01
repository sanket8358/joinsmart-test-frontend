import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from './../../config/auth-constants';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  postData = {
    firstName:'',
    lastName:'',
    confirmPassword: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() { }

  validateInputs() {
    console.log(this.postData);
    let confirmPassword = this.postData.confirmPassword.trim();
    let password = this.postData.password.trim();
    let email = this.postData.email.trim();
    let firstName=this.postData.firstName.trim();
    let lastName=this.postData.lastName.trim();
    return (
      this.postData.confirmPassword &&
      this.postData.password &&
      this.postData.email &&
      this.postData.firstName && 
      this.postData.lastName &&
      confirmPassword.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      firstName.length >0 &&
      lastName.length > 0
    );
  }

  signupAction() {
    if (this.validateInputs()) {
      this.authService.signup(this.postData).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            // Storing the User data.
            this.storageService
              .store(AuthConstants.AUTH, res)
              .then(res => {
                this.toastService.presentToast('Successfully Registered!! Please Login');
                this.router.navigate(['login']);
              });
          } else {
            this.toastService.presentToast(
              'Data alreay exists, please enter new details.'
            );
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
}