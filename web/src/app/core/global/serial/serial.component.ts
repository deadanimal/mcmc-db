import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';
import { environment } from "src/environments/environment";
import { LoadingBarService } from '@ngx-loading-bar/core';
import swal from 'sweetalert2';


@Component({
  selector: 'app-serial',
  templateUrl: './serial.component.html',
  styleUrls: ['./serial.component.scss']
})
export class SerialComponent implements OnInit {

  @ViewChild('captchaElem') captchaElem;
  @ViewChild('showResult') modalRef: any;
  infoTable = []
  searchSERIALForm: FormGroup
  test: Date = new Date();
  serial
  focusSerial

  siteKey: string = environment.reCaptchaSiteKey;
  size: string = "normal";
  lang: string = "en";
  theme: string = "light";
  type: string = "image";

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  SerialMessages = {
    'SERIAL': [
      { type: 'required', message: 'Serial Number is required' },
    ],
  }

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl"
  };

  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.searchSERIALForm = this.formBuilder.group({
      SERIAL: new FormControl('' ,Validators.compose([
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
    console.log("HTTP",this.searchSERIALForm.value.SERIAL)
    let datafield = "serialNo="+this.searchSERIALForm.value.SERIAL
    this.loadingBar.start(); 
    this.masterDataService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchSERIALForm.reset()
          this.captchaElem.reloadCaptcha()
          
        }
        else {
          this.openModal(this.modalRef)
        }

      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        this.searchSERIALForm.reset()
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
    this.searchSERIALForm.reset()
    this.captchaElem.reloadCaptcha()
  }

  errorMessage() {
    swal.fire({
      title: "Oops...",
      text: "Please enter valid Serial No.!",
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
    this.masterDataService.verify_recaptcha(obj).subscribe(
      (res) => {
        // console.log("res", res);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

}