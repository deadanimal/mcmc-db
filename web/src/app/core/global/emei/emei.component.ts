import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { environment } from "src/environments/environment";
import { variableConfigureService } from 'src/app/shared/services/variableConfigure/variableConfigure.service';

@Component({
  selector: 'app-emei',
  templateUrl: './emei.component.html',
  styleUrls: ['./emei.component.scss']
})
export class EmeiComponent implements OnInit {

  @ViewChild('captchaElem') captchaElem;
  @ViewChild('showResult') modalRef: any;
  infoTable = []
  variableTable = []
  searchIMEIForm: FormGroup
  test: Date = new Date();
  imei
  focusImei

  siteKey: string = environment.reCaptchaSiteKey;
  size: string = "normal";
  lang: string = "en";
  theme: string = "light";
  type: string = "image";

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;


  ImeiMessages = {
    'IMEI': [
      { type: 'required', message: 'IMEI is required' },
    ],
  }

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl"
  };

  constructor(
    private router: Router,
    private productGenerationService: ProductGenerationService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private variableConfigureService: variableConfigureService,
  ) { }

  ngOnInit() {
    this.disableSearch()
    
    this.searchIMEIForm = this.formBuilder.group({
      IMEI: new FormControl('' ,Validators.compose([
        Validators.required,
      ])),
      recaptcha: ["", Validators.required],
    }) 
    
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    console.log("HTTP",this.searchIMEIForm.value.IMEI)
    let datafield = "imeiNo="+this.searchIMEIForm.value.IMEI
    this.loadingBar.start(); 
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.loadingBar.complete();
        this.infoTable=res;
        console.log("wewe",this.infoTable.length);
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchIMEIForm.reset()
          this.captchaElem.reloadCaptcha()
        }
        else {
          this.openModal(this.modalRef)

        }
      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        this.searchIMEIForm.reset()
        this.captchaElem.reloadCaptcha()
      },
      () => console.log("HTTP request completed.")
    );
  }

  openModal(modalRef) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.searchIMEIForm.reset()
    this.captchaElem.reloadCaptcha();
  }

  errorMessage() {
    swal.fire({
      title: "Oops...",
      text: "Please enter valid IMEI No.!",
      type: "error",
      timer: 3000,
    })  
  }

  // ReCaptcha
  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    // this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    // this.cdr.detectChanges();
    this.verifyRecaptcha(captchaResponse);
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    // this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    // this.cdr.detectChanges();
  }

  verifyRecaptcha(response: string) {
    let obj = {
      secret: environment.reCaptchaSecretKey,
      response: response,
    };
    this.productGenerationService.verify_recaptcha(obj).subscribe(
      (res) => {
        // console.log("res", res);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

  disableSearch(){
    let varID = '0ea9871b-ab66-4556-9ecb-ef68273cd460';
    this.variableConfigureService.getOne(varID).subscribe(
      (res) => {
        this.variableTable = [res]
        this.variableTable = this.variableTable[0]
        console.log("wewe", this.variableTable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => console.log("HTTP request completed.")
    );
    console.log()

  }
  

}
