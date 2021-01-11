import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  // Image
  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  imgLogo2 = 'assets/img/icons/MCMC_ModelBrand Info.png' 
  imgLogo3 = 'assets/img/icons/MCMC_IMEI.png'
  imgLogo4 = 'assets/img/icons/MCMC_Product Serial Num.png'
  imgLogo5 = 'assets/img/icons/MCMC_Self Labelling ID.png'
  test: Date = new Date();




  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  navigatePage(path: String) {
    if (path == 'login') {
      return this.router.navigate(['/auth/login'])
    }
    else  if (path == 'test') {
      return this.router.navigate(['/global/serial'])
    }
    else  if (path == 'productInfo') {
      return this.router.navigate(['/global/productInfo'])
    }
    else if (path == 'imei') {
      return this.router.navigate(['/global/emei'])
    }
    else if (path == 'label') {
      return this.router.navigate(['/global/label'])
    }
    else if ( path == 'faq') {
      return this.router.navigate(['/global/faq'])
    }
  }

  successMessage() {
    let title = 'Success'
    let message = 'Loging in right now'
    this.notifyService.openToastr(title, message)
  }

}

