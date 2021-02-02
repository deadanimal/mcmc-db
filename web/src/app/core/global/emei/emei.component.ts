import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import swal from 'sweetalert2';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-emei',
  templateUrl: './emei.component.html',
  styleUrls: ['./emei.component.scss']
})
export class EmeiComponent implements OnInit {

  @ViewChild('showResult') modalRef: any;
  infoTable = []
  searchIMEIForm: FormGroup
  test: Date = new Date();
  imei
  focusImei


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
  ) { }

  ngOnInit() {
    this.searchIMEIForm = this.formBuilder.group({
      IMEI: new FormControl('' ,Validators.compose([
        Validators.required,
      ])),
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
        }
        else {
          this.openModal(this.modalRef)

        }
      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        this.searchIMEIForm.reset()
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
  }

  errorMessage() {
    swal.fire({
      title: "Oops...",
      text: "Something went wrong!",
      type: "error",
      timer: 3000,
    })  
  }

}
