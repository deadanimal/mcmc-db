import { UsersService } from 'src/app/shared/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { JwtService } from 'src/app/shared/handler/jwt/jwt.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Image
  imgLogo = 'assets/img/logo/MCMC New Logo_Colour.png'

  // Form
  focusUsername
  focusPassword
  userData
  loginForm: FormGroup
  loginFormMessages = {
    'username': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email'}
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minLength', message: 'Password must have at least 8 characters' }
    ]
  }

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private usersService:UsersService,
    private router: Router,
    private jwtService: JwtService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ]))
    })
  }

  login() {
    this.loadingBar.start()
    this.jwtService.destroyToken()
    console.log(this.loginForm.value);
    this.authService.customLogin(this.loginForm.value).subscribe(
      (res) => {
        this.loadingBar.complete();
        this.successMessage();
        this.navigatePage("dashboard-admin");
        console.log("login data res",res)
      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
      },
      () => {
        this.usersService.getOne(this.authService.userID).subscribe(
          (res)=>{
            this.userData = res
            console.log('userdata',this.userData)
            const obj = {
              history_user:this.userData,
              history_type:'++'
            }
            console.log("test",obj)
            this.usersService.postlogin(obj).subscribe(
              (data) => {
                console.log(data)
              },
              (err) => {
                console.log("err", err)
              },
            )
          }
        )
        // setTimeout(()=>{
        //   this.sendLoginLog()
        // }, 1000);
      }

    )
    // if (this.loginForm.value.username == 'admin') {
    //   this.authService.userRole = 1
    //   this.navigatePage('dashboard-admin')
    // }
    // else if (this.loginForm.value.username == 'user') {
    //   this.authService.userRole = 2
    //   this.navigatePage('dashboard-user')
    // }
  }

  // sendLoginLog(){
  //   console.log("userdata", this.userData)
  //   const obj = {
  //     history_user_id:{username:this.userData},
  //     history_type:'++'
  //   }
  //   console.log("test",obj)
  //   this.usersService.postlogin(obj).subscribe(
  //     (res) => {
  //       console.log('',res)
  //     },
  //     (err) => {
  //       console.log("err", err)
  //     },
  //   )
  // }

  navigatePage(path: String) {
    if (path == 'login') {
      return this.router.navigate(['/auth/login'])
    }
    else  if (path == 'forgot') {
      return this.router.navigate(['/auth/forgot'])
    }
    else  if (path == 'register') {
      return this.router.navigate(['/auth/register'])
    }
    else if (path == 'dashboard-admin') {
      return this.router.navigate(['/admin/dashboard'])
    }
    else if (path == 'dashboard-user') {
      return this.router.navigate(['/user/dashboard'])
    }
  }

  successMessage() {
    let title = 'Success'
    let message = 'Logging in...'
    this.notifyService.openToastr(title, message)
  }


  errorMessage() {
    let title = 'Error'
    let message = 'Cant Logging in'
    this.notifyService.openToastrHttp(title, message)
  }
}
