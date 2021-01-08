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
  product = null
  model = null

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
      MODEL: new FormControl(''),
      })
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    console.log("form",this.searchPRODUCTForm.value.PRODUCT, this.searchPRODUCTForm.value.MODEL)
    let datafield = "consigneeName="+this.searchPRODUCTForm.value.PRODUCT
    let datafield2 = "modelDescription="+this.searchPRODUCTForm.value.MODEL
    console.log("wewe",datafield, "modelDescription="+null)
    if (datafield2=="modelDescription="+null){
    this.masterDataService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res;
        console.log("if loop 1");
      },
      (err) => {
        console.log("HTTP Error", err);
      },
      () => console.log("HTTP request completed.")
    );
    }
    else {
      this.masterDataService.filter(datafield2).subscribe(
        (res) => {
          this.infoTable=res;
          console.log("if loop 2");
        },
        (err) => {
          console.log("HTTP Error", err);
        },
        () => console.log("HTTP request completed.")
      );
      }   
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
