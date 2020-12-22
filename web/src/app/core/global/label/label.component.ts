import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { masterTable } from 'src/app/shared/services/masterData/masterData.model';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';


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

  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  infoTable = []
  searchLABELForm: FormGroup
  
  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg"
  };

  constructor(
    private router: Router,
    private productGenerationService: MasterDataService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    
  ) { }

  ngOnInit() {
    this.searchLABELForm = this.formBuilder.group({
      LABEL: new FormControl('',Validators.required),
    })
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    console.log("HTTP",this.searchLABELForm.value.LABEL)
    let datafield = "SLPID="+this.searchLABELForm.value.LABEL 
    this.productGenerationService.filter(datafield).subscribe(
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
