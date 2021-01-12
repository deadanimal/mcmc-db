import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-emei',
  templateUrl: './emei.component.html',
  styleUrls: ['./emei.component.scss']
})
export class EmeiComponent implements OnInit {

  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  infoTable = []
  searchIMEIForm: FormGroup
  test: Date = new Date();
  imei

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl"
  };

  constructor(
    private router: Router,
    private productGenerationService: ProductGenerationService,
    private loadingBar: LoadingBarService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.searchIMEIForm = this.formBuilder.group({
      IMEI: new FormControl('', Validators.required),
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
        console.log("wewe",this.infoTable);
    
      },
      (err) => {
        this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => console.log("HTTP request completed.")
    );
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.searchIMEIForm.reset()
  }

}
