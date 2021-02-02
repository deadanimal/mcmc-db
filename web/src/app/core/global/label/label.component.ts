import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { masterTable } from 'src/app/shared/services/masterData/masterData.model';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';
import Swal from 'sweetalert2';


export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  @ViewChild('showResult') modalRef: any;
  infoTable = []
  searchLABELForm: FormGroup
  test: Date = new Date();
  label
  focusLabel

  LabelMessages = {
    'LABEL': [
      { type: 'required', message: 'Labeling is required' },
    ],
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
    private productGenerationService: MasterDataService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    
  ) { }

  ngOnInit() {
    this.searchLABELForm = this.formBuilder.group({
      LABEL: new FormControl('' ,Validators.compose([
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
    this.loadingBar.start();
    console.log("HTTP",this.searchLABELForm.value.LABEL)
    let datafield = "SLPID="+this.searchLABELForm.value.LABEL 
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchLABELForm.reset()
        }
        else{
          this.openModal(this.modalRef)
        }
      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        this.searchLABELForm.reset()

      },
      () => console.log("HTTP request completed.")
    );
  }

  openModal(modalRef) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.searchLABELForm.reset()
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
