import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-emei',
  templateUrl: './emei.component.html',
  styleUrls: ['./emei.component.scss']
})
export class EmeiComponent implements OnInit {

  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  infoTable = []
  searchIMEIForm: FormGroup

  constructor(
    private router: Router,
    private productGenerationService: ProductGenerationService,
    private loadingBar: LoadingBarService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.searchIMEIForm = this.formBuilder.group({
      IMEI: new FormControl(''),
    }) 
    
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    console.log("HTTP",this.searchIMEIForm.value.IMEI)
    let datafield = "IMEI="+this.searchIMEIForm.value.IMEI 
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.loadingBar.complete();
        this.infoTable=res;
        console.log("wewe",this.infoTable);
    
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
