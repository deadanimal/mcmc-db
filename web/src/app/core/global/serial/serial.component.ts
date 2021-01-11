import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';


@Component({
  selector: 'app-serial',
  templateUrl: './serial.component.html',
  styleUrls: ['./serial.component.scss']
})
export class SerialComponent implements OnInit {

  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  infoTable = []
  searchSERIALForm: FormGroup
  test: Date = new Date();
  serial

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl"
  };

  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.searchSERIALForm = this.formBuilder.group({
    SERIAL: new FormControl('',Validators.required),
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
    this.masterDataService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
        // this.loadingBar.complete();
        // this.successMessage();
        // this.navigatePage("dashboard-admin");
      },
      (err) => {
        // this.loadingBar.complete();
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
    this.searchSERIALForm.reset()
  }

}
