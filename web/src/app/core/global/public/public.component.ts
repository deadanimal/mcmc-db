import { variableConfigureService } from 'src/app/shared/services/variableConfigure/variableConfigure.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { VisitorCounterService } from 'src/app/shared/services/VisitorCounter/VisitorCounter.service';
import { getMonth } from 'ngx-bootstrap';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  // Image
  imgLogo2 = 'assets/img/icons/MCMC_ModelBrand Info.png'
  imgLogo3 = 'assets/img/icons/MCMC_IMEI.png'
  imgLogo4 = 'assets/img/icons/MCMC_Product Serial Num.png'
  imgLogo5 = 'assets/img/icons/MCMC_Self Labelling ID.png'
  variableSLPTable: any
  variableProductTable: any
  variableIMEITable: any
  variableSerialTable: any
  test: number = new Date().getMonth() + 1;




  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router,
    // tslint:disable-next-line: no-shadowed-variable
    private VisitorCounterService: VisitorCounterService,
    private variableConfigureService: variableConfigureService,
  ) { }

  ngOnInit() {
    this.disableSearch()
    console.log(this.test)
    const counter = { Name:'visitor', Counter:this.test};
    console.log(counter)
    this.VisitorCounterService.post(counter).subscribe(
      (res) => {
        console.log('+1 Counter')
      },
      (error) => {
        console.error('err', error);
      }
    );
  }

  disableSearch(){
    let SLP_ID = '22476c26-cc1b-4770-86f8-87a631bc8c35'
    this.variableConfigureService.getOne(SLP_ID).subscribe(
      (res) => {
        this.variableSLPTable = [res]
        this.variableSLPTable = this.variableSLPTable[0]
        console.log("wewe", this.variableSLPTable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
    );
    let IMEI = '0ea9871b-ab66-4556-9ecb-ef68273cd460'
    this.variableConfigureService.getOne(IMEI).subscribe(
      (res) => {
        this.variableIMEITable = [res]
        this.variableIMEITable = this.variableIMEITable[0]
        console.log("wewe", this.variableIMEITable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
    );
    let Serial = '5a122e01-c6f3-494d-b5a3-3967480096df'
    this.variableConfigureService.getOne(Serial).subscribe(
      (res) => {
        this.variableSerialTable = [res]
        this.variableSerialTable = this.variableSerialTable[0]
        console.log("wewe", this.variableSerialTable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
    );
    let Product = 'd8991bb4-07be-4264-8dfb-3da69a4d2bf7'
    this.variableConfigureService.getOne(Product).subscribe(
      (res) => {
        this.variableProductTable = [res]
        this.variableProductTable = this.variableProductTable[0]
        console.log("wewe", this.variableProductTable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
    );
  }

  // tslint:disable-next-line: ban-types
  navigatePage(path: String) {
    if (path === 'login') {
      return this.router.navigate(['/auth/login'])
    }
    else  if (path === 'test') {
      return this.router.navigate(['/global/serial'])
    }
    else  if (path === 'productInfo') {
      return this.router.navigate(['/global/productInfo'])
    }
    else if (path === 'imei') {
      return this.router.navigate(['/global/emei'])
    }
    else if (path === 'label') {
      return this.router.navigate(['/global/label'])
    }
    else if ( path === 'faq') {
      return this.router.navigate(['/global/faq'])
    }
  }

  successMessage() {
    const title = 'Success'
    const message = 'Loging in right now'
    this.notifyService.openToastr(title, message)
  }

}

