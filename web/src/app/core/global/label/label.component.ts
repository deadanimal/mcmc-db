import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';


@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  infoTable = []
  searchLABELForm: FormGroup

  constructor(
    private router: Router,
    private productGenerationService: ProductGenerationService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.searchLABELForm = this.formBuilder.group({
      LABEL: new FormControl(''),
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

}
