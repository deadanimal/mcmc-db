import { Component, OnInit, TemplateRef } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import noUiSlider from "nouislider";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import Quill from "quill";
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FAQTitleService } from 'src/app/shared/services/FAQTitle/FAQTitle.service';
import { FAQCategoriesService } from 'src/app/shared/services/FAQCategories/FAQCategories.service';


export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-system-faq',
  templateUrl: './system-faq.component.html',
  styleUrls: ['./system-faq.component.scss']
})
export class SystemFaqComponent implements OnInit {

  infoTable = []
  searchFAQForm: FormGroup

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  constructor(
    private modalService: BsModalService,
    private FAQTitleService: FAQTitleService,
    private FAQCategoriesService: FAQCategoriesService,
  ) {
    this.productGeneration2()
   }

  ngOnInit() {
    var quill = new Quill("#quill", {
      modules: {
        toolbar: [
          ["bold", "italic"],
          ["link", "blockquote", "code", "image"],
          [
            {
              list: "ordered"
            },
            {
              list: "bullet"
            }
          ]
        ]
      },
      placeholder: "Quill WYSIWYG",
      theme: "snow"
    });
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    // this.registerForm.reset()
  }

  confirm() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to create this new title?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        this.register()
      }
    })
  }

  register() {
    swal.fire({
      title: "Success",
      text: "A new title has been created!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        // this.registerForm.reset()
      }
    })
  }

  productGeneration() {
    console.log("HTTP",this.searchFAQForm.value.title)
    let datafield = "title="+this.searchFAQForm.value.title
    this.FAQTitleService.post(datafield).subscribe(
      (res) => {
        this.infoTable = [res]
        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });

      },
      (err) => {

      },
      () => {
        console.log("HTTP request completed.")

      }
    );
  }

  productGeneration2() {
    this.FAQCategoriesService.get().subscribe(
      (res) => {
        this.infoTable = [...res]
        console.log("zzzzz2 = ",this.infoTable)

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
      },
      () => {
        console.log("HTTP request completed.")
      }
    );
  }

  dropdownFAQ(event){
    console.log('event = ',event)
  }


}


