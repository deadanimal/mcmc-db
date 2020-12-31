import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-productInfo',
  templateUrl: './productInfo.component.html',
  styleUrls: ['./productInfo.component.scss']
})
export class ProductInfoComponent implements OnInit {

  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  infoTable = []
  searchPRODUCTForm: FormGroup
  test: Date = new Date();
  product

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

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
    this.searchPRODUCTForm = this.formBuilder.group({
      PRODUCT: new FormControl('',Validators.required),
      })
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    console.log("HTTP",this.searchPRODUCTForm.value.PRODUCT)
    let datafield = "consigneeName="+this.searchPRODUCTForm.value.PRODUCT
    this.masterDataService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
        this.loadingBar.complete();
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
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }


  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

}
