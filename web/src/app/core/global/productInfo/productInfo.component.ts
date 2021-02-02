import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import Swal from 'sweetalert2';

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

  @ViewChild('showResult') modalRef: any;
  infoTable = []
  searchPRODUCTForm: FormGroup
  test: Date = new Date();
  product = null
  model = null 
  focusUsername
  focustype
  type:any

  loginFormMessages = {
    'PRODUCT': [
      { type: 'required', message: "Brand is required"},
    ],
    'TYPE': [
      { type: 'required', message: 'Please choose type' },
    ]
  }

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
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.searchPRODUCTForm = this.formBuilder.group({
      PRODUCT: new FormControl('' ,Validators.compose([
        Validators.required,
      ])),
      MODEL: new FormControl(''),
      TYPE: new FormControl('', Validators.compose([
        Validators.required,
      ]))
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
    let datafield2 = "consigneeName="+this.searchPRODUCTForm.value.PRODUCT+"&modelDescription="+this.searchPRODUCTForm.value.MODEL
    console.log("wewe",datafield2)
    this.loadingBar.start()
    if (datafield2=="consigneeName="+this.searchPRODUCTForm.value.PRODUCT+"&modelDescription="+null){
    this.masterDataService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res;
        console.log("if loop 1");
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchPRODUCTForm.reset()
        }
        else{
          this.openModal(this.modalRef)
        }
      },
      (err) => {
        console.log("HTTP Error", err);
        this.loadingBar.complete();
        this.errorMessage();
        this.searchPRODUCTForm.reset()
      },
      () => console.log("HTTP request completed.")
    );
    }
    else {
      this.masterDataService.filter(datafield2).subscribe(
        (res) => {
          this.infoTable=res;
          console.log("if loop 2");
          this.loadingBar.complete();
          if (this.infoTable.length == 0){
            this.errorMessage();
            this.searchPRODUCTForm.reset()
          }
          else{
            this.openModal(this.modalRef)
          }
        },
        (err) => {
          console.log("HTTP Error", err);
          this.loadingBar.complete();
          this.errorMessage();
          this.searchPRODUCTForm.reset()
        },
        () => console.log("HTTP request completed.")
      );
      }   
  }

  productGeneration2() {
    this.loadingBar.start()
    console.log("form",this.searchPRODUCTForm.value.PRODUCT, this.searchPRODUCTForm.value.MODEL)
    let datafield = "consigneeName="+this.searchPRODUCTForm.value.PRODUCT
    let datafield2 = "consigneeName="+this.searchPRODUCTForm.value.PRODUCT+"&modelDescription="+this.searchPRODUCTForm.value.MODEL
    console.log("wewe",datafield, "modelDescription="+null)
    if (datafield2=="consigneeName="+this.searchPRODUCTForm.value.PRODUCT+"&modelDescription="+null){
    this.masterDataService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res;
        console.log("if loop 1");
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchPRODUCTForm.reset()
        }
        else{
          this.openModal(this.modalRef)
        }
      },
      (err) => {
        console.log("HTTP Error", err);
        this.loadingBar.complete();
        this.errorMessage();
        this.searchPRODUCTForm.reset()
      },
      () => console.log("HTTP request completed.")
    );
    }
    else {
      this.masterDataService.filterMix(datafield2).subscribe(
        (res) => {
          this.infoTable=res;
          console.log("if loop 2");
          this.loadingBar.complete();
          if (this.infoTable.length == 0){
            this.errorMessage();
          }
          else {
            this.openModal(this.modalRef)
          }
          
        },
        (err) => {
          console.log("HTTP Error", err);
          this.loadingBar.complete();
          this.errorMessage();
        },
        () => console.log("HTTP request completed.")
      );
      }   
  }


  changeDropdown(event){
    if (event=="any"){
     
      console.log(event,'any loop')
    }
    else {
     
      console.log('exact loop')
    }
  }

  buttonSubmit(){
    console.log(this.type)
    console.log('button pressed')
    if (this.type=="any"){
      this.anySearch();
      console.log('any loop')
    }
    else {
      this.exactSearch();
      console.log('exact loop')
    }
  }

  anySearch(){
    console.log('anySearch')
    this.productGeneration2();
  }

  exactSearch(){
    this.productGeneration()
    console.log('exactSearch')
  }

  openModal(modalRef) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.searchPRODUCTForm.reset()

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

  errorMessage() {
    Swal.fire({
      title: "Oops...",
      text: "Something went wrong!",
      type: "error",
      timer: 3000,
    })  
  }

}
