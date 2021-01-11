import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmailNotiService } from 'src/app/shared/services/emailNoti/emailNoti.service';

@Component({
  selector: 'app-system-noti',
  templateUrl: './system-noti.component.html',
  styleUrls: ['./system-noti.component.scss']
})
export class SystemNotiComponent implements OnInit {

  editEnabled: boolean = false
  editForm: FormGroup
  searchNOTIForm: FormGroup
  infoTable = []

  constructor(
    private formBuilder: FormBuilder,
    private EmailNotiService: EmailNotiService,
  ) { 
    this.productGeneration()
  }

  ngOnInit() {
    
  }

  toggleEdit() {
    this.editEnabled = !this.editEnabled
  }

  productGeneration() {
    
    this.EmailNotiService.get().subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
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
